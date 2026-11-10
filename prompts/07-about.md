# 07 · About and the FAQ accordion

Read `docs/PAGES.md` (About + FAQ accordion). Design: `about.html`, blocks `blocks/about/`; the open-answer pattern is in `blocks/enquire/03-faq.html`.

Do:
1. `src/blocks/shared/FaqList.astro`: renders questions with the **Enquire structure** (wrapper with border, full-width button row, answer `<p>`). Props: items, `firstOpen` (Enquire true), `tone` (`paper` | `ink`). Closed rows on About must be pixel-identical to the design's rows (the test checks). Open answer: the Enquire answer classes; on ink (Sessions) colour `#D9D6CE` via `additions.css`. Sign "+" / "−"; `aria-expanded`, `aria-controls`; one open at a time. Script `src/scripts/faq.ts`.
2. About blocks in `src/blocks/about/`: `Hero`, `Story`, `Team` (photo or the design's striped `ph` square), `Faq` (uses FaqList), `Partner`, `Panorama`.

Checks: `pnpm test:fidelity -- -g "about"` → 2 passed; clicking a question opens it; Tab + Enter works.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
