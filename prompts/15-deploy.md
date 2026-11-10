# 15 · Deploy, webhook and GitHub Actions

Read `docs/DEPLOY.md`.

Do (code part; I do the dashboard clicks listed in DEPLOY.md):
1. `vercel.json` only if needed (redirect from prompt 06, headers: `Cache-Control` for `/assets/*` `public, max-age=31536000, immutable`).
2. `.github/workflows/rebuild.yml` (daily 03:10 UTC POST to `secrets.VERCEL_DEPLOY_HOOK`), `backup.yml` (weekly: `npx sanity@6.22.0 dataset export production` with `SANITY_AUTH_TOKEN` = backup token → `actions/upload-artifact` 90 days → `rclone copy` to the Drive remote from `secrets.RCLONE_CONFIG` folder `TEMS/backups`), `retention.yml` (weekly: node script deleting `formSubmission` older than `form.retentionMonths`, with the write token).
3. `apps/web/scripts/retention.mjs` for (2).
4. Vercel Web Analytics: add `@vercel/analytics` as the Vercel docs describe for Astro, loaded only in production.

Checks: push to a branch → Vercel preview builds; run each workflow once with "Run workflow"; publish a change in the Studio → production rebuilds within ~2 minutes.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
