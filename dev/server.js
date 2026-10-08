/* Local dev server: static files + /api/secret (same handler as Vercel).
   Pornire (PowerShell):
     $env:SECRET_CODE="CODUL-VOSTRU"; node dev/server.js
   apoi deschide http://localhost:5173/secret */
const http = require('http');
const fs = require('fs');
const path = require('path');
const secret = require('../api/secret');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 5173;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);

  if (p === '/api/secret') return secret(req, res);
  if (p.startsWith('/api/') || p.startsWith('/dev/') || p.startsWith('/.git')) { res.statusCode = 404; return res.end('Not found'); }
  if (/^\/nasii(\/.*)?$/.test(p)) { res.writeHead(308, { Location: '/secret' }); return res.end(); }
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(308, { Location: p.slice(0, -1) + url.search }); return res.end(); }

  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end(); }
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  } catch (_) {
    if (fs.existsSync(file + '.html')) file += '.html';
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(PORT, () => console.log('Dev server: http://localhost:' + PORT + '  (SECRET_CODE ' + (process.env.SECRET_CODE ? 'setat' : 'LIPSĂ') + ')'));
