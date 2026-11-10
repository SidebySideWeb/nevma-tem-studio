#!/usr/bin/env node
/**
 * Lists what still has to be replaced before launch:
 *  1. "[bracketed]" placeholder text in the built site (apps/web/dist), per page;
 *  2. stand-in images still used in Sanity (files named standin-*), if Sanity env vars are set;
 *  3. empty slots the site fills with the design's striped placeholders (team photos, floor plans, map).
 * Usage: node scripts/check-placeholders.mjs [--strict] [--dist apps/web/dist]
 * --strict exits with code 1 when anything is found (use before launch).
 */
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const distArg = args.indexOf('--dist');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distCandidates = distArg >= 0
  ? [path.resolve(args[distArg + 1])]
  : [
      path.join(repoRoot, 'apps/web/dist/client'),
      path.join(repoRoot, 'apps/web/dist'),
      path.join(repoRoot, 'apps/web/.vercel/output/static'),
    ];
const dist = distCandidates.find((d) => fs.existsSync(d)) || distCandidates[0];
let found = 0;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

if (fs.existsSync(dist)) {
  const pages = walk(dist).filter((f) => f.endsWith('.html'));
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    const text = html.replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&');
    const attrs = [...html.matchAll(/(?:alt|placeholder|aria-label|content)="([^"]*\[[^"\]]+\][^"]*)"/g)].map((m) => m[1]);
    const hits = [...new Set([...text.matchAll(/\[[^\]\n]{2,160}\]/g)].map((m) => m[0]).concat(attrs))];
    const stripes = (html.match(/class="[^"]*\bph\b[^"]*"/g) || []).length;
    if (hits.length || stripes) {
      found += hits.length + stripes;
      console.log(`\n${path.relative(dist, file)}`);
      hits.slice(0, 40).forEach((h) => console.log(`  text: ${h}`));
      if (hits.length > 40) console.log(`  … and ${hits.length - 40} more`);
      if (stripes) console.log(`  ${stripes} striped placeholder slot(s) (missing photo, floor plan or map)`);
    }
  }
} else {
  console.log(`No build found at ${dist} — run the build first to check page text.`);
}

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID, token = process.env.SANITY_VIEWER_TOKEN;
if (projectId && token) {
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  const q = encodeURIComponent('*[_type=="sanity.imageAsset" && originalFilename match "standin-*"]{originalFilename, "usedBy": *[references(^._id)]{_type, _id}}');
  const res = await fetch(`https://${projectId}.api.sanity.io/v2025-10-01/data/query/${dataset}?query=${q}&perspective=published`, { headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) {
    const { result } = await res.json();
    const used = result.filter((a) => a.usedBy.length);
    if (used.length) {
      console.log('\nStand-in images still used in Sanity:');
      used.forEach((a) => console.log(`  ${a.originalFilename} → ${a.usedBy.map((d) => d._id).join(', ')}`));
      found += used.length;
    }
  } else console.log(`\n(Sanity check skipped: HTTP ${res.status})`);
} else {
  console.log('\n(Sanity stand-in image check skipped: set PUBLIC_SANITY_PROJECT_ID and SANITY_VIEWER_TOKEN)');
}

console.log(found ? `\n${found} item(s) to replace before launch.` : '\nNo placeholders found.');
process.exit(strict && found ? 1 : 0);
