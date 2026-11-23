import { mkdirSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { RsvpInput } from "./rsvp-validation";

/**
 * Persistent RSVP storage backed by SQLite (Node's built-in `node:sqlite`, no native deps).
 *
 * Configure the location with `RSVP_DB_PATH` (default: ./data/rsvp.sqlite).
 * NOTE: on serverless hosts (e.g. Vercel) the filesystem is ephemeral — point this at a
 * persistent volume or swap this module for a hosted database before going live.
 */

let db: DatabaseSync | null = null;

function getDb(): DatabaseSync {
  if (db) return db;
  const file = process.env.RSVP_DB_PATH || path.join(process.cwd(), "data", "rsvp.sqlite");
  mkdirSync(path.dirname(file), { recursive: true });
  const conn = new DatabaseSync(file);
  conn.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 3000;
    CREATE TABLE IF NOT EXISTS rsvp (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id   TEXT    NOT NULL UNIQUE,
      name            TEXT    NOT NULL,
      name_normalized TEXT    NOT NULL UNIQUE,
      attending       INTEGER NOT NULL CHECK (attending IN (0, 1)),
      guests          INTEGER NOT NULL CHECK (guests BETWEEN 0 AND 20),
      message         TEXT    NOT NULL DEFAULT '',
      ip_hash         TEXT    NOT NULL,
      user_agent      TEXT    NOT NULL DEFAULT '',
      created_at      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE INDEX IF NOT EXISTS rsvp_ip_created ON rsvp (ip_hash, created_at);
  `);
  db = conn;
  return conn;
}

export function hashIp(ip: string) {
  const salt = process.env.RSVP_IP_SALT || "alexandru-bianca-2027";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export type InsertResult = { status: "created"; id: number } | { status: "duplicate"; field: "submission" | "name" };

export function insertRsvp(
  data: RsvpInput & { submissionId: string; nameNormalized: string; ipHash: string; userAgent: string },
): InsertResult {
  const conn = getDb();
  const existing = conn.prepare("SELECT id FROM rsvp WHERE submission_id = ?").get(data.submissionId);
  if (existing) return { status: "duplicate", field: "submission" };
  try {
    const res = conn
      .prepare(
        `INSERT INTO rsvp (submission_id, name, name_normalized, attending, guests, message, ip_hash, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        data.submissionId,
        data.name,
        data.nameNormalized,
        data.attending ? 1 : 0,
        data.guests,
        data.message,
        data.ipHash,
        data.userAgent.slice(0, 300),
      );
    return { status: "created", id: Number(res.lastInsertRowid) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("UNIQUE") && msg.includes("submission_id")) return { status: "duplicate", field: "submission" };
    if (msg.includes("UNIQUE") && msg.includes("name_normalized")) return { status: "duplicate", field: "name" };
    throw err;
  }
}

/** Number of submissions from the same (hashed) IP within the last `minutes`. */
export function recentCountForIp(ipHash: string, minutes: number): number {
  const conn = getDb();
  const row = conn
    .prepare(
      `SELECT COUNT(*) AS c FROM rsvp
       WHERE ip_hash = ? AND created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', ?)`,
    )
    .get(ipHash, `-${minutes} minutes`) as { c: number } | undefined;
  return row?.c ?? 0;
}
