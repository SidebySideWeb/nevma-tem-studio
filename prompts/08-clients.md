# 08 · Clients A–Z

Read `docs/PAGES.md` (Clients). Design: `clients.html`, blocks `blocks/clients/`.

Do: `src/blocks/clients/Hero.astro` (30-tile wall from `heroCovers`, repeated in order if fewer), `AZ.astro` (jump bar: 26 letters; letters with clients link to `#letter-x`, others plain text with the same classes; columns from `groupClients()`; NEVMA Music first under N with the "Partner" tag; partner links use `client.url` or `siteSettings.partnerUrl`), closing `CtaBand`.

Checks: `pnpm test:fidelity -- -g "clients"` → 2 passed; clicking "M" scrolls to M; unit test for grouping still passes.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
