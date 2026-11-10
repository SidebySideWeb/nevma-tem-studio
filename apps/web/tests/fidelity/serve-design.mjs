// Self-test: serves design/build as if it were the site, so you can prove the fidelity test passes on your machine.
// node apps/web/tests/fidelity/serve-design.mjs design/build 4399  then  SITE_URL=http://localhost:4399 pnpm test:fidelity  → 16 passed
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = process.argv[2], port = Number(process.argv[3] || 4399);
const R = { '/': 'home.html', '/studio/studio-a': 'studio.html', '/about': 'about.html', '/clients': 'clients.html', '/sessions': 'sessions.html', '/enquire': 'enquire.html', '/contact': 'contact.html', '/enquire/thanks': 'enquire-sent.html' };
const T = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };
http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = R[u] ? R[u] : u.replace(/^\/(studio\/|enquire\/)?/, '');
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': T[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(port, () => console.log('serving', root, 'on', port));
