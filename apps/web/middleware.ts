/**
 * Vercel Routing Middleware — HTTP Basic Auth when SITE_PASSWORD is set.
 * Runs before static and API routes (Astro middleware cannot protect prerendered pages).
 * Same pattern as Nevma Music / Elite Protection.
 *
 * Set SITE_PASSWORD on Preview and/or Production in Vercel. Unset = open.
 */
import { timingSafeEqual } from 'node:crypto';
import { next } from '@vercel/functions';

export const config = {
  matcher: '/:path*',
  runtime: 'nodejs',
};

function passwordsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const len = Math.max(a.length, b.length, 1);
  const aPad = Buffer.alloc(len);
  const bPad = Buffer.alloc(len);
  a.copy(aPad);
  b.copy(bPad);
  return timingSafeEqual(aPad, bPad) && a.length === b.length;
}

function passwordFromAuthorization(header: string | null): string | null {
  if (!header) return null;
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return null;
  try {
    const decoded = atob(encoded);
    const i = decoded.indexOf(':');
    // Username is ignored; password may contain ':'.
    return i === -1 ? decoded : decoded.slice(i + 1);
  } catch {
    return null;
  }
}

function unauthorized(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export default function middleware(request: Request): Response {
  const password = process.env.SITE_PASSWORD;
  if (!password) return next();

  const provided = passwordFromAuthorization(request.headers.get('authorization'));
  if (provided === null || !passwordsEqual(provided, password)) {
    return unauthorized();
  }

  return next({
    headers: { 'X-Robots-Tag': 'noindex, nofollow' },
  });
}
