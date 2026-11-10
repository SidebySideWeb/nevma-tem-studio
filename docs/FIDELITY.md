# How "exactly like the design" is built and checked

Elite Protection's first front end did not match its design: the kit called the design "a visual target", the rules said
"tokens only, no pixel sizes", the CMS had generic sections, and the export was runtime-rendered with inline styles.
The fix (its "V2 exact" pack) is built into this kit from the start.

## 1. The design as static, exact HTML — `design/build/`
- Each canvas page was rendered, and every inline style was turned into one generated class (254 in total). Per-page rules that
  differ between canvas pages are scoped with `.pg-<page>`. Result: plain HTML + one `tems.css`, no runtime.
- **Checked: 0 different pixels** against the canvas render for all 8 screens at 1440 px and 390 px (16 comparisons).
- Pages: `home`, `studio`, `about`, `clients`, `sessions`, `enquire`, `enquire-sent`, `contact`. They link to each other.
- `blocks/<page>/NN-name.html`: each top-level block on its own — the thing you paste into a component.
- `blocks.json`: block names per page, in order (the test's checklist). `text.json`: every text string, image and form field per block.

## 2. Porting rules (AGENTS.md, `.cursor/rules/20-css-exact.mdc`, `25-design-fidelity.mdc`)
Copy markup and classes verbatim; data replaces text, links and images only; `tems.css` unchanged; extra CSS only for undesigned states.

## 3. Content that equals the design copy — `seed/`
The seed is the design text word for word, so text can be compared exactly. Content changes later are the client's; the test is for build time.

## 4. The test — `apps/web/tests/fidelity/fidelity.spec.ts`
For each route (`ROUTES` in the spec) at 1440 and 390, against the same design page:
1. same `data-block` list, same order;
2. each block's height within ±2% (min ±2 px);
3. same visible text;
4. same set of text styles (font, size, weight, width, case, letter spacing, line height, colour) and the same background and border colours;
5. pixels: ≤ 0.1% differ (colour threshold 0.02), with photos blanked on both sides (photos are content).
On failure it writes `*-design.png`, `*-site.png`, `*-diff.png` per block to `apps/web/test-results/fidelity/`.

**Proven before delivery:** the design build served as the site passes all 16 screen comparisons; each of these planted faults fails:
a 1 px shift of one heading, a one-shade grey change (#5E5E5E → #626262), one changed word, and letter spacing +0.01em.

Run: start the site with the seed (`pnpm dev` or `pnpm preview`), then `pnpm test:fidelity` (all) or `pnpm test:fidelity -- -g "home"`.
Environment: `SITE_URL` (default `http://localhost:4321`), `DESIGN_DIR` (default `design/build`). Do not change the thresholds.

## Deliberate exceptions (allowed differences)
- Behaviour the static design can't show (gallery movement, open FAQ answers, form errors) — not part of the resting state, so not tested.
- `href` values differ (design `about.html`, site `/about`): links are not compared.
- A block may carry `data-fidelity-skip="reason"` only with the owner's approval, logged in `OPEN-QUESTIONS.md`.

## Self-test on your machine (do this once after prompt 01)
```
node apps/web/tests/fidelity/serve-design.mjs design/build 4399
SITE_URL=http://localhost:4399 pnpm test:fidelity      # expect: 16 passed
```
If this fails, the problem is your test setup (browser, fonts), not the site. Fix it before building pages.
