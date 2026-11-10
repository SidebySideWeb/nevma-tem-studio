# 12 · Contact

Read `docs/PAGES.md` (Contact). Design: `contact.html`, blocks `blocks/contact/`.

Do: `Hero`, `Channels` (row is a link when `href` is set, otherwise the same markup as a `<div>` — check the design: rows 1–2 are `<a>`, row 3 is `<div>`), `MapCta` (map image linking to `siteSettings.mapUrl`, or the design's striped placeholder with its text).

Checks: `pnpm test:fidelity -- -g "contact"` → 2 passed.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
