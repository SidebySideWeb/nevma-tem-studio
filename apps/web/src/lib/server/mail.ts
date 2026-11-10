import { Resend } from 'resend';
import type { EnquiryData } from './validate';

export type MailForm = {
  notify?: string[] | null;
  autoReplySubject?: string | null;
  autoReplyBody?: string | null;
};

export type MailResult = { notification: boolean; autoReply: boolean };

type Outbound = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

/** When E2E_MOCK_OUTBOUND=1, emails are captured here instead of Resend. */
export const __e2eMails: Outbound[] = [];

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linesToHtml(text: string): string {
  // Plain pre — keep apps/web/src free of inline CSS attributes (AC-03).
  return `<pre>${esc(text)}</pre>`;
}

function notificationBodies(data: EnquiryData, opts: { id: string; studioUrl: string; notSaved?: boolean }) {
  const subject = `New enquiry — ${data.name}${data.artist ? ` · ${data.artist}` : ''}${opts.notSaved ? ' (NOT SAVED)' : ''}`;
  const text = [
    opts.notSaved ? 'WARNING: This enquiry was NOT saved to Sanity.' : 'New enquiry saved.',
    '',
    `Name: ${data.name}`,
    `Artist / project: ${data.artist || '—'}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || '—'}`,
    `Project types: ${data.projectTypes.join(', ')}`,
    `Preferred start: ${data.preferredStart || '—'}`,
    `Days: ${data.days ?? '—'}`,
    `Room: ${data.room || '—'}`,
    '',
    'Message:',
    data.message || '—',
    '',
    `Studio: ${opts.studioUrl}`,
    `Submission id: ${opts.id}`,
  ].join('\n');
  return { subject, text, html: linesToHtml(text) };
}

function autoReplyBodies(data: EnquiryData, form: MailForm) {
  const subject = (form.autoReplySubject || 'We have your enquiry — TEMS').replaceAll('{name}', data.name);
  const text = (form.autoReplyBody || 'Hi {name},\n\nThanks for getting in touch.\n\nTEMS').replaceAll('{name}', data.name);
  return { subject, text, html: linesToHtml(text) };
}

function resendClient(): Resend | null {
  const key = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function mockOutbound(): boolean {
  return (process.env.E2E_MOCK_OUTBOUND || import.meta.env.E2E_MOCK_OUTBOUND) === '1';
}

async function send(msg: Outbound & { from: string }): Promise<boolean> {
  if (mockOutbound()) {
    __e2eMails.push(msg);
    return true;
  }
  const client = resendClient();
  if (!client) return false;
  const { error } = await client.emails.send({
    from: msg.from,
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
    replyTo: msg.replyTo,
  });
  return !error;
}

export async function sendEnquiryEmails(opts: {
  data: EnquiryData;
  form: MailForm;
  id: string;
  studioEmail: string;
  studioUrl: string;
  notSaved?: boolean;
}): Promise<MailResult> {
  const from = import.meta.env.MAIL_FROM || process.env.MAIL_FROM || 'TEMS <onboarding@resend.dev>';
  const notifyTo = (opts.form.notify || []).filter(Boolean);
  const note = notificationBodies(opts.data, {
    id: opts.id,
    studioUrl: opts.studioUrl,
    notSaved: opts.notSaved,
  });

  let notification = false;
  if (notifyTo.length) {
    notification = await send({
      from,
      to: notifyTo,
      subject: note.subject,
      text: note.text,
      html: note.html,
      replyTo: opts.data.email,
    });
  }

  const auto = autoReplyBodies(opts.data, opts.form);
  const autoReply = await send({
    from,
    to: [opts.data.email],
    subject: auto.subject,
    text: auto.text,
    html: auto.html,
    replyTo: opts.studioEmail || undefined,
  });

  return { notification, autoReply };
}
