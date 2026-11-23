# Alexandru & Bianca — 15.10.2027

Wedding invitation website for **alexandrusibianca.de** (Next.js 16 · TypeScript · Tailwind CSS 4 · Motion).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production
```

Requires **Node.js ≥ 22.13** (uses the built-in `node:sqlite` module for RSVP storage).

## Editing content

All texts, names, dates, event hours, locations and image paths live in
[`src/config/wedding.ts`](src/config/wedding.ts). Unconfirmed values are `null` /
`confirmed: false` — the site then shows a tasteful "va fi anunțat" text, and in development
(`npm run dev`) an extra **NECONFIRMAT** badge marks them.

- Event hours → `timeline.events[].time` + `confirmed: true`
- Church → `locations[0].name / address / city / mapsQuery`
- Reception address → `locations[1].address`
- RSVP deadline → `rsvp.deadline` (e.g. `"15 August 2027"`)
- Godparent photos → put files in `public/images/wedding/` and set `godparents[].photo`
- Musician photos (licensed) → `musicians.artists[].photo`, set `illustrative: false`
- Full love story → `story.full` (array of paragraphs)

## RSVP

`POST /api/rsvp` — validated on the client and the server (shared rules in
`src/lib/rsvp-validation.ts`), protected by honeypot, minimum fill time, same-origin check,
per-IP rate limiting, idempotent submission IDs and duplicate-name detection.

Responses are stored in SQLite at `RSVP_DB_PATH` (default `./data/rsvp.sqlite`, git-ignored).

```bash
npm run rsvp:list            # table + totals
npm run rsvp:list -- --csv   # CSV export
```

> ⚠️ Serverless hosts (Vercel etc.) have an ephemeral filesystem. Before going live, either
> host on a server/VPS with a persistent volume, or swap `src/lib/rsvp-db.ts` for a hosted
> database (Postgres, Turso, Supabase…).

## Images

`public/images/wedding/` — supplied crops `01`–`14` (illustrative, low resolution).
`public/images/wedding/generated/` — high-resolution atmospheric decor images without people
(hero, details, RSVP, satin, gallery). Replace with real photography when available.
