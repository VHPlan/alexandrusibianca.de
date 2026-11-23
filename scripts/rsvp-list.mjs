// Lists all RSVP responses stored in the SQLite database.
// Usage: npm run rsvp:list   (optional: RSVP_DB_PATH=/path/to/rsvp.sqlite)
//        npm run rsvp:list -- --csv > rsvp.csv
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { existsSync } from "node:fs";

const file = process.env.RSVP_DB_PATH || path.join(process.cwd(), "data", "rsvp.sqlite");
if (!existsSync(file)) {
  console.error(`No RSVP database found at ${file}`);
  process.exit(1);
}
const db = new DatabaseSync(file, { readOnly: true });
const rows = db
  .prepare("SELECT id, created_at, name, attending, guests, message FROM rsvp ORDER BY created_at")
  .all();

if (process.argv.includes("--csv")) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  console.log("id,created_at,name,attending,guests,message");
  for (const r of rows)
    console.log([r.id, r.created_at, r.name, r.attending ? "da" : "nu", r.guests, r.message].map(esc).join(","));
} else {
  console.table(rows.map((r) => ({ ...r, attending: r.attending ? "da" : "nu" })));
  const yes = rows.filter((r) => r.attending);
  console.log(
    `Total răspunsuri: ${rows.length} · Participă: ${yes.length} (${yes.reduce((s, r) => s + r.guests, 0)} persoane) · Nu participă: ${rows.length - yes.length}`,
  );
}
