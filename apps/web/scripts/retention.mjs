#!/usr/bin/env node
/**
 * Delete formSubmission docs older than form.retentionMonths (FORMS.md / DEPLOY.md).
 * Env: PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET (default production),
 *      SANITY_WRITE_TOKEN (Editor — forms write token).
 *
 * Usage: node apps/web/scripts/retention.mjs
 */
import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || '2025-10-01',
  token,
  useCdn: false,
});

const months =
  (await client.fetch(
    `*[_type == "form" && key == "enquiry"][0].retentionMonths`,
  )) ?? 24;

const cutoff = new Date();
cutoff.setUTCMonth(cutoff.getUTCMonth() - Number(months));
const cutoffIso = cutoff.toISOString();

const ids = await client.fetch(
  `*[_type == "formSubmission" && defined(submittedAt) && submittedAt < $cutoff]._id`,
  { cutoff: cutoffIso },
);

if (!ids.length) {
  console.log(
    `No formSubmission older than ${months} months (before ${cutoffIso}).`,
  );
  process.exit(0);
}

const tx = client.transaction();
for (const id of ids) tx.delete(id);
await tx.commit();

console.log(
  `Deleted ${ids.length} formSubmission(s) older than ${months} months (before ${cutoffIso}).`,
);
