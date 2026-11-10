/** Fixed interface words from the design — not editable in Sanity. */
export const ui = {
  nav: {
    studio: 'The Studio',
    about: 'About',
    clients: 'Clients',
    sessions: 'Sessions',
    contact: 'Contact',
  },
  footer: {
    explore: 'Explore',
    work: 'Work with us',
    studio: 'Studio',
    privacy: 'Privacy',
    cookies: 'Cookies',
  },
  roomMeta: {
    notable: 'Notable',
    tasks: 'Tasks',
    clients: 'Clients',
  },
  enquire: {
    email: 'Email',
    phone: 'Phone',
    replyWithin: 'Reply within',
  },
  contact: {
    /** Design striped map placeholder when `contactPage.mapImage` is empty. */
    mapPlaceholder: '[Map — static image, links to Google Maps]',
  },
  legal: {
    label: 'Legal',
    updated: 'Last updated',
  },
  notFound: {
    code: '404',
  },
  room: 'Room',
  /** Appended by the site (CONTENT-MODEL.md): room cards, "Room 02 →". */
  arrow: ' →',
  /** Appended by the site: footer socials and partner external links. */
  external: ' ↗',
} as const;
