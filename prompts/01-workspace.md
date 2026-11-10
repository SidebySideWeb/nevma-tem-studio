# 01 · Workspace

Read `AGENTS.md`, `docs/ARCHITECTURE.md`. The kit folder is already the repo root (`tems-site`).

Do:
1. Root `package.json` is provided (pnpm workspace). Run `pnpm install` at the root (installs `apps/studio`).
2. Create the Astro app **inside the existing `apps/web` folder** (it already contains `tests/fidelity/` — keep it):
   `pnpm create astro@latest apps/web -- --template minimal --typescript strict --no-git --install` (if the folder isn't empty, create in a temp folder and move the files in, keeping `tests/`).
3. Add `@astrojs/vercel`, `@astrojs/sitemap`, `@astrojs/check`, `@sanity/client`, `@sanity/image-url`, `@portabletext/to-html`, `resend`; dev: `@playwright/test`, `pixelmatch`, `pngjs`, `tsx`, `typescript`.
4. `astro.config.mjs`: `site: process.env.PUBLIC_SITE_URL`, `output: 'static'`, `adapter: vercel()`, `integrations: [sitemap({ filter: p => !p.includes('/enquire/thanks') })]`, `trailingSlash: 'never'`. Check the installed Astro version's docs for exact option names.
5. `apps/web/package.json` scripts: `dev`, `build`, `preview`, `check` (`astro check && tsc --noEmit && node ../../scripts/check-placeholders.mjs`), `test:fidelity` (`playwright test -c tests/fidelity/playwright.config.ts`), `test:unit`, `test:e2e`.
6. Root scripts already call these (`pnpm dev`, `pnpm test:fidelity`, …). `.env.example` is provided: copy to `.env` (don't commit).
7. `npx playwright install chromium`.
8. Self-test the fidelity suite (see `docs/FIDELITY.md`): serve `design/build` with `tests/fidelity/serve-design.mjs` and run `pnpm test:fidelity` with `SITE_URL=http://localhost:4399` → must say 16 passed.

Checks: `pnpm --filter web build` succeeds; fidelity self-test 16 passed; `pnpm --filter studio validate` → 0 errors; `git status` shows no `.env`.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
