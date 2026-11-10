# Acceptance criteria

| # | Criterion | How it's checked |
| --- | --- | --- |
| AC-01 | Every designed screen is identical to the design at 1440 and 390 (blocks, heights ±2%, text, type and colours, ≤ 0.1% pixels) | `pnpm test:fidelity`: 16/16 pass with the seed |
| AC-02 | `tems.css` is byte-identical to `design/build/tems.css` | `cmp apps/web/src/styles/tems.css design/build/tems.css` |
| AC-03 | No inline styles, Tailwind or component-scoped CSS in `apps/web/src` | `grep -rnE 'style="|<style' apps/web/src` → 0 hits |
| AC-04 | All content comes from Sanity; changing any field in the Studio and publishing changes the site within ~2 minutes | publish a test change; webhook → deploy |
| AC-05 | Room pages exist for every room; `/studio` redirects to room 01; "Room 02 / 03" and Other rooms update when a room is added | add a 4th room in a test dataset |
| AC-06 | Clients A–Z groups by `sortName`/name, partners first with the tag; jump links scroll to the letter | unit test + manual |
| AC-07 | Gallery prev/next cycles photos and updates the counter; keyboard works; no layout shift | e2e |
| AC-08 | FAQ accordions open/close with `aria-expanded`; Enquire starts with the first open | e2e |
| AC-09 | Enquiry with JS: validation, Turnstile, saved as `formSubmission`, notification + auto-reply sent, sent state shown, URL `/enquire/thanks` | e2e (mocked) + one real test on preview |
| AC-10 | Enquiry without JS reaches `/enquire/thanks`; honeypot blocks bots silently; rate limit returns an error after 5 tries | e2e |
| AC-11 | `?room=studio-a` stores the room on the submission | e2e |
| AC-12 | SEO: unique titles/descriptions, canonical, Open Graph, `sitemap-index.xml`, `robots.txt`, LocalBusiness JSON-LD on Home and Contact; `/enquire/thanks` and previews noindex | `pnpm check:seo` script + Rich Results test |
| AC-13 | Lighthouse mobile on Home and a room page: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95, SEO 100; LCP < 2.5 s, CLS < 0.1 | Lighthouse |
| AC-14 | ≤ 10 KB gz JS per page; no third-party scripts except Turnstile (Enquire) and Vercel Analytics | build output |
| AC-15 | Weekly backup and retention jobs run; a backup restores into a scratch dataset | run once manually |
| AC-16 | Before launch: `node scripts/check-placeholders.mjs --strict` finds no `[placeholder]` text and no stand-in images | script |
