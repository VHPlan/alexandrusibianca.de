/** Shared RSVP validation — used by both the client form and the API route. */

export const RSVP_LIMITS = {
  nameMin: 3,
  nameMax: 100,
  messageMax: 1000,
  maxGuests: 10,
  /** Minimum time (ms) a human needs to fill the form — faster submissions are treated as bots. */
  minFillMs: 2500,
} as const;

export type RsvpInput = {
  name: string;
  guests: number;
  attending: boolean;
  message: string;
};

export type RsvpErrors = Partial<Record<keyof RsvpInput, string>>;

const NAME_RE = /^[\p{L}][\p{L}\p{M}' .\-]*$/u;

export function normalizeName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();
}

export function validateRsvp(raw: unknown): { ok: true; data: RsvpInput } | { ok: false; errors: RsvpErrors } {
  const errors: RsvpErrors = {};
  const r = (raw ?? {}) as Record<string, unknown>;

  const name = typeof r.name === "string" ? r.name.replace(/\s+/g, " ").trim() : "";
  if (name.length < RSVP_LIMITS.nameMin) errors.name = "Vă rugăm să introduceți numele și prenumele.";
  else if (name.length > RSVP_LIMITS.nameMax) errors.name = "Numele este prea lung.";
  else if (!NAME_RE.test(name)) errors.name = "Numele conține caractere nepermise.";
  else if (!name.includes(" ")) errors.name = "Vă rugăm să introduceți atât numele, cât și prenumele.";

  let attending: boolean | null = null;
  if (r.attending === true || r.attending === "yes") attending = true;
  else if (r.attending === false || r.attending === "no") attending = false;
  if (attending === null) errors.attending = "Vă rugăm să alegeți dacă participați.";

  const guestsNum = typeof r.guests === "number" ? r.guests : Number(r.guests);
  let guests = 0;
  if (attending) {
    if (!Number.isInteger(guestsNum) || guestsNum < 1 || guestsNum > RSVP_LIMITS.maxGuests) {
      errors.guests = `Alegeți un număr între 1 și ${RSVP_LIMITS.maxGuests}.`;
    } else guests = guestsNum;
  }

  const message = typeof r.message === "string" ? r.message.trim() : "";
  if (message.length > RSVP_LIMITS.messageMax)
    errors.message = `Mesajul poate avea maximum ${RSVP_LIMITS.messageMax} de caractere.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, guests, attending: attending as boolean, message } };
}
