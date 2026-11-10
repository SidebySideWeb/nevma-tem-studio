import { defineField, defineType } from 'sanity';

/** Internal pages a button can point to. Keep in step with docs/PAGES.md. */
export const PAGE_KEYS = [
  { title: 'Home', value: 'home' },
  { title: 'The Studio (first room)', value: 'studio' },
  { title: 'About', value: 'about' },
  { title: 'Clients', value: 'clients' },
  { title: 'Sessions', value: 'sessions' },
  { title: 'Register interest', value: 'enquire' },
  { title: 'Contact', value: 'contact' },
];

/** A button or text link: an internal page, a room, or an external URL. */
export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required().max(40) }),
    defineField({ name: 'page', title: 'Internal page', type: 'string', options: { list: PAGE_KEYS } }),
    defineField({ name: 'room', title: 'Or a room', type: 'reference', to: [{ type: 'room' }] }),
    defineField({ name: 'url', title: 'Or an external URL', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }) }),
  ],
  preview: { select: { title: 'label', subtitle: 'page' } },
});

/**
 * Display headings are set in the design on fixed lines ("The" / "Records").
 * Editors type one line per row; the site renders each row on its own line (<br>).
 */
export const displayHeading = defineType({
  name: 'displayHeading',
  title: 'Display heading',
  type: 'text',
  rows: 2,
  description: 'One line per row, exactly as it should break on desktop. Keep it short: the design uses 1–2 words per line.',
});

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alternative text', type: 'string', description: 'Describe the photo for screen readers. Leave empty only for purely decorative photos.' }),
  ],
});

export const statItem = defineType({
  name: 'statItem',
  title: 'Number',
  type: 'object',
  fields: [
    defineField({ name: 'value', type: 'string', validation: (r) => r.required().max(12) }),
    defineField({ name: 'label', type: 'string', validation: (r) => r.required().max(28) }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

export const labelValue = defineType({
  name: 'labelValue',
  title: 'Label and value',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

export const numberedText = defineType({
  name: 'numberedText',
  title: 'Numbered item',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'text', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'text' } },
});

/** The orange closing band used on Home, Room, Clients and Sessions. */
export const ctaBand = defineType({
  name: 'ctaBand',
  title: 'Closing band (orange)',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'displayHeading', validation: (r) => r.required() }),
    defineField({ name: 'text', type: 'text', rows: 2 }),
    defineField({ name: 'primary', title: 'Main button', type: 'cta' }),
    defineField({ name: 'secondary', title: 'Second button', type: 'cta' }),
  ],
});

/** A block heading made of a small chapter label and a big display title. */
export const chapterHeading = defineType({
  name: 'chapterHeading',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({ name: 'chapter', title: 'Chapter label', type: 'string', description: 'Small mono label above the title, e.g. "CH 01".' }),
    defineField({ name: 'title', type: 'displayHeading', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(60).warning('Over 60 characters gets cut in search results.') }),
    defineField({ name: 'description', type: 'text', rows: 2, validation: (r) => r.max(160).warning('Over 160 characters gets cut in search results.') }),
    defineField({ name: 'image', title: 'Share image', type: 'image', description: '1200 × 630.' }),
    defineField({ name: 'noindex', title: 'Hide from search engines', type: 'boolean', initialValue: false }),
  ],
});

export const sharedObjects = [cta, displayHeading, imageWithAlt, statItem, labelValue, numberedText, ctaBand, chapterHeading, seo];
