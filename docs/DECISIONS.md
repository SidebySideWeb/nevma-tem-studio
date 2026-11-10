# Decisions

**DECIDED** = decided by Dimitris (date). **PROPOSED** = this kit's choice; change it if you disagree.

## Decided (from the NEVMA project)
- TEMS is a separate company with its own design style; never described as a NEVMA member; NEVMA Music shown only as a partner (21 Oct, 23 Oct).
- Expression-of-interest form only: no booking, no payments (7 Oct). English only (10 Oct).
- Stack: Astro front end, Sanity CMS, Vercel hosting (19 Oct); one Sanity project per site inside the NEVMA organisation; TEMS on the Free plan (19 Oct).
- Front ends on Vercel under the NEVMA team (Pro) (19 Oct). Weekly backups of every database to the shared Google Drive folder (19 Oct).
- The client pays running costs; Resend Pro charged to the client (19 Oct).
- Build exactly like the approved design, pixel-perfect (9 Nov — this kit).

## Proposed in this kit
- Forms stored in Sanity (`form` + `formSubmission`), as decided for Nevma Music on 29 Oct; no Supabase for TEMS (replaces the 22 Oct "shared enquiries table" idea for this site).
- Exact port of `design/build` + fidelity test as the definition of done (Elite Protection lesson, 1–2 Nov).
- Page singletons with typed fields per block (no generic page builder).
- Room pages at `/studio/<slug>`; `/studio` redirects to room 01; the header's "The Studio" links to room 01.
- `/enquire/thanks` as a real page = the designed sent state (no-JS fallback and a clean URL for analytics).
- Gallery behaviour, FAQ accordion on About/Sessions with the Enquire pattern, jump-to-letter anchors on Clients (`PAGES.md`).
- Legal pages and 404 built from the design's parts (not designed); can be designed first if wanted.
- Vercel Web Analytics (cookieless), so no cookie banner.
- Turnstile in Invisible mode so the design's form stays unchanged.
- JS budget ≤ 10 KB gz per page; no UI framework.
- Rate limit in memory per function instance (simple; good enough for a low-traffic form).

## Proposed while setting up the workspace (10 Nov 2026)
- `pnpm create astro@latest` installed Astro 7.4.8. That release exits unless Node is `>=22.23.4`. The `node` on PATH is 22.20.0 (`C:\Program Files\nodejs`). Node 22.23.4 is already installed with nvm (`C:\Users\dgero\AppData\Local\nvm\v22.23.4`) and was put first on PATH for the build and the fidelity run. The Program Files install was not replaced. `apps/web` engines is `>=22.23.4`.
- The scaffold was created in a temp folder and moved into `apps/web`, leaving `tests/`. The package name is `web` (the temp path had produced a mangled name) so the root `pnpm --filter web` scripts match. The template `AGENTS.md` was not copied: it recommends Tailwind and UI frameworks, which this kit forbids. The template lockfile was dropped; the workspace lockfile at the repo root is the one that matters.
- `.env` stays at the repo root, next to `.env.example`. Astro evaluates `astro.config.mjs` before loading `.env`, and by default only looks in `apps/web`. The config calls `process.loadEnvFile` on `../../.env` and sets `vite.envDir` to the repo root. Vite is not imported from the config: pnpm does not expose it as a direct dependency of `web`, and that import made `astro build` fail.
- `apps/web` is `"type": "module"`, so the fidelity spec's `__dirname` fallback throws before any test runs. `tests/fidelity/playwright.config.ts` sets `DESIGN_DIR` to `design/build` when it is unset, before workers spawn. Thresholds and `fidelity.spec.ts` are unchanged.
- `test:unit` is `tsx --test tests/unit/**/*.test.ts` (Node's test runner through tsx, no Vitest). `test:e2e` is `playwright test -c tests/e2e/playwright.config.ts`, the same shape as the fidelity script. That config is added with the enquiry tests.
- `tsconfig.json` excludes `tests/`. Otherwise `astro check` typechecks the Playwright spec and fails because `pngjs` has no types. `@types/pngjs` was not added.
- The `check` script is the exact command from the prompt. `scripts/check-placeholders.mjs` resolves `apps/web/dist` from the process cwd, so `pnpm --filter web check` looks in `apps/web/apps/web/dist` and skips page text. `pnpm placeholders` from the repo root still checks the real `dist`. The script was not edited.

## Proposed while seeding Sanity (10 Nov 2026)
- Project ID `btd6vnus`, dataset `production` (private), Studio host `tems` → https://tems.sanity.studio/. Deploy wrote `deployment.appId` into `apps/studio/sanity.cli.ts` so the next deploy does not ask for an application id.
- One API token was supplied and used for both `SANITY_VIEWER_TOKEN` and `SANITY_WRITE_TOKEN` in the root `.env`. Prefer a Viewer token for the build and an Editor token for `/api/enquiry` when those exist in the project (DEPLOY.md).
- The local Sanity CLI user session was expired (`Unauthorized - Session not found`). Seed and deploy used `SANITY_AUTH_TOKEN` set to the project API token instead of interactive `sanity login`.
- Sanity CLI reads env from `apps/studio`, so a gitignored `apps/studio/.env` holds only `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, and `SANITY_STUDIO_HOST`. Tokens stay in the root `.env` only.
- `apps/studio` is `"type": "module"`, so `scripts/check-seed.ts` crashed on `__dirname`. Replaced with `import.meta.url`. Schema untouched.
- Port 3333 was already serving Studio (HTTP 200). A second `pnpm --filter studio dev` failed with "port in use"; the existing process was left running. The Studio UI shows the login screen until Dimitris signs in (Google / GitHub / email). Content was confirmed with GROQ instead of a logged-in UI walkthrough.

## Proposed while building the foundation (10 Nov 2026)
- Logos for Header/Footer temporarily lived in `apps/web/public/img/` until Prompt 04; removed after Sanity CDN wiring (local copies were unused).
- Seed `siteSettings` has no `partnerUrl`. Footer partner links use the design placeholder `#nevma-music-site` until the client fills the field (OPEN-QUESTIONS Q7).
- `Base.astro` does not put `class="js"` in the HTML source; a one-line head script adds it (so `[data-js-only]` stays hidden without JS, matching the gallery note in PAGES.md).
- Footer `data-block` defaults to `08-footer` (Home). Other pages pass their own last-block id when those pages are built. Same for CtaBand (`07-cta` default).
- Header/footer at 1440 match design 0 px. At 390, layout/text/box sizes match; a raw pixel compare of the footer alone can still show logo anti-alias noise because the footer sits at a different Y on the short foundation page than on the tall design page. The fidelity suite blanks `img`, so that noise will not count once the page has all blocks.

## Proposed while building the data layer (10 Nov 2026)
- `roomQuery` also projects `"shared": *[_id=="roomsPage"][0]{…}` so a room page needs only one fetch. There is no separate `roomsPageQuery` in the prompt list.
- `clientsQuery` returns `{ page, clients }` in one request.
- `img()` does not apply hotspot by default; pass `{ hotspot: true }` only for fixed aspect-ratio slots (CONTENT-MODEL.md).
- `getSettings()` / `getRooms()` memoised in `sanity.ts` for the build. `dev-data.ts` removed; Header/Footer use Sanity images via `img()`.
- `test:unit` runs `tsx --test tests/unit/*.test.ts` (Windows-friendly glob).

## Proposed while building Home (10 Nov 2026)
- `img()` width is optional. Logos and partner marks that CSS sizes with `height: N; width: auto` (or `width: N; height: auto`) omit the width so Sanity serves the native asset. A CDN resize to e.g. `w=240` rounds the other edge and changes the intrinsic aspect enough that flex `space-between` shifts nav/columns by ~0.1 px and fidelity fails.
- Astro `devToolbar.enabled` is `false` in `astro.config.mjs`. The floating toolbar paints into Playwright element screenshots on `astro dev` and fails the pixel check; production and `preview` never show it.

## Proposed while building Room pages (10 Nov 2026)
- `/studio` → lowest-`order` room is an Astro `redirects` entry built in `astro.config.mjs` from a Sanity fetch (301). With `output: 'static'` + `@astrojs/vercel`, config redirects become real HTTP redirects; a prerendered `Astro.redirect()` page would only emit a meta refresh.
- `CtaBand` has `tone="home" | "shared"`: Home keeps the taller band classes; Studio (and later Clients / Sessions) use the shared shorter band from the design.
- Room CTA title: use the room's own `cta` when it has a title, otherwise `roomsPage.cta`, with `{room}` → room name.

## Proposed while building Deploy / Actions (10 Nov 2026)
- `vercel.json` only carries `/assets/*` Cache-Control; `/studio` 301 stays in `astro.config.mjs` redirects (already works with the Vercel adapter).
- Backup rclone remote is fixed as `drive` (full conf in `RCLONE_CONFIG`); destination `drive:TEMS/backups`.
- `@vercel/analytics/astro` is rendered only when `VERCEL_ENV === 'production'` (previews and local builds stay clean).
- Retention defaults to 24 months when `form.retentionMonths` is missing; deletes via a single Sanity transaction.

## Proposed while building SEO (10 Nov 2026)
- `buildPageSeo` centralises title (`seo.title` or `pageTitle + seoTitleSuffix`), description (page seo, else `pageTitle — seoDescription`), canonical, 1200×630 share image, and noindex (`seo.noindex`, thanks, 404, or `VERCEL_ENV !== 'production'`).
- LocalBusiness JSON-LD only on Home and Contact; locality/region/country fixed as Ellinikon / Attica / GR per AC-12; `sameAs` = social URLs + partner URL when set.
- `robots.txt` is a prerendered endpoint: Allow + Sitemap in production, `Disallow: /` otherwise. Sitemap already excludes `/enquire/thanks`.
- `/enquire/thanks` clears shared `enquirePage.seo` title/description so check-seo does not flag duplicates with `/enquire`.
- Home hero has no text `<h1>` in the design; the logo `<img>` is wrapped in `<h1 class="home-hero-h1">` with `display: contents` so layout/fidelity stay identical while AC-12 / check-seo see a heading.

## Proposed while building Legal + 404 (10 Nov 2026)
- Body class is `pg-home` on both (PAGES.md) so phone `.hx` / `.wrap` rules apply; neither page is in the fidelity suite.
- Legal Portable Text uses `@portabletext/to-html` defaults for blocks/lists; only `link` marks are overridden (`uriLooksSafe` + `rel` on external). Styles live under `/* legal + 404 */` in `additions.css` with DESIGN-SYSTEM tokens only.
- “Legal” / “Last updated” / “404” eyebrow copy is fixed in `ui.ts`. Updated dates render en-GB long form from Sanity `date`.
- Content wrapped in `<main>` (designed pages omit it; these undesigned pages need a landmark for a11y).

## Proposed while building Contact (10 Nov 2026)
- Channel rows keep the design’s three classes (`t-3be0b6` / `t-997748` / `t-b05d05`) by index; tag is `<a>` when `href` is set, otherwise `<div>` with the same classes and children.
- Empty `mapImage` → design striped placeholder; placeholder copy lives in `ui.contact.mapPlaceholder` (not Sanity). Image + `siteSettings.mapUrl` → linked `<img>` in the same cell; sizing for that state is in `additions.css`.

## Proposed while building Enquire API (10 Nov 2026)
- Rate limit is in-memory per instance (5 / 10 min / IP) as allowed by the kit; noted ceiling in `ratelimit.ts`.
- Invisible Turnstile cannot mint a token without JS. With Cloudflare’s always-pass **test** secret only, urlencoded (no-JS) posts may omit the token so local/e2e no-JS success still works. Production secret always requires a token.
- `E2E_MOCK_OUTBOUND=1` skips Resend + Sanity writes and echoes the would-be submission in the JSON body (`e2e`) so Playwright can assert without hitting third parties. Real preview submit uses live credentials. The same flag accepts Playwright’s stub Turnstile token `XXXX.DUMMY.TOKEN.XXXX` without calling `siteverify`.
- Order matches FORMS.md: rate limit → honeypot → Turnstile → validate → save → emails; save failure still sends a “NOT SAVED” notification when possible.

## Proposed while building Enquire (10 Nov 2026)
- Submit control is `type="submit"` (design used `type="button"`) so no-JS posts reach `/api/enquiry`. Pixels unchanged.
- "Send another" stays a `<button>` matching the design; a one-line click handler goes to `/enquire` (an `<a>` would inherit Archivo and fail the style fingerprint vs the UA button font).
- `?room=` cannot be applied at static build time (`output: 'static'`). `enquiry.ts` sets the hidden `room` input and prefixes `Room: {name}\n` on the message placeholder from `location.search` + `data-rooms`. No-JS posts therefore omit room unless the page is later made on-demand. `?error=1` still fills the status line at render when SSR/query is available; empty status uses `:empty { display: none }`.
- Sent-state markup for the JS swap is shipped in a `<template data-enquire-sent-template>` on `/enquire` (cloned on success). Keeping both panels as live DOM siblings made fidelity `styleFingerprint` pick up fonts/colours from `display:none` descendants. `/enquire/thanks` still renders the sent panel only.
- Honeypot `company` uses `.sr-only` plus `display: none` so it does not appear in fidelity text/paint (clip-only still fingerprints).
- Enquire FAQ sets `FaqList nativeButtons` so the +/− keep the UA button font (Arial) matching `enquire.html`; About / Sessions keep `font: inherit` for Archivo.
- `[data-project-types]` is `display: contents` so the chip sync host is not a flex item in the form’s 28px gap.

## Proposed while building Clients (10 Nov 2026)
- Jump bar: all 26 letters keep `m t-555871`; letters with clients are `<a href="#letter-x">`, empty letters are `<span>` (PAGES.md). Letter columns use `id="letter-a"`…; a `#` group (if any) uses `id="letter-other"`.
- Partner clients render as `t-ba703b` links (`client.url` or `siteSettings.partnerUrl` / `#nevma-music-site`); the black "Partner" tag is fixed markup. Non-partners stay as `t-67e0c6` spans as in the design.

## Proposed while building About / FAQ (10 Nov 2026)
- About (and Sessions later) closed FAQ rows use the Enquire markup (`t-4fb45a` + full-width button + answer `<p hidden>`), not the design's static `t-b72082` / `t-cd7636` divs — so the closed resting state stays pixel-identical and the accordion can open. Answer nodes stay in the DOM for `aria-controls`; `hidden` keeps closed height unchanged.
- `FaqList` `tone="ink"` reuses Enquire answer/button classes and overrides colour/border in `additions.css`; the sign uses Sessions' orange `t-706124`.
- FAQ buttons set `font: inherit; line-height: inherit` in `additions.css` so the UA button stylesheet does not swap Archivo for Arial or change row height vs the design's span rows.

## Proposed while QA / launch checks (10 Nov 2026)
- `Base` wraps the page slot in `<main class="page-main">` with `display: contents` in `additions.css` so Lighthouse gets a main landmark without layout/fidelity change; Legal/404 no longer nest their own `<main>`.
- Home and room heroes use `srcset` (800/1600/2400) + `sizes="100vw"` + a matching `<link rel="preload" as="image">` so mobile Lighthouse LCP stays under 2.5 s; fidelity blanks images so CDN widths do not affect pixel diffs.
- AC-13 Lighthouse was run against `dist/client` built with `VERCEL_ENV=production` (so `robots` allow crawl → SEO 100). Local Best-practices console noise from Analytics 404 is acceptable (BP 96 ≥ 95).
- AC-15 scratch restore: no Drive backup artifact yet (D9). Verified by exporting `production` → `sanity dataset import … scratch --replace` → GROQ check → `dataset delete scratch --force`.
- `apps/web/scripts/check-js-budget.mjs` reports gzip size of local `<script src>` assets per HTML page (AC-14). Turnstile and Vercel Analytics remain the only allowed third parties.
- `scripts/check-placeholders.mjs` resolves `apps/web/dist/client` from the repo root (and `dist/client` when cwd is `apps/web`) so `--strict` and `pnpm --filter web check` both see built page text.
