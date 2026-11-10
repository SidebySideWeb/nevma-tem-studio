# Architecture

```
Visitor ──► Vercel CDN ──► static pages (Astro build)          Sanity Studio (tems.sanity.studio)
                 │                                              │ editors publish
                 └──► /api/enquiry (Vercel function) ──┐        ▼
                          │  Turnstile siteverify      │   Sanity Content Lake (project "TEMS", dataset production, private)
                          │  create formSubmission ────┼──►  ▲            │ webhook on publish (not formSubmission)
                          └─ Resend: notify + reply    │     │ build read  ▼
                                                       │  Astro build ◄── Vercel deploy hook
```

| Part | Choice |
| --- | --- |
| Repo | `tems-site`, pnpm workspace: `apps/web`, `apps/studio`. No shared packages with the NEVMA repos (separate company). |
| Front end | Astro 7, static output, `@astrojs/vercel` for the one server route, `@astrojs/sitemap`. Vanilla TS. |
| CMS | Sanity project "TEMS" inside the NEVMA Sanity organisation (decided), Free plan (decided: Studio stays Free). Studio deployed to `tems.sanity.studio` (or a custom host). |
| Forms | Sanity `form` + `formSubmission`; Resend for email; Cloudflare Turnstile + honeypot. No Supabase. |
| Hosting | Vercel project `tems-web` under the NEVMA team (Pro, decided). Domain: to confirm. |
| Rebuilds | Sanity webhook → Vercel deploy hook on publish; also a daily rebuild (cron 03:10 UTC) so the footer year and anything time-based stays right. |
| Analytics | Vercel Web Analytics (cookieless) → no cookie banner needed (PROPOSED). |
| Backups | Weekly `sanity dataset export` by GitHub Action → workflow artifact (90 days) and the shared Google Drive folder (decided for all NEVMA-engagement sites). |

## apps/web layout
```
src/
  layouts/Base.astro            head, body.pg-*, wrapper, Header, Footer
  blocks/shared/                Header, Footer, CtaBand, FaqList
  blocks/home|studio|about|clients|sessions|enquire|contact/   one component per design block
  pages/                        index, studio/[slug], studio/index (redirect), about, clients, sessions, enquire/index, enquire/thanks, contact, legal/[slug], 404, api/enquiry.ts
  lib/                          sanity.ts, queries.ts, types.ts, image.ts, links.ts, text.ts, ui.ts, seo.ts
  lib/server/                   turnstile.ts, mail.ts, validate.ts, ratelimit.ts
  scripts/                      gallery.ts, faq.ts, enquiry.ts
  styles/                       tems.css (copy), additions.css
public/assets/fonts/            from design/build/assets/fonts
tests/fidelity/                 provided
tests/unit/, tests/e2e/         written during the build
```

## Environment variables (`.env.example`)
`PUBLIC_SITE_URL`, `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `SANITY_API_VERSION`, `SANITY_VIEWER_TOKEN` (build read),
`SANITY_WRITE_TOKEN` (API only), `RESEND_API_KEY`, `MAIL_FROM`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`. Vercel: set per environment; previews get `noindex`.
