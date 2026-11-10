# Deploy, rebuilds and backups

## Sanity (you, once)
1. In the NEVMA organisation create project **TEMS**, dataset `production`, visibility **private**. Plan: Free.
2. API → Tokens: `tems-web-viewer` (Viewer) → `SANITY_VIEWER_TOKEN`; `tems-web-forms` (Editor) → `SANITY_WRITE_TOKEN`; `tems-backup` (Viewer) for the backup job.
3. CORS: add `http://localhost:3333` and the Studio host (credentials on). The site never calls Sanity from the browser, so no site origin is needed.
4. `pnpm --filter studio seed` (imports `seed/tems-seed.tar.gz`), then `pnpm --filter studio deploy` → `tems.sanity.studio`.
5. Members: the studio's editor (Editor role) when they are ready.

## Vercel (you, once)
1. Project `tems-web` in the NEVMA team, root `apps/web`, framework Astro, install `pnpm install`, build `pnpm build`.
2. Environment variables from `.env.example` (Production + Preview). Preview deployments: `PUBLIC_SITE_URL` = the preview URL and every page `noindex` (handled in `seo.ts` via `VERCEL_ENV`).
3. Settings → Git → Deploy Hooks → "sanity-publish" (branch `main`) → copy the URL.
4. Daily rebuild: the GitHub Action `rebuild.yml` (below) calls the same deploy hook at 03:10 UTC. No Vercel cron or extra function.
5. Domain: add when confirmed; `www` → apex redirect (or the reverse), HTTPS automatic.

## Sanity → Vercel webhook
Sanity → API → Webhooks → new: URL = deploy hook, dataset production, trigger on create/update/delete,
filter `!(_type in ["formSubmission"])`, HTTP POST, no body needed. Test by publishing a small change.

## Email (Resend) and Turnstile
- Resend: add the studio's sending domain (DNS records), `MAIL_FROM="TEMS <studio@domain>"`. Resend Pro is billed to the client (decided for the NEVMA engagement).
- Turnstile: Cloudflare → Turnstile → add site (domain + `localhost`), widget mode **Invisible**; keys → env.

## GitHub Actions
Workflows live in `.github/workflows/`. Repo secrets to add once:

| Secret | Used by | Notes |
| --- | --- | --- |
| `VERCEL_DEPLOY_HOOK` | `rebuild.yml` (+ Sanity webhook URL) | Vercel → Settings → Git → Deploy Hooks |
| `SANITY_BACKUP_TOKEN` | `backup.yml` | Viewer token `tems-backup` |
| `RCLONE_CONFIG` | `backup.yml` | Full `rclone.conf` text; remote **must** be named `drive` → folder `TEMS/backups` |
| `PUBLIC_SANITY_PROJECT_ID` | `retention.yml` | Same as site env |
| `SANITY_WRITE_TOKEN` | `retention.yml` | Editor token `tems-web-forms` |

- `rebuild.yml`: daily 03:10 UTC (+ manual) `POST` deploy hook.
- `backup.yml`: weekly Monday 02:00 UTC (+ manual): `npx sanity@6.22.0 dataset export production` → artifact 90 days → `rclone copy` to `drive:TEMS/backups` as `tems-production-YYYY-MM-DD.tar.gz`.
- `retention.yml`: weekly Monday 02:30 UTC (+ manual): `node apps/web/scripts/retention.mjs`.

## Vercel project notes
- Root directory: `apps/web`. `vercel.json` sets immutable cache headers for `/assets/*`. `/studio` → lowest-order room is an Astro `redirects` entry (not duplicated in `vercel.json`).
- Enable **Web Analytics** in the project dashboard; `@vercel/analytics` loads only when `VERCEL_ENV === 'production'`.

## Costs (client pays running costs — decided)
Sanity Free · Vercel under the NEVMA Pro team · Resend (shared Pro) · Turnstile free · domain. Nothing new beyond the domain.
