# 10 · Register interest page and thanks page (markup and behaviour, no server yet)

Read `docs/PAGES.md` (Register interest), `docs/FORMS.md` (fields, chips). Design: `enquire.html`, `enquire-sent.html`, blocks `blocks/enquire/`, `blocks/enquire-sent/`.

Do:
1. `src/blocks/enquire/Form.astro` with two states from the same component: `state="form"` (left panel + form) and `state="sent"` (left panel + "Got it." panel). Inputs get real `name` attributes, `required`, `type`, `autocomplete`; labels stay exactly as designed. Add the honeypot (`.sr-only`), hidden `room`, hidden `projectTypes` input(s), and the Turnstile container (invisible; renders nothing visible). The form `action="/api/enquiry" method="post"`.
2. Chips script (`src/scripts/enquiry.ts`, part 1): toggle `aria-pressed` + the design's selected/unselected chip classes; sync hidden inputs; at least one required.
3. `?room=` handling (hidden field + placeholder first line), error line slot (`role="status"`, empty, styled in additions.css, zero height when empty so the resting state is unchanged).
4. `src/pages/enquire/index.astro` (state form, FAQ first open) and `src/pages/enquire/thanks.astro` (state sent, `noindex`).

Checks: `pnpm test:fidelity -- -g "enquire"` → 4 passed (enquire and enquire-sent, 1440 and 390).

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
