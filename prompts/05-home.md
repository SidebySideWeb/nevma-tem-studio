# 05 · Home

Read `docs/PAGES.md` (Home), `.cursor/rules/25-design-fidelity.mdc`. Design: `design/build/home.html`, blocks `design/build/blocks/home/`.

Do: one component per block in `src/blocks/home/` — `Hero.astro` (02-hero), `Rooms.astro` (03-rooms), `Records.astro` (04-records, incl. the NEVMA partner box), `Gear.astro` (05-gear), `Quotes.astro` (06-quotes); 07 uses `CtaBand`. Paste each block file, then replace text/links/images with `homeQuery` data. Hero image eager + `fetchpriority="high"`; others `loading="lazy" decoding="async"`. Keep every class; keep `<br>` in "The<br>Records" via `lines()`. `src/pages/index.astro` assembles them in order with `Base page="home"`.

Checks: start `pnpm --filter web dev`; `pnpm test:fidelity -- -g "home"` → 2 passed (1440, 390). Paste the summary.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
