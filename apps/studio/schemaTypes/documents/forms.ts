import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Forms live entirely in Sanity, as on the Nevma Music site: the form definition (editable options,
 * recipients, auto-reply) and one formSubmission document per enquiry. No Supabase on this site.
 */
export const form = defineType({
  name: 'form',
  title: 'Form',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'key', type: 'string', readOnly: true, description: 'Used by the site. Do not change.', validation: (r) => r.required() }),
    defineField({ name: 'projectTypes', title: 'Type of project options', type: 'array', of: [defineArrayMember({ type: 'string' })], description: 'The choice buttons. The design has six.', validation: (r) => r.min(1) }),
    defineField({ name: 'defaultProjectType', title: 'Selected by default', type: 'string' }),
    defineField({ name: 'notify', title: 'Send enquiries to', type: 'array', of: [defineArrayMember({ type: 'string', validation: (r) => r.email() })], validation: (r) => r.min(1) }),
    defineField({ name: 'autoReplySubject', title: 'Confirmation email subject', type: 'string' }),
    defineField({ name: 'autoReplyBody', title: 'Confirmation email text', type: 'text', rows: 6, description: '{name} is replaced with the sender’s name.' }),
    defineField({ name: 'retentionMonths', title: 'Keep submissions for (months)', type: 'number', initialValue: 24 }),
  ],
});

export const formSubmission = defineType({
  name: 'formSubmission',
  title: 'Submission',
  type: 'document',
  readOnly: ({ currentUser }) => !currentUser?.roles.some((r) => r.name === 'administrator'),
  fields: [
    defineField({ name: 'form', type: 'reference', to: [{ type: 'form' }], readOnly: true }),
    defineField({ name: 'status', type: 'string', options: { list: ['new', 'replied', 'booked', 'closed', 'spam'], layout: 'radio' }, initialValue: 'new' }),
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'artist', title: 'Artist / project', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'projectTypes', type: 'array', of: [defineArrayMember({ type: 'string' })], readOnly: true }),
    defineField({ name: 'preferredStart', type: 'date', readOnly: true }),
    defineField({ name: 'days', title: 'Days needed', type: 'number', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'room', title: 'Asked about room', type: 'string', readOnly: true }),
    defineField({ name: 'consent', type: 'boolean', readOnly: true }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'notes', title: 'Internal notes', type: 'text', rows: 3 }),
  ],
  orderings: [{ title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] }],
  preview: {
    select: { name: 'name', artist: 'artist', status: 'status', at: 'submittedAt' },
    prepare: ({ name, artist, status, at }) => ({ title: `${name ?? '—'}${artist ? ' · ' + artist : ''}`, subtitle: `${(status ?? 'new').toUpperCase()} · ${at ? new Date(at).toLocaleString('en-GB') : ''}` }),
  },
});

export const forms = [form, formSubmission];
