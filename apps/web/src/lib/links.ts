import type { Cta as TypesCta } from './types';

/** Align with Sanity/types Cta (`label` may be null). */
export type Cta = TypesCta;

export type RoomRef = {
  slug: string;
  order: number;
};

const PAGES: Record<string, string> = {
  home: '/',
  about: '/about',
  clients: '/clients',
  sessions: '/sessions',
  enquire: '/enquire',
  contact: '/contact',
};

/** Resolve a CTA to a site path or URL (CONTENT-MODEL.md / PAGES.md). */
export function href(cta: Cta | null | undefined, rooms: RoomRef[] = []): string {
  if (!cta) return '#';
  if (cta.url) return cta.url;
  if (cta.room) {
    const slug = typeof cta.room === 'string' ? cta.room : cta.room.slug;
    return slug ? `/studio/${slug}` : '#';
  }
  if (cta.page === 'studio') {
    const first = [...rooms].sort((a, b) => a.order - b.order)[0];
    return first ? `/studio/${first.slug}` : '/studio';
  }
  if (cta.page && PAGES[cta.page]) return PAGES[cta.page];
  return '#';
}
