/**
 * POST /api/enquiry — JSON (JS) or urlencoded (no JS).
 * Order: rate limit → honeypot → Turnstile → validate → save → emails (FORMS.md).
 */
export const prerender = false;

import { client } from '../../lib/sanity';
import { __e2eMails, sendEnquiryEmails } from '../../lib/server/mail';
import { __resetRateLimitForTests, rateLimit } from '../../lib/server/ratelimit';
import { verifyTurnstile } from '../../lib/server/turnstile';
import {
  isHoneypotFilled,
  normalizeProjectTypes,
  validateEnquiry,
  type EnquiryInput,
} from '../../lib/server/validate';
import { __e2eSubs, saveSubmission } from '../../lib/server/write-client';

type FormDoc = {
  _id: string;
  projectTypes?: string[];
  notify?: string[];
  autoReplySubject?: string | null;
  autoReplyBody?: string | null;
};

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function wantsJson(request: Request): boolean {
  const ct = request.headers.get('content-type') || '';
  return ct.includes('application/json');
}

function redirect(location: string, status = 303): Response {
  return new Response(null, { status, headers: { Location: location } });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

async function readBody(request: Request): Promise<EnquiryInput & { 'cf-turnstile-response'?: string }> {
  if (wantsJson(request)) {
    const data = (await request.json()) as Record<string, unknown>;
    return {
      ...data,
      projectTypes: normalizeProjectTypes(data.projectTypes),
      'cf-turnstile-response': str(data['cf-turnstile-response'] ?? data.turnstileToken),
    };
  }
  const form = await request.formData();
  const projectTypes = form.getAll('projectTypes').map((v) => String(v));
  return {
    name: form.get('name'),
    artist: form.get('artist'),
    email: form.get('email'),
    phone: form.get('phone'),
    projectTypes,
    preferredStart: form.get('preferredStart'),
    days: form.get('days'),
    message: form.get('message'),
    consent: form.get('consent'),
    room: form.get('room'),
    company: form.get('company'),
    'cf-turnstile-response': str(form.get('cf-turnstile-response')),
  };
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function studioDocUrl(id: string): string {
  const host = process.env.SANITY_STUDIO_HOST || 'tems';
  return `https://${host}.sanity.studio/intent/edit/id=${encodeURIComponent(id)};type=formSubmission`;
}

export async function POST({ request }: { request: Request }) {
  const asJson = wantsJson(request);
  const ip = clientIp(request);

  // e2e helper: reset rate-limit buckets between cases (does not consume a slot)
  if (
    (process.env.E2E_MOCK_OUTBOUND || import.meta.env.E2E_MOCK_OUTBOUND) === '1' &&
    request.headers.get('x-e2e-reset-ratelimit') === '1'
  ) {
    __resetRateLimitForTests();
    __e2eMails.length = 0;
    __e2eSubs.length = 0;
    return json({ ok: true, reset: true });
  }

  const limited = rateLimit(ip);
  if (!limited.ok) {
    if (asJson) return json({ ok: false, error: 'rate_limit' }, 429);
    return redirect('/enquire?error=1');
  }

  let body: EnquiryInput & { 'cf-turnstile-response'?: string };
  try {
    body = await readBody(request);
  } catch {
    if (asJson) return json({ ok: false, error: 'validation' }, 400);
    return redirect('/enquire?error=1');
  }

  // 2. Honeypot → fake success, store nothing
  if (isHoneypotFilled(body)) {
    if (asJson) return json({ ok: true });
    return redirect('/enquire/thanks');
  }

  // 3. Turnstile (invisible cannot run without JS — see DECISIONS)
  const token = str(body['cf-turnstile-response']);
  const testSecret = '1x0000000000000000000000000000000AA';
  const secret = import.meta.env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || '';
  const e2eMock = (process.env.E2E_MOCK_OUTBOUND || import.meta.env.E2E_MOCK_OUTBOUND) === '1';
  let captchaOk = false;
  if (!token && !asJson && secret === testSecret) {
    captchaOk = true; // local/e2e test secret only: allow urlencoded posts without a widget token
  } else if (e2eMock && token === 'XXXX.DUMMY.TOKEN.XXXX') {
    captchaOk = true; // Playwright stub token
  } else {
    captchaOk = await verifyTurnstile(token, ip === 'unknown' ? null : ip);
  }
  if (!captchaOk) {
    if (asJson) return json({ ok: false, error: 'captcha' }, 400);
    return redirect('/enquire?error=1');
  }

  // 4. Validate (need form options from Sanity)
  const formDoc = await client.fetch<FormDoc | null>(
    `*[_type == "form" && key == "enquiry"][0]{ _id, projectTypes, notify, autoReplySubject, autoReplyBody }`,
  );
  if (!formDoc?._id) {
    if (asJson) return json({ ok: false, error: 'server' }, 500);
    return redirect('/enquire?error=1');
  }

  const validated = validateEnquiry(body, formDoc.projectTypes || []);
  if (!validated.ok) {
    if (asJson) return json({ ok: false, error: 'validation', fields: validated.fields }, 400);
    return redirect('/enquire?error=1');
  }

  const id = `submission-${crypto.randomUUID()}`;
  const data = validated.data;

  // 5. Save
  const saved = await saveSubmission({ id, formId: formDoc._id, data });

  // 6–7. Emails (always try; if save failed, mark NOT SAVED)
  const settings = await client.fetch<{ email?: string } | null>(
    `*[_id == "siteSettings"][0]{ email }`,
  );
  const mails = await sendEnquiryEmails({
    data,
    form: formDoc,
    id,
    studioEmail: settings?.email || '',
    studioUrl: studioDocUrl(id),
    notSaved: !saved.ok,
  });

  if (!saved.ok && !mails.notification) {
    console.error('enquiry failed', id);
    if (asJson) return json({ ok: false, error: 'server' }, 500);
    return redirect('/enquire?error=1');
  }

  console.info('enquiry ok', id);

  if (asJson) {
    const mock = (process.env.E2E_MOCK_OUTBOUND || import.meta.env.E2E_MOCK_OUTBOUND) === '1';
    return json({
      ok: true,
      id,
      ...(mock ? { e2e: { submission: __e2eSubs.at(-1) ?? null, mails: [...__e2eMails] } } : {}),
    });
  }
  return redirect('/enquire/thanks');
}
