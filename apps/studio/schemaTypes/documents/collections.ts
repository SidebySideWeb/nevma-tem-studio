import { defineArrayMember, defineField, defineType } from 'sanity';

/** A room of the studio. The room page (/studio/<slug>) and the room cards come from here. */
export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'hero', title: 'Top of page' },
    { name: 'story', title: 'The room' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'equipment', title: 'Equipment' },
    { name: 'close', title: 'Closing band' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'card', validation: (r) => r.required().max(16) }),
    defineField({ name: 'slug', type: 'slug', group: 'card', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', group: 'card', description: 'Room 01 is the page "The Studio" opens. Numbers also set "Room 02 / 03".', validation: (r) => r.required().integer().min(1) }),
    defineField({ name: 'cardImage', title: 'Card photo', type: 'imageWithAlt', group: 'card', validation: (r) => r.required() }),
    defineField({ name: 'cardLabel', title: 'Card label', type: 'string', group: 'card', description: 'Mono label next to the name on Home, e.g. "Tracking · Mix". The arrow is added by the site.', validation: (r) => r.required().max(22) }),
    defineField({ name: 'wideImage', title: 'Wide card photo', type: 'imageWithAlt', group: 'card', description: 'Used in "Other rooms" on the room pages (16:10). Empty = card photo.' }),

    defineField({ name: 'heroImage', title: 'Photo', type: 'imageWithAlt', group: 'hero', validation: (r) => r.required() }),
    defineField({ name: 'heroIntro', title: 'One line on the room', type: 'text', rows: 2, group: 'hero', validation: (r) => r.required().max(140) }),
    defineField({ name: 'askLabel', title: 'Main button label', type: 'string', group: 'hero', initialValue: 'Ask about this room' }),
    defineField({
      name: 'facts', title: 'Orange facts strip', type: 'array', group: 'hero',
      of: [defineArrayMember({ type: 'labelValue' })], validation: (r) => r.length(4).warning('The design has exactly 4 facts.'),
    }),

    defineField({ name: 'storyChapter', title: 'Chapter label', type: 'string', group: 'story', initialValue: 'CH 01 — The room' }),
    defineField({ name: 'headline', type: 'string', group: 'story', validation: (r) => r.required().max(60) }),
    defineField({ name: 'story', title: 'Paragraphs', type: 'array', group: 'story', of: [defineArrayMember({ type: 'text', rows: 4 })], validation: (r) => r.min(1).max(3) }),
    defineField({ name: 'notable', type: 'string', group: 'story' }),
    defineField({ name: 'tasks', type: 'string', group: 'story' }),
    defineField({ name: 'clientsLine', title: 'Clients', type: 'string', group: 'story' }),
    defineField({ name: 'floorPlan', title: 'Floor plan', type: 'imageWithAlt', group: 'story', description: 'Line drawing on a light background, portrait 4:5.' }),
    defineField({ name: 'floorPlanCaption', title: 'Floor plan caption', type: 'string', group: 'story' }),

    defineField({ name: 'galleryChapter', title: 'Chapter label', type: 'string', group: 'gallery', initialValue: 'CH 02' }),
    defineField({ name: 'gallery', type: 'array', group: 'gallery', of: [defineArrayMember({ type: 'imageWithAlt' })], validation: (r) => r.min(3).warning('The gallery shows three photos at a time.') }),

    defineField({ name: 'equipmentChapter', title: 'Chapter label', type: 'string', group: 'equipment', initialValue: 'CH 03' }),
    defineField({ name: 'equipmentIntro', title: 'Intro', type: 'text', rows: 2, group: 'equipment' }),
    defineField({
      name: 'equipment', type: 'array', group: 'equipment',
      of: [defineArrayMember({
        type: 'object', name: 'equipmentGroup', title: 'Group',
        fields: [
          defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'string' })], description: 'One line per item, e.g. "2× Neumann U87".' }),
        ],
        preview: { select: { title: 'title', items: 'items' }, prepare: ({ title, items }) => ({ title, subtitle: `${items?.length ?? 0} items` }) },
      })],
    }),

    defineField({ name: 'cta', title: 'Closing band', type: 'ctaBand', group: 'close', description: 'Leave the title empty to use "Record in / <room name>."' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Room order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', order: 'order', media: 'cardImage' }, prepare: ({ title, order, media }) => ({ title, subtitle: `Room ${String(order ?? '').padStart(2, '0')}`, media }) },
});

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'sortName', title: 'Sort as', type: 'string', description: 'Optional. E.g. "Beatles, The" to list under B. Empty = name.' }),
    defineField({ name: 'partner', title: 'Partner', type: 'boolean', initialValue: false, description: 'Shows the black "Partner" tag and lists the client first under its letter.' }),
    defineField({ name: 'url', title: 'Link', type: 'url' }),
  ],
  preview: { select: { title: 'name', partner: 'partner' }, prepare: ({ title, partner }) => ({ title, subtitle: partner ? 'Partner' : '' }) },
});

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Quote',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 4, description: 'Without quotation marks: the site adds “ ”.', validation: (r) => r.required().max(240) }),
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string' }),
  ],
  preview: { select: { title: 'name', subtitle: 'quote' } },
});

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'photo', type: 'imageWithAlt', description: 'Square. Until a photo is added the site shows the striped placeholder from the design.' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});

export const faq = defineType({
  name: 'faq',
  title: 'Question',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required().max(70) }),
    defineField({ name: 'answer', type: 'text', rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'updated', title: 'Last updated', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }] })] }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
});

export const collections = [room, client, testimonial, teamMember, faq, legalPage];
