# TEMS — the Ellinikon music studio · Cursor build kit (v1.0, 9 Nov 2026)

Everything needed to build the TEMS website in Cursor: **Astro** front end, **Sanity** CMS, deployed on **Vercel**,
built **exactly** like the approved design — pixel for pixel, at desktop (1440 px) and phone (390 px).

Same shape as the Nevma Music and Elite Protection kits, with one change learned from Elite Protection:
the exact design build, the block-by-block fidelity test and the "copy the markup, don't reinterpret it" rules
are here **from the first prompt**, not added afterwards.

## Start here
1. Read `AGENTS.md` (the rules Cursor follows) and `docs/FIDELITY.md` (how "exact" is enforced).
2. Open `design/index.html` in a browser: the 8 designed screens, clickable, plus screenshots.
3. Copy this whole folder into an empty repo (`tems-site`), open it in Cursor.
4. Run the prompts in `prompts/` **in order**, one per Cursor chat. Each ends with checks; don't move on until they pass.
5. A page is done when `pnpm test:fidelity` passes for it (all blocks, 1440 + 390).

## What's inside
| Folder | What it is |
| --- | --- |
| `AGENTS.md`, `.cursor/rules/` | Rules Cursor always follows (stack, exactness, Sanity, forms, a11y, tests) |
| `docs/` | ARCHITECTURE, PAGES (every route, block and behaviour), CONTENT-MODEL (every Sanity field → design block), DESIGN-SYSTEM, FIDELITY, FORMS, DEPLOY, DECISIONS, ACCEPTANCE, OPEN-QUESTIONS |
| `prompts/` | `00-how-to-use.md` + 16 build prompts (≈ 8.5 working days) |
| `design/build/` | **The source of truth**: every designed screen as static HTML + one generated `tems.css`, pixel-identical to the canvas (0 px difference, checked). Also `blocks/<page>/NN-name.html`, `blocks.json`, `text.json`, fonts and photos |
| `design/screenshots/` | Full-page screenshots of every screen, desktop 1440 + phone 390 |
| `design/source/` | The original canvas files (`.dc.html`, `canvas.json`) |
| `apps/studio/` | Ready Sanity Studio: schema validated (0 errors, 0 warnings), type-checked, `sanity build` passes |
| `apps/web/tests/fidelity/` | The fidelity test (Playwright). Proven: design-as-site passes 16/16; a 1 px shift, a one-shade grey, one changed word and 0.01em letter spacing each fail |
| `seed/` | `tems-seed.tar.gz`: 129 documents (the design copy, word for word) + 22 photos, ready for `sanity dataset import`; `tems-seed/data.ndjson` |
| `scripts/` | `check-placeholders.mjs`: lists every `[placeholder]` still on the built site before launch |

## The screens
Home · The Studio (room page, one per room) · About · Clients A–Z · Sessions · Register interest · Register interest — sent · Contact.
Not designed (built from the same parts, see `docs/PAGES.md`): legal pages, 404.
