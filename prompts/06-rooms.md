# 06 · Room pages and gallery

Read `docs/PAGES.md` (Room + Gallery behaviour). Design: `design/build/studio.html`, blocks `blocks/studio/`.

Do:
1. `src/pages/studio/[slug].astro` with `getStaticPaths` from `roomsQuery`; blocks in `src/blocks/studio/`: `Hero` (label `Room {order:02} / {total:02}`, ask button → `/enquire?room={slug}`), `Facts`, `Room` (floor plan image or the design's placeholder box), `Gallery`, `Equipment` (group numbers from position), `OtherRooms`; 07 uses `CtaBand` with the room's band or `roomsPage.cta` (`{room}` replaced).
2. `/studio` → 301 to the room with the lowest `order`: generate it at build (Astro redirect from data, or `vercel.json` written by a small build script — choose the simplest that works with the installed Astro version; document it).
3. Header "The Studio" and every `page: 'studio'` CTA link to that same room.
4. `src/scripts/gallery.ts` per the spec: 3 visible slots, prev/next by one with wrap-around, counter `aria-live="polite"`, 150 ms opacity swap (none with reduced motion), buttons `[data-js-only]` hidden without JS (rule in additions.css: `html:not(.js) [data-js-only]{visibility:hidden}`). Must cause no layout shift.

Checks: `pnpm test:fidelity -- -g "studio"` → 2 passed; `/studio` redirects; `/studio/live-room` and `/studio/lounge` build and show "Room 02 / 03", "Room 03 / 03"; gallery cycles with keyboard.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
