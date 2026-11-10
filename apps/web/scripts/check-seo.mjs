#!/usr/bin/env node
/**
 * AC-12: every HTML page has one <title>, one meta description, one canonical,
 * one <h1>; report duplicate titles / descriptions / canonicals.
 * Usage: node apps/web/scripts/check-seo.mjs
 * Looks in apps/web/dist/client, then dist, then .vercel/output/static.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [
  path.join(root, 'dist', 'client'),
  path.join(root, 'dist'),
  path.join(root, '.vercel', 'output', 'static'),
];
const dist = candidates.find((d) => fs.existsSync(d));

if (!dist) {
  console.error('No build found. Run `pnpm --filter web build` first.');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return m ? m[1].trim() : '';
}

const files = walk(dist).filter((f) => f.endsWith('.html'));
const problems = [];
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();

for (const abs of files) {
  const file = path.relative(dist, abs).replaceAll('\\', '/');
  const html = fs.readFileSync(abs, 'utf8');

  const titleMatches = [...html.matchAll(/<title>([^<]*)<\/title>/gi)];
  if (titleMatches.length === 0) problems.push(`${file}: missing <title>`);
  else if (titleMatches.length > 1) problems.push(`${file}: ${titleMatches.length}× <title>`);
  const title = titleMatches[0]?.[1]?.trim() || '';

  const descTags = [...html.matchAll(/<meta\b[^>]*\bname=["']description["'][^>]*>/gi)];
  if (descTags.length === 0) problems.push(`${file}: missing meta description`);
  else if (descTags.length > 1) problems.push(`${file}: ${descTags.length}× meta description`);
  const description = descTags[0] ? attr(descTags[0][0], 'content') : '';

  const canTags = [...html.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi)];
  if (canTags.length === 0) problems.push(`${file}: missing canonical`);
  else if (canTags.length > 1) problems.push(`${file}: ${canTags.length}× canonical`);
  const canonical = canTags[0] ? attr(canTags[0][0], 'href') : '';

  const h1s = [...html.matchAll(/<h1\b[^>]*>/gi)];
  if (h1s.length === 0) problems.push(`${file}: missing <h1>`);
  else if (h1s.length > 1) problems.push(`${file}: ${h1s.length}× <h1>`);

  if (title) {
    if (!titles.has(title)) titles.set(title, []);
    titles.get(title).push(file);
  }
  if (description) {
    if (!descriptions.has(description)) descriptions.set(description, []);
    descriptions.get(description).push(file);
  }
  if (canonical) {
    if (!canonicals.has(canonical)) canonicals.set(canonical, []);
    canonicals.get(canonical).push(file);
  }
}

function reportDupes(map, label) {
  for (const [value, pages] of map) {
    if (pages.length > 1) {
      problems.push(
        `duplicate ${label} (${pages.length}): ${JSON.stringify(value)}\n    ${pages.join(', ')}`,
      );
    }
  }
}

reportDupes(titles, 'title');
reportDupes(descriptions, 'description');
reportDupes(canonicals, 'canonical');

console.log(`Checked ${files.length} HTML files in ${path.relative(process.cwd(), dist) || dist}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  problems.forEach((p) => console.log(`  • ${p}`));
  process.exit(1);
}
console.log('No problems.');
