/** Shared enquiry field rules (FORMS.md) — used by the API and unit tests. */

export type EnquiryInput = {
  name?: unknown;
  artist?: unknown;
  email?: unknown;
  phone?: unknown;
  projectTypes?: unknown;
  preferredStart?: unknown;
  days?: unknown;
  message?: unknown;
  consent?: unknown;
  room?: unknown;
  company?: unknown;
};

export type EnquiryData = {
  name: string;
  artist: string;
  email: string;
  phone: string;
  projectTypes: string[];
  preferredStart: string | null;
  days: number | null;
  message: string;
  consent: true;
  room: string | null;
};

export type FieldErrors = Partial<Record<keyof EnquiryData | 'projectTypes' | 'consent', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\s-]*$/;

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim();
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Normalize projectTypes from JSON array or repeated form fields. */
export function normalizeProjectTypes(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => str(x)).filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()];
  return [];
}

export function isHoneypotFilled(input: EnquiryInput): boolean {
  return str(input.company).length > 0;
}

/**
 * Validate enquiry fields against allowed project types.
 * Returns `{ ok: true, data }` or `{ ok: false, fields }`.
 */
export function validateEnquiry(
  input: EnquiryInput,
  allowedTypes: string[],
): { ok: true; data: EnquiryData } | { ok: false; fields: FieldErrors } {
  const fields: FieldErrors = {};
  const name = str(input.name);
  const artist = str(input.artist);
  const email = str(input.email);
  const phone = str(input.phone);
  const message = str(input.message);
  const room = str(input.room) || null;
  const projectTypes = normalizeProjectTypes(input.projectTypes);
  const preferredRaw = str(input.preferredStart);
  const daysRaw = str(input.days);
  const consentRaw = input.consent;

  if (name.length < 2 || name.length > 80) fields.name = 'Name must be 2–80 characters';
  if (artist.length > 80) fields.artist = 'Artist must be ≤ 80 characters';
  if (!email || !EMAIL_RE.test(email)) fields.email = 'Valid email required';
  if (phone && (phone.length > 30 || !PHONE_RE.test(phone))) fields.phone = 'Phone must be ≤ 30 and use digits/spaces/+()-';
  if (projectTypes.length < 1) fields.projectTypes = 'Choose at least one project type';
  else if (projectTypes.some((t) => !allowedTypes.includes(t))) fields.projectTypes = 'Invalid project type';

  let preferredStart: string | null = null;
  if (preferredRaw) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredRaw) || preferredRaw < todayISO()) {
      fields.preferredStart = 'Start date must be today or later';
    } else preferredStart = preferredRaw;
  }

  let days: number | null = null;
  if (daysRaw) {
    const n = Number(daysRaw);
    if (!Number.isInteger(n) || n < 1 || n > 60) fields.days = 'Days must be an integer 1–60';
    else days = n;
  }

  if (message.length > 4000) fields.message = 'Message must be ≤ 4000 characters';

  const consentOk = consentRaw === true || consentRaw === 'true' || consentRaw === 'on' || consentRaw === '1';
  if (!consentOk) fields.consent = 'Consent is required';

  if (Object.keys(fields).length) return { ok: false, fields };

  return {
    ok: true,
    data: {
      name,
      artist,
      email,
      phone,
      projectTypes,
      preferredStart,
      days,
      message,
      consent: true,
      room,
    },
  };
}
