// @ts-check
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { createClient } from '@sanity/client';

// The kit's .env is at the repo root. Astro evaluates this file before it
// loads .env, and by default only looks in apps/web. Skip when missing (CI
// injects secrets as process.env instead).
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const rootEnv = new URL('../../.env', import.meta.url);
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv);

/** Lowest-order room → `/studio` 301. Config redirects become real HTTP redirects with the Vercel adapter (page-level Astro.redirect is only a meta refresh in static). */
/** @returns {Promise<Record<string, string | { status: 301 | 302 | 303 | 307 | 308; destination: string }>>} */
async function studioRedirects() {
  /** @type {Record<string, string | { status: 301 | 302 | 303 | 307 | 308; destination: string }>} */
  const empty = {};
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return empty;
  const client = createClient({
    projectId,
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-10-01',
    token: process.env.SANITY_VIEWER_TOKEN,
    useCdn: false,
  });
  const slug = await client.fetch(
    `*[_type == "room"]|order(order asc)[0].slug.current`,
  );
  if (!slug || typeof slug !== 'string') return empty;
  return { '/studio': { status: /** @type {const} */ (301), destination: `/studio/${slug}` } };
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL,
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap({ filter: (p) => !p.includes('/enquire/thanks') })],
  trailingSlash: 'never',
  // Floating toolbar paints into Playwright element screenshots and fails fidelity.
  devToolbar: { enabled: false },
  redirects: await studioRedirects(),
  vite: { envDir: repoRoot },
});
