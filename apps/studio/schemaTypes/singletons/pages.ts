import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * One fixed document per page. Every field maps to one place in one design block
 * (docs/CONTENT-MODEL.md has the block-by-block map). Layouts are fixed: editors change content,
 * not structure — that is what keeps the site identical to the design.
 */

const ref = (type: string) => ({ type: 'reference' as const, to: [{ type }] });

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'contact', title: 'Contact', default: true },
    { name: 'header', title: 'Header' },
    { name: 'footer', title: 'Footer' },
    { name: 'partner', title: 'NEVMA partner' },
    { name: 'seo', title: 'SEO defaults' },
  ],
  fields: [
    defineField({ name: 'studioName', type: 'string', group: 'contact', initialValue: 'TEMS — the Ellinikon music studio', validation: (r) => r.required() }),
    defineField({ name: 'street', title: 'Street address', type: 'string', group: 'contact' }),
    defineField({ name: 'area', type: 'string', group: 'contact', initialValue: 'Ellinikon' }),
    defineField({ name: 'city', type: 'string', group: 'contact', initialValue: 'Athens' }),
    defineField({ name: 'postcode', type: 'string', group: 'contact' }),
    defineField({ name: 'country', type: 'string', group: 'contact', initialValue: 'Greece' }),
    defineField({ name: 'email', type: 'string', group: 'contact', validation: (r) => r.email() }),
    defineField({ name: 'emailDisplay', title: 'Email as shown', type: 'string', group: 'contact', description: 'Optional. Defaults to the email.' }),
    defineField({ name: 'phone', title: 'Phone (for links)', type: 'string', group: 'contact', description: 'International format, e.g. +302100000000.' }),
    defineField({ name: 'phoneDisplay', title: 'Phone as shown', type: 'string', group: 'contact' }),
    defineField({ name: 'replyTime', title: 'Reply within', type: 'string', group: 'contact', description: 'E.g. "24 hours". Used on Enquire and Contact.' }),
    defineField({ name: 'mapUrl', title: 'Google Maps link', type: 'url', group: 'contact' }),
    defineField({ name: 'geo', title: 'Coordinates', type: 'geopoint', group: 'contact', description: 'For search engines (LocalBusiness).' }),
    defineField({ name: 'logoWhite', title: 'Logo (white)', type: 'image', group: 'header' }),
    defineField({ name: 'logoBlack', title: 'Logo (black)', type: 'image', group: 'header' }),
    defineField({ name: 'headerCta', title: 'Header button label', type: 'string', group: 'header', initialValue: 'Register interest' }),
    defineField({ name: 'footerText', title: 'Footer description', type: 'text', rows: 2, group: 'footer' }),
    defineField({
      name: 'socials', type: 'array', group: 'footer',
      of: [defineArrayMember({ type: 'object', name: 'social', fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'url', type: 'url' })] })],
    }),
    defineField({ name: 'partnerName', title: 'Partner name', type: 'string', group: 'partner', initialValue: 'NEVMA Music' }),
    defineField({ name: 'partnerLogo', title: 'Partner logo (white)', type: 'image', group: 'partner' }),
    defineField({ name: 'partnerUrl', title: 'Partner website', type: 'url', group: 'partner' }),
    defineField({ name: 'partnerLinkLabel', title: 'Partner button label', type: 'string', group: 'partner', initialValue: 'Visit NEVMA Music ↗' }),
    defineField({ name: 'partnerFooterLabel', title: 'Footer line', type: 'string', group: 'partner', initialValue: 'Studio partner of' }),
    defineField({ name: 'seoTitleSuffix', title: 'Title suffix', type: 'string', group: 'seo', initialValue: ' — TEMS, the Ellinikon music studio' }),
    defineField({ name: 'seoDescription', title: 'Default description', type: 'text', rows: 2, group: 'seo' }),
    defineField({ name: 'seoImage', title: 'Default share image', type: 'image', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  groups: ['hero', 'rooms', 'records', 'gear', 'quotes', 'close', 'seo'].map((n, i) => ({ name: n, title: n[0].toUpperCase() + n.slice(1), default: i === 0 })),
  fields: [
    defineField({ name: 'heroImage', title: 'Photo', type: 'imageWithAlt', group: 'hero', validation: (r) => r.required() }),
    defineField({ name: 'heroLabel', title: 'REC label', type: 'string', group: 'hero', initialValue: 'Rec — Ellinikon, Athens' }),
    defineField({ name: 'heroIntro', title: 'Intro', type: 'text', rows: 2, group: 'hero', validation: (r) => r.required().max(160) }),
    defineField({ name: 'heroPrimary', title: 'Main button', type: 'cta', group: 'hero' }),
    defineField({ name: 'heroSecondary', title: 'Second button', type: 'cta', group: 'hero' }),

    defineField({ name: 'rooms', title: 'Heading', type: 'chapterHeading', group: 'rooms' }),
    defineField({ name: 'roomCards', title: 'Room cards', type: 'array', group: 'rooms', of: [defineArrayMember(ref('room'))], validation: (r) => r.length(3).warning('The design shows three cards.') }),

    defineField({ name: 'records', title: 'Heading', type: 'chapterHeading', group: 'records' }),
    defineField({ name: 'recordsCta', title: 'Button', type: 'cta', group: 'records' }),
    defineField({ name: 'recordCovers', title: 'Covers', type: 'array', group: 'records', of: [defineArrayMember({ type: 'imageWithAlt' })], validation: (r) => r.length(12).warning('The grid has 12 covers (4 × 3).') }),
    defineField({ name: 'partnerLabel', title: 'Partner box label', type: 'string', group: 'records', initialValue: 'Studio partner' }),
    defineField({ name: 'partnerText', title: 'Partner box text', type: 'text', rows: 2, group: 'records' }),
    defineField({
      name: 'partnerReleases', title: 'Partner releases', type: 'array', group: 'records',
      of: [defineArrayMember({
        type: 'object', name: 'partnerRelease',
        fields: [
          defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'cover', type: 'imageWithAlt', validation: (r) => r.required() }),
          defineField({ name: 'label', type: 'string', initialValue: 'NEVMA ↗' }),
          defineField({ name: 'url', type: 'url' }),
        ],
        preview: { select: { title: 'title', media: 'cover' } },
      })],
      validation: (r) => r.length(3).warning('The design shows three releases.'),
    }),

    defineField({ name: 'gear', title: 'Heading', type: 'chapterHeading', group: 'gear' }),
    defineField({ name: 'gearImage', title: 'Photo', type: 'imageWithAlt', group: 'gear' }),
    defineField({ name: 'gearStats', title: 'Numbers', type: 'array', group: 'gear', of: [defineArrayMember({ type: 'statItem' })], validation: (r) => r.length(4).warning('The design has four numbers.') }),
    defineField({ name: 'gearCta', title: 'Button', type: 'cta', group: 'gear' }),

    defineField({ name: 'quotes', title: 'Heading', type: 'chapterHeading', group: 'quotes' }),
    defineField({ name: 'quoteItems', title: 'Quotes', type: 'array', group: 'quotes', of: [defineArrayMember(ref('testimonial'))], validation: (r) => r.length(3).warning('The design shows three quotes.') }),

    defineField({ name: 'cta', title: 'Closing band', type: 'ctaBand', group: 'close' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Home' }) },
});

export const roomsPage = defineType({
  name: 'roomsPage',
  title: 'Room pages (shared)',
  type: 'document',
  description: 'Labels shared by every room page.',
  fields: [
    defineField({ name: 'galleryTitle', type: 'string', initialValue: 'Gallery' }),
    defineField({ name: 'equipmentTitle', type: 'string', initialValue: 'Equipment' }),
    defineField({ name: 'contactLabel', title: 'Second button label', type: 'string', initialValue: 'Contact' }),
    defineField({ name: 'otherRoomsTitle', title: 'Other rooms title', type: 'string', initialValue: 'Other rooms' }),
    defineField({ name: 'cta', title: 'Default closing band', type: 'ctaBand', description: 'Used when a room has no closing band of its own. "{room}" in the title is replaced by the room name.' }),
  ],
  preview: { prepare: () => ({ title: 'Room pages (shared)' }) },
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  groups: ['hero', 'story', 'team', 'faq', 'partner', 'seo'].map((n, i) => ({ name: n, title: n[0].toUpperCase() + n.slice(1), default: i === 0 })),
  fields: [
    defineField({ name: 'heroImage', title: 'Photo', type: 'imageWithAlt', group: 'hero', validation: (r) => r.required() }),
    defineField({ name: 'title', type: 'string', group: 'hero', initialValue: 'About' }),
    defineField({ name: 'captionTitle', title: 'Photo caption', type: 'string', group: 'hero' }),
    defineField({ name: 'captionText', title: 'Photo caption, second line', type: 'string', group: 'hero' }),
    defineField({ name: 'estLabel', title: '"Est." label', type: 'string', group: 'story', initialValue: 'Est.' }),
    defineField({ name: 'year', title: 'Founded', type: 'string', group: 'story' }),
    defineField({ name: 'locationLabel', type: 'string', group: 'story', initialValue: 'Location' }),
    defineField({ name: 'location', type: 'string', group: 'story', initialValue: 'Ellinikon, Athens' }),
    defineField({ name: 'lead', title: 'Lead paragraph', type: 'text', rows: 3, group: 'story', validation: (r) => r.required() }),
    defineField({ name: 'paragraphs', type: 'array', group: 'story', of: [defineArrayMember({ type: 'text', rows: 4 })] }),
    defineField({ name: 'teamTitle', type: 'string', group: 'team', initialValue: 'The Team' }),
    defineField({ name: 'teamSummary', type: 'string', group: 'team' }),
    defineField({
      name: 'teamGroups', type: 'array', group: 'team',
      of: [defineArrayMember({
        type: 'object', name: 'teamGroup',
        fields: [defineField({ name: 'title', type: 'string', validation: (r) => r.required() }), defineField({ name: 'members', type: 'array', of: [defineArrayMember(ref('teamMember'))] })],
        preview: { select: { title: 'title' } },
      })],
    }),
    defineField({ name: 'faqTitle', type: 'string', group: 'faq', initialValue: 'Questions' }),
    defineField({ name: 'faqIntro', type: 'text', rows: 2, group: 'faq' }),
    defineField({ name: 'faqItems', title: 'Questions', type: 'array', group: 'faq', of: [defineArrayMember(ref('faq'))] }),
    defineField({ name: 'partnerLabel', type: 'string', group: 'partner', initialValue: 'Partners' }),
    defineField({ name: 'partnerText', type: 'text', rows: 2, group: 'partner' }),
    defineField({ name: 'panorama', title: 'Wide photo at the end', type: 'imageWithAlt', group: 'partner' }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'About' }) },
});

export const clientsPage = defineType({
  name: 'clientsPage',
  title: 'Clients',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Clients' }),
    defineField({ name: 'heroCaption', title: 'Caption', type: 'string' }),
    defineField({ name: 'heroCovers', title: 'Cover wall', type: 'array', of: [defineArrayMember({ type: 'imageWithAlt' })], description: '10 across on desktop, 3 rows. If fewer than 30, the site repeats them in order.', validation: (r) => r.min(10) }),
    defineField({ name: 'azLabel', title: 'Big label', type: 'string', initialValue: 'A–Z' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({ name: 'cta', title: 'Closing band', type: 'ctaBand' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Clients' }) },
});

export const sessionsPage = defineType({
  name: 'sessionsPage',
  title: 'Sessions',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Photo', type: 'imageWithAlt', validation: (r) => r.required() }),
    defineField({ name: 'title', type: 'string', initialValue: 'Sessions' }),
    defineField({ name: 'heroCta', title: 'Button', type: 'cta' }),
    defineField({ name: 'introItems', title: 'Three numbered texts', type: 'array', of: [defineArrayMember({ type: 'numberedText' })], validation: (r) => r.length(3).warning('The design has three.') }),
    defineField({ name: 'introImages', title: 'Four photos', type: 'array', of: [defineArrayMember({ type: 'imageWithAlt' })], validation: (r) => r.length(4).warning('The design has four.') }),
    defineField({ name: 'stepsTitle', type: 'string', initialValue: 'How it works' }),
    defineField({ name: 'steps', type: 'array', of: [defineArrayMember({ type: 'numberedText' })], validation: (r) => r.length(4).warning('The design has four steps.') }),
    defineField({ name: 'faqTitle', type: 'string', initialValue: 'Questions' }),
    defineField({ name: 'faqIntro', type: 'text', rows: 2 }),
    defineField({ name: 'faqItems', title: 'Questions', type: 'array', of: [defineArrayMember(ref('faq'))] }),
    defineField({ name: 'cta', title: 'Closing band', type: 'ctaBand' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Sessions' }) },
});

export const enquirePage = defineType({
  name: 'enquirePage',
  title: 'Register interest',
  type: 'document',
  groups: ['intro', 'form', 'thanks', 'faq', 'seo'].map((n, i) => ({ name: n, title: n[0].toUpperCase() + n.slice(1), default: i === 0 })),
  fields: [
    defineField({ name: 'image', title: 'Background photo', type: 'imageWithAlt', group: 'intro' }),
    defineField({ name: 'label', type: 'string', group: 'intro', initialValue: 'Interest form' }),
    defineField({ name: 'title', type: 'displayHeading', group: 'intro', validation: (r) => r.required() }),
    defineField({ name: 'intro', type: 'text', rows: 3, group: 'intro' }),
    defineField({ name: 'form', type: 'reference', to: [{ type: 'form' }], group: 'form', validation: (r) => r.required() }),
    defineField({
      name: 'labels', title: 'Field labels and hints', type: 'object', group: 'form',
      fields: [
        'name', 'namePlaceholder', 'artist', 'artistPlaceholder', 'email', 'emailPlaceholder', 'phone', 'phonePlaceholder',
        'projectType', 'start', 'days', 'daysPlaceholder', 'message', 'messagePlaceholder', 'consent', 'privacyLink', 'submit', 'protectedBy',
      ].map((n) => defineField({ name: n, type: n === 'consent' || n === 'messagePlaceholder' ? 'text' : 'string', rows: 2 } as any)),
    }),
    defineField({ name: 'thanksTitle', type: 'string', group: 'thanks', initialValue: 'Got it.' }),
    defineField({ name: 'thanksText', type: 'text', rows: 2, group: 'thanks' }),
    defineField({ name: 'againLabel', title: '"Send another" label', type: 'string', group: 'thanks', initialValue: 'Send another' }),
    defineField({ name: 'errorText', title: 'Error message', type: 'text', rows: 2, group: 'thanks', description: 'Shown if sending fails. Not in the design: shown in the same place as the thank-you text.' }),
    defineField({ name: 'faqTitle', type: 'string', group: 'faq', initialValue: 'Before you ask' }),
    defineField({ name: 'faqIntro', type: 'text', rows: 2, group: 'faq' }),
    defineField({ name: 'faqItems', title: 'Questions', type: 'array', group: 'faq', of: [defineArrayMember(ref('faq'))] }),
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Register interest' }) },
});

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    defineField({ name: 'heroImage', title: 'Photo', type: 'imageWithAlt', validation: (r) => r.required() }),
    defineField({ name: 'title', type: 'string', initialValue: 'Contact' }),
    defineField({ name: 'intro', type: 'text', rows: 2 }),
    defineField({
      name: 'channels', type: 'array',
      of: [defineArrayMember({
        type: 'object', name: 'channel',
        fields: [
          defineField({ name: 'label', type: 'string', description: 'E.g. "01 — Email".', validation: (r) => r.required() }),
          defineField({ name: 'value', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'note', type: 'text', rows: 2 }),
          defineField({ name: 'href', title: 'Link', type: 'string', description: 'mailto:, tel: or https:. Empty = not a link.' }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
      validation: (r) => r.length(3).warning('The design has three rows.'),
    }),
    defineField({ name: 'mapImage', title: 'Map image', type: 'imageWithAlt' }),
    defineField({ name: 'ctaTitle', type: 'displayHeading' }),
    defineField({ name: 'ctaText', type: 'text', rows: 2 }),
    defineField({ name: 'ctaButton', type: 'cta' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Contact' }) },
});

export const notFoundPage = defineType({
  name: 'notFoundPage',
  title: 'Page not found (404)',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'displayHeading', initialValue: 'Wrong\nroom.' }),
    defineField({ name: 'text', type: 'text', rows: 2 }),
    defineField({ name: 'cta', type: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Page not found (404)' }) },
});

export const SINGLETONS = ['siteSettings', 'homePage', 'roomsPage', 'aboutPage', 'clientsPage', 'sessionsPage', 'enquirePage', 'contactPage', 'notFoundPage'];
export const singletons = [siteSettings, homePage, roomsPage, aboutPage, clientsPage, sessionsPage, enquirePage, contactPage, notFoundPage];
