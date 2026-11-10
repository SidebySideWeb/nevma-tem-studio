/** Portable Text → HTML for undesigned legal pages (PAGES.md). */
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import type { PortableTextBlock } from './types';

export function legalBodyHtml(body: PortableTextBlock[] | null | undefined): string {
  if (!body?.length) return '';
  return toHTML(body, {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href = (value as { href?: string } | undefined)?.href || '';
          if (!uriLooksSafe(href)) return children;
          const external = !href.startsWith('/') && !href.startsWith('#');
          const rel = external ? ' rel="noreferrer noopener"' : '';
          return `<a href="${href}"${rel}>${children}</a>`;
        },
      },
    },
  });
}

/** Format Sanity `date` (YYYY-MM-DD) for "Last updated …". */
export function formatLegalDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
