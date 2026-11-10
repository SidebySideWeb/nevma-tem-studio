# 04 · Data layer

Read `docs/CONTENT-MODEL.md`, `docs/PAGES.md`, `.cursor/rules/30-sanity.mdc`, `apps/studio/schemaTypes/`.

Do:
1. `src/lib/sanity.ts`: client with `projectId`, `dataset`, `apiVersion: '2025-10-01'`, `useCdn: false`, `token: import.meta.env.SANITY_VIEWER_TOKEN`, `perspective: 'published'`. Server-only (never imported by client scripts).
2. `src/lib/queries.ts`: one query per page — `settingsQuery`, `homeQuery`, `roomsQuery` (all rooms ordered, for routes and Other rooms), `roomQuery(slug)`, `aboutQuery`, `clientsQuery` (page + all clients), `sessionsQuery`, `enquireQuery` (with `form->`), `contactQuery`, `legalQuery(slug)`, `notFoundQuery`. Explicit projections; resolve references; images as `{asset->{_id, url, metadata{dimensions{width,height,aspectRatio}, lqip}}, hotspot, crop, alt}`.
3. `src/lib/types.ts`: types for every query result (hand-written from the schema).
4. `src/lib/image.ts`: `img(image, width)` and `srcset(image, widths)` with `@sanity/image-url`, `auto('format')`, `fit('max')`, `quality(80)`.
5. `src/lib/clients.ts`: `groupClients(clients)` → `[{ letter, clients }]` per `.cursor/rules/30-sanity.mdc` (A–Z, partners first, then by name; "#" last). Unit test in `tests/unit/clients.test.ts` (+ `links.test.ts`, `text.test.ts`).
6. Replace `dev-data.ts` with real data in Header/Footer (settings fetched once per build: memoise in `sanity.ts`).

Checks: `pnpm --filter web test:unit`; `pnpm --filter web build` with real Sanity data; header strip shows "[Street address], Ellinikon, Athens".

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
