# 03 · Foundation: layout, CSS, fonts, header, footer, closing band

Read `AGENTS.md`, `docs/FIDELITY.md`, `docs/DESIGN-SYSTEM.md`, `.cursor/rules/20-css-exact.mdc`, `25-design-fidelity.mdc`.

Do:
1. Copy `design/build/tems.css` → `apps/web/src/styles/tems.css` **byte for byte**. Copy `design/build/assets/fonts/*` → `apps/web/public/assets/fonts/` and `design/build/assets/fonts.css` → `apps/web/public/assets/fonts.css`.
2. Create `src/styles/additions.css` with only: `.sr-only`; `:focus-visible` (2px solid #FF4F00, offset 2px) for `a, button, input, textarea, [tabindex]`; `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important } }`. Comment each rule.
3. `src/layouts/Base.astro`: props `page` (design page name → body class `pg-<page>`), `title`, `description`, `noindex`, `image`, `active` (header). Head: charset, viewport, title, `/assets/fonts.css`, `tems.css`, `additions.css`, preload the Archivo woff2. Body: the design's root wrapper `<div class="…">` (copy from any design page: it's the element right inside `<body>`), then `<Header active>`, `<slot/>`, `<Footer>`. Add `class="js"` to `<html>` with a 1-line inline script in the head (needed for `[data-js-only]`).
4. `src/blocks/shared/Header.astro` from `design/build/blocks/home/01-header.html` (inactive link class `t-baae53`, active `t-8b9489`); `Footer.astro` from `blocks/home/08-footer.html`; `CtaBand.astro` from `blocks/home/07-cta.html` (props: title lines, text?, primary, secondary?). Data via props for now (hard-code the seed values in a temporary `src/lib/dev-data.ts`; prompt 04 replaces it).
5. `src/lib/ui.ts` (fixed interface words: nav labels, footer column titles, "Notable/Tasks/Clients", "Email/Phone/Reply within", "Room", arrows), `src/lib/text.ts` (`lines()`), `src/lib/links.ts` (`href(cta, rooms)` per `docs/CONTENT-MODEL.md`).
6. A temporary `src/pages/index.astro` with Header + Footer only.

Checks: `cmp apps/web/src/styles/tems.css design/build/tems.css` (no output); `pnpm --filter web build`; open `/` next to `design/build/home.html`: header and footer look identical at 1440 and 390.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
