/**
 * Checks seed/tems-seed/data.ndjson against the schema before import:
 * every field exists in its type, required fields are filled, references resolve to the right type,
 * singletons use their fixed IDs, and no ID contains a dot (a "." makes a document private in Sanity).
 *   pnpm --filter studio check:seed
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { schemaTypes, SINGLETONS } from '../schemaTypes';

// apps/studio is "type": "module"; __dirname is not defined under tsx ESM.
const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] ?? path.resolve(here, '../../../seed/tems-seed/data.ndjson');
const docs = fs.readFileSync(file, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const types = new Map<string, any>(schemaTypes.map((t: any) => [t.name, t]));
const byId = new Map(docs.map((d) => [d._id, d]));
const errors: string[] = [];
const IMAGE_KEYS = new Set(['_type', '_key', '_sanityAsset', 'asset', 'hotspot', 'crop']);
const BUILTIN = new Set(['string', 'text', 'number', 'boolean', 'url', 'date', 'datetime', 'slug', 'reference', 'image', 'array', 'object', 'block', 'geopoint', 'email']);

function isRequired(field: any): boolean {
  if (!field.validation) return false;
  let req = false;
  const rule: any = new Proxy({}, { get: (_t, p) => (p === 'required' ? () => { req = true; return rule; } : () => rule) });
  try { field.validation(rule); } catch { /* ignore */ }
  return req;
}

function resolve(typeName: string): any { return types.get(typeName); }

function checkValue(value: any, def: any, where: string) {
  const t = def.type;
  if (value === undefined || value === null) return;
  if (t === 'reference') {
    const target = byId.get(value._ref);
    const allowed = (def.to ?? []).map((x: any) => x.type);
    if (!target) errors.push(`${where}: reference to missing ${value._ref}`);
    else if (allowed.length && !allowed.includes(target._type)) errors.push(`${where}: ${value._ref} is ${target._type}, expected ${allowed.join('/')}`);
    return;
  }
  if (t === 'array') {
    if (!Array.isArray(value)) return errors.push(`${where}: expected array`);
    value.forEach((item, i) => {
      const w = `${where}[${i}]`;
      if (typeof item !== 'object') return;
      if (!item._key) errors.push(`${w}: missing _key`);
      const member = (def.of ?? []).find((m: any) => m.type === item._type || m.name === item._type) ?? (def.of ?? [])[0];
      if (!member) return errors.push(`${w}: no array member for ${item._type}`);
      if (member.type === 'block') return;
      checkValue(item, member, w);
    });
    return;
  }
  if (t === 'image' || resolve(t)?.type === 'image') {
    const own = [...(def.fields ?? []), ...(resolve(t)?.fields ?? [])].map((f: any) => f.name);
    for (const k of Object.keys(value)) if (!IMAGE_KEYS.has(k) && !own.includes(k)) errors.push(`${where}: unknown image field "${k}"`);
    if (!value._sanityAsset && !value.asset) errors.push(`${where}: image without asset`);
    return;
  }
  const fields = def.fields ?? resolve(t)?.fields;
  if ((t === 'object' || (resolve(t) && !BUILTIN.has(t))) && fields && typeof value === 'object') {
    checkFields(value, fields, where);
  }
}

function checkFields(obj: any, fields: any[], where: string) {
  const names = fields.map((f) => f.name);
  for (const k of Object.keys(obj)) {
    if (k.startsWith('_')) continue;
    if (!names.includes(k)) errors.push(`${where}: unknown field "${k}"`);
  }
  for (const f of fields) {
    const v = obj[f.name];
    if (isRequired(f) && (v === undefined || v === '' || (Array.isArray(v) && !v.length))) errors.push(`${where}.${f.name}: required but empty`);
    checkValue(v, f, `${where}.${f.name}`);
  }
}

for (const d of docs) {
  if (d._id.includes('.')) errors.push(`${d._id}: "." in an ID makes it private`);
  const t = resolve(d._type);
  if (!t) { errors.push(`${d._id}: unknown type ${d._type}`); continue; }
  if (SINGLETONS.includes(d._type) && d._id !== d._type) errors.push(`${d._id}: singleton must use ID "${d._type}"`);
  checkFields(d, t.fields, d._id);
}
for (const s of SINGLETONS) if (!byId.has(s)) errors.push(`missing singleton ${s}`);

const count = docs.reduce((m, d) => ((m[d._type] = (m[d._type] ?? 0) + 1), m), {} as Record<string, number>);
console.log(`${docs.length} documents:`, count);
if (errors.length) { console.error(`\n${errors.length} problem(s):\n` + errors.map((e) => ' - ' + e).join('\n')); process.exit(1); }
console.log('Seed OK: every field is in the schema, required fields are filled, references resolve.');
