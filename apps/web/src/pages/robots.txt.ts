/** Static robots.txt — disallow everything outside production (DEPLOY.md / AC-12). */
export const prerender = true;

const site = (import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || '').replace(
  /\/$/,
  '',
);
const production =
  (import.meta.env.VERCEL_ENV || process.env.VERCEL_ENV) === 'production';

export function GET() {
  const body = production
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${site}/sitemap-index.xml`, ''].join('\n')
    : ['User-agent: *', 'Disallow: /', ''].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
