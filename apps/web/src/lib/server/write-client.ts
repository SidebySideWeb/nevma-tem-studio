/**
 * Sanity write client — API routes only. Uses SANITY_WRITE_TOKEN.
 * Never import from client `<script>` tags or shared page components.
 */
import { createClient } from '@sanity/client';
import type { EnquiryData } from './validate';

export const writeClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  useCdn: false,
  token: import.meta.env.SANITY_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
});

export type SavedSubmission = EnquiryData & {
  _id: string;
  _type: 'formSubmission';
  form: { _type: 'reference'; _ref: string };
  status: 'new';
  submittedAt: string;
};

/** When E2E_MOCK_OUTBOUND=1, submissions are captured here instead of Sanity. */
export const __e2eSubs: SavedSubmission[] = [];

function mockOutbound(): boolean {
  return (process.env.E2E_MOCK_OUTBOUND || import.meta.env.E2E_MOCK_OUTBOUND) === '1';
}

export async function saveSubmission(opts: {
  id: string;
  formId: string;
  data: EnquiryData;
}): Promise<{ ok: true; id: string } | { ok: false }> {
  const doc: SavedSubmission = {
    _id: opts.id,
    _type: 'formSubmission',
    form: { _type: 'reference', _ref: opts.formId },
    status: 'new',
    submittedAt: new Date().toISOString(),
    ...opts.data,
  };

  if (mockOutbound()) {
    __e2eSubs.push(doc);
    return { ok: true, id: opts.id };
  }

  try {
    await writeClient.createIfNotExists(doc);
    return { ok: true, id: opts.id };
  } catch {
    return { ok: false };
  }
}
