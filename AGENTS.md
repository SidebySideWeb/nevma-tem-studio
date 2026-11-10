# AGENTS.md — TEMS website

You are building the website of **TEMS — the Ellinikon music studio**, a recording studio in Ellinikon, Athens.
It presents the rooms, gear, people and clients, and collects **expressions of interest** (no online booking, no payments).
English only. TEMS is its own company: never brand it as NEVMA. NEVMA Music appears only as a *partner*.

## Stack (fixed)
- pnpm workspace: `apps/web` (Astro, static pages + one server route) and `apps/studio` (Sanity Studio, already built).
- Astro 7 with `@astrojs/vercel`; vanilla TypeScript in `<script>` tags; **no UI framework, no Tailwind, no CSS-in-JS**.
- Sanity (`@sanity/client`, `@sanity/image-url`), GROQ queries in `apps/web/src/lib/queries.ts`, read at build time.
- Forms: `POST /api/enquiry` writes a `formSubmission` to Sanity, sends emails with Resend, checks Cloudflare Turnstile + a honeypot.
- Hosting: Vercel. Rebuild on publish via a Sanity webhook → Vercel deploy hook.

## The one rule that matters: the site IS the design
`design/build/` is the source of truth. It was generated from the approved canvas and is pixel-identical to it.
1. **Copy markup, never redraw it.** Each block in `design/build/blocks/<page>/NN-name.html` becomes an Astro component with the *same elements, same classes, same order, same attributes*. Replace only the text, links and images with data.
2. **`tems.css` is copied unchanged** to `apps/web/src/styles/tems.css`. Never edit, rename, reorder, "clean up" or convert its classes (`t-xxxxxx`, `d`, `m`, `wrap`, `stack`, `g2`…). They look ugly; that is the point — they are exact.
3. **No new CSS for designed blocks.** CSS for things the design doesn't show (focus rings, open FAQ answers, gallery motion, error message, legal and 404 pages) goes only in `src/styles/additions.css`, each rule with a comment saying why.
4. Every top-level block carries `data-block="NN-name"` exactly as in `design/build/blocks.json`; every page's `<body>` has the design's `pg-<page>` class.
5. Do not add, remove or reorder blocks, wrappers or text. No "improvements". If something seems wrong in the design, write it in `docs/OPEN-QUESTIONS.md` and build it as designed.
6. **Done = `pnpm test:fidelity` passes** for the page at 1440 and 390 with the seed content. Visual review is not enough.

## Content
- Every text, image and link a client might change comes from Sanity (`docs/CONTENT-MODEL.md` maps each field to its block). Fixed interface words (footer column titles, "Room 01 / 03", arrows) live in `src/lib/ui.ts`.
- The seed is the design copy word for word, so the fidelity test can compare text. Never "fix" seed text; the `[bracketed]` placeholders are replaced by the client in the Studio.
- Display headings keep the designer's line breaks: each line of a `displayHeading` becomes a line, joined with `<br>`.

## Quality bars
- Accessibility: real `<a>`, `<button>`, `<label>`; visible focus (`additions.css`); `aria-expanded`, `aria-pressed`, `aria-live` where the behaviour needs it; images keep the design's `alt` (from Sanity).
- Performance: LCP < 2.5 s, CLS < 0.1, INP < 200 ms on 4G mobile; ≤ 10 KB gzipped JS per page; hero image eager with `fetchpriority="high"`, everything else lazy. Do **not** add `width`/`height` attributes to `<img>`: the design's classes size them, and the attributes would override `aspect-ratio`.
- Security: tokens only on the server; the write token is used only in `/api/enquiry`; validate everything server-side.

## Where things are
`docs/PAGES.md` routes, blocks and behaviours · `docs/CONTENT-MODEL.md` fields · `docs/DESIGN-SYSTEM.md` tokens and class notes ·
`docs/FIDELITY.md` the test · `docs/FORMS.md` the enquiry flow · `docs/DEPLOY.md` Vercel, Sanity, webhooks, backups · `docs/DECISIONS.md`.
