#!/usr/bin/env node
/** AC-14: ≤ 10 KB gzipped JS per page (local script tags only). */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist/client');
if (!fs.existsSync(root)) {
  console.error('No dist/client — run build first');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const pages = walk(root).filter((f) => f.endsWith('.html'));
const rows = [];

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  let bytes = 0;
  const files = [];
  for (const src of scripts) {
    if (/^https?:\/\//.test(src)) {
      files.push(`${src} (external)`);
      continue;
    }
    const rel = src.replace(/^\//, '');
    const fp = path.join(root, rel);
    if (!fs.existsSync(fp)) {
      files.push(`${rel} MISSING`);
      continue;
    }
    const gz = zlib.gzipSync(fs.readFileSync(fp)).length;
    bytes += gz;
    files.push(`${rel}:${gz}`);
  }
  rows.push({
    page: path.relative(root, page).replaceAll('\\', '/'),
    kb: +(bytes / 1024).toFixed(2),
    bytes,
    files,
  });
}

rows.sort((a, b) => b.bytes - a.bytes);
console.log('AC-14 JS gzip per page (limit 10 KB):');
let fails = 0;
for (const r of rows) {
  const ok = r.kb <= 10;
  if (!ok) fails += 1;
  console.log(
    ok ? 'OK' : 'FAIL',
    `${r.kb}KB`,
    r.page,
    r.files.join(', ') || '(no local scripts)',
  );
}
console.log(fails ? `${fails} over budget` : 'All pages ≤ 10 KB gz JS');
process.exit(fails ? 1 : 0);
