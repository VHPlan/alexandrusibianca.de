import { NextResponse, type NextRequest } from "next/server";
import { RSVP_LIMITS, normalizeName, validateRsvp } from "@/lib/rsvp-validation";
import { hashIp, insertRsvp, recentCountForIp } from "@/lib/rsvp-db";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY = 8_000;

// Burst limiter (per server instance): max 6 attempts / 10 minutes / IP
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  attempts.set(key, list);
  if (attempts.size > 5000) attempts.clear();
  return list.length > MAX_ATTEMPTS;
}

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  // Same-origin check (browsers always send Origin on POST fetch)
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return json(403, { ok: false, error: "Cerere nepermisă." });
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json(415, { ok: false, error: "Format nesuportat." });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  const ipHash = hashIp(ip);

  if (rateLimited(ipHash)) {
    return json(429, { ok: false, error: "Prea multe încercări. Vă rugăm să reveniți peste câteva minute." });
  }

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json(413, { ok: false, error: "Mesajul este prea lung." });
    body = JSON.parse(text);
  } catch {
    return json(400, { ok: false, error: "Date invalide." });
  }

  // Honeypot + time-to-fill bot checks
  const startedAt = Number(body.startedAt);
  if (typeof body.website === "string" && body.website.length > 0) {
    return json(400, { ok: false, error: "Cererea nu a putut fi procesată." });
  }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < RSVP_LIMITS.minFillMs) {
    return json(400, { ok: false, error: "Formularul a fost trimis prea repede. Vă rugăm să încercați din nou." });
  }

  const submissionId = typeof body.submissionId === "string" ? body.submissionId : "";
  if (!UUID_RE.test(submissionId)) return json(400, { ok: false, error: "Date invalide." });

  const result = validateRsvp(body);
  if (!result.ok) {
    return json(422, { ok: false, error: "Vă rugăm să verificați câmpurile marcate.", fieldErrors: result.errors });
  }

  try {
    if (recentCountForIp(ipHash, 60) >= 20) {
      return json(429, { ok: false, error: "Prea multe confirmări din aceeași rețea. Vă rugăm să ne contactați direct." });
    }

    const saved = insertRsvp({
      ...result.data,
      submissionId,
      nameNormalized: normalizeName(result.data.name),
      ipHash,
      userAgent: req.headers.get("user-agent") ?? "",
    });

    if (saved.status === "duplicate" && saved.field === "submission") {
      // Same form submitted twice (double click / retry) — it is already stored.
      return json(200, { ok: true, duplicate: true });
    }
    if (saved.status === "duplicate") {
      return json(409, {
        ok: false,
        error: "Există deja o confirmare pe acest nume. Dacă doriți să o modificați, vă rugăm să ne contactați.",
        fieldErrors: { name: "Acest nume a confirmat deja." },
      });
    }
    return json(201, { ok: true, id: saved.id });
  } catch (err) {
    console.error("[rsvp] database error:", err);
    return json(503, {
      ok: false,
      error: "Confirmarea nu a putut fi salvată momentan. Vă rugăm să încercați din nou mai târziu.",
    });
  }
}
