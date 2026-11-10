# 11 · Enquiry API, emails, Turnstile and submit

Read `docs/FORMS.md` completely, `.cursor/rules/50-forms-security.mdc`.

Do:
1. `src/lib/server/validate.ts` (shared rules; unit tests), `turnstile.ts` (`siteverify`), `mail.ts` (Resend: notification + auto-reply, plain text + simple HTML), `ratelimit.ts`.
2. `src/pages/api/enquiry.ts` (`prerender = false`): JSON and urlencoded; the exact order in FORMS.md; write the submission with a client using `SANITY_WRITE_TOKEN` (separate from the viewer client); 303 redirects for form posts.
3. `src/scripts/enquiry.ts` part 2: client validation, Turnstile token (render the invisible widget on first interaction, execute on submit), `fetch`, success swap to the sent-state markup (render it hidden in the page from the same component so it's identical), focus the heading, `history.replaceState` → `/enquire/thanks`; error → status line.
4. e2e `tests/e2e/enquiry.spec.ts`: Turnstile test keys; intercept Sanity and Resend calls; cases: success with JS, success without JS (JS disabled context), validation error, honeypot, rate limit, `?room=studio-a` stored.

Checks: `pnpm --filter web test:unit`, `pnpm --filter web test:e2e`; `pnpm test:fidelity -- -g "enquire"` still 4 passed; one real submission on a Vercel preview arrives in the Studio and both emails arrive.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
