# 14 · SEO

Read `docs/PAGES.md` (index column), `docs/ACCEPTANCE.md` AC-12.

Do:
1. `src/lib/seo.ts`: title = `seo.title` or page title + `siteSettings.seoTitleSuffix`; description; canonical (`PUBLIC_SITE_URL` + path, no trailing slash); Open Graph + Twitter card (page `seo.image` or the hero image at 1200×630 from Sanity, or `seoImage`); `noindex` when `seo.noindex`, on `/enquire/thanks`, 404 and when `VERCEL_ENV !== 'production'`.
2. JSON-LD on Home and Contact: `LocalBusiness` (name, url, image, telephone, email, address with locality "Ellinikon", region "Attica", country "GR", geo from settings when set, sameAs socials).
3. `robots.txt` (static endpoint; disallow all when not production), sitemap via `@astrojs/sitemap` (exclude thanks).
4. `scripts/check-seo.mjs` (run on `dist/`): every HTML has one `<title>`, one meta description, one canonical, one `<h1>`; reports duplicates.

Checks: `pnpm --filter web build && node apps/web/scripts/check-seo.mjs` → no problems; Rich Results test on a preview URL validates LocalBusiness.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
