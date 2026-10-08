/* =====================================================================
   /api/secret — server-side key check (Vercel serverless function)

   Codul NU există în frontend. Se setează ca Environment Variable:
     SECRET_CODE = codul-vostru          (mai multe coduri: COD1,COD2)

   Conținutul secret (scenele) se trimite DOAR după validarea codului.
   ===================================================================== */
const crypto = require('crypto');
const FILM = require('./_film');

const WINDOW_MS = 10 * 60 * 1000;   // 10 minute
const MAX_TRIES = 8;                // încercări greșite / IP / fereastră
const fails = new Map();

const norm = (s) => String(s || '').normalize('NFKC').trim().toUpperCase().replace(/\s+/g, '');
const digest = (s) => crypto.createHash('sha256').update(s, 'utf8').digest();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 4096) req.destroy(); });
    req.on('end', () => resolve(data));
    req.on('error', () => resolve(''));
  });
}

function matches(input) {
  const codes = String(process.env.SECRET_CODE || '').split(',').map(norm).filter(Boolean);
  const given = digest(norm(input));
  let ok = false;
  for (const c of codes) ok = crypto.timingSafeEqual(given, digest(c)) || ok;
  return ok;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') { res.statusCode = 405; return res.end('{"ok":false}'); }
  if (!process.env.SECRET_CODE) { res.statusCode = 503; return res.end('{"ok":false}'); }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    (req.socket && req.socket.remoteAddress) || 'unknown';
  const now = Date.now();
  const rec = fails.get(ip);
  if (rec && now - rec.t > WINDOW_MS) fails.delete(ip);
  const cur = fails.get(ip);
  if (cur && cur.n >= MAX_TRIES) { res.statusCode = 429; return res.end('{"ok":false}'); }

  let body = req.body;
  if (body === undefined) body = await readBody(req);
  if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch (_) { body = {}; } }
  const code = body && typeof body.code === 'string' ? body.code.slice(0, 64) : '';

  if (!code || !matches(code)) {
    const r = fails.get(ip) || { n: 0, t: now };
    r.n += 1; fails.set(ip, r);
    await sleep(450 + Math.random() * 300);
    res.statusCode = 401;
    return res.end('{"ok":false}');
  }

  fails.delete(ip);
  res.statusCode = 200;
  return res.end(JSON.stringify({ ok: true, html: FILM }));
};
