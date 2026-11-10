# Register interest: the enquiry flow

No booking and no payment. Visitors register interest; the studio replies.
Everything is stored in Sanity (as on Nevma Music): the form settings (`form`, key `enquiry`) and one `formSubmission` per enquiry.

## Fields (labels from `enquirePage.labels`, design order)
| Field | name | Rule |
| --- | --- | --- |
| Name * | `name` | required, 2–80 |
| Artist / project | `artist` | optional, ≤ 80 |
| Email * | `email` | required, valid email |
| Phone | `phone` | optional, ≤ 30, digits/spaces/+()- |
| Type of project * | `projectTypes[]` | ≥ 1, each one of `form.projectTypes` (the designed chip buttons; see below) |
| Preferred start | `preferredStart` | optional ISO date, today or later |
| Days needed (approx.) | `days` | optional integer 1–60 |
| Tell us about the project | `message` | optional, ≤ 4000 |
| Consent | `consent` | required true; links "Privacy policy" → `/legal/privacy` |
| hidden | `room` | optional room slug from `?room=` |
| hidden honeypot | `company` | must be empty; visually hidden (`.sr-only`, `tabindex=-1`, `autocomplete=off`) |
| Turnstile | `cf-turnstile-response` | invisible widget; the design's "Protected by Turnstile" text stays as designed |

**Chips:** keep the designed `<button type="button" aria-pressed>` chips inside the `<fieldset>`/`<legend>`. Selected and unselected
use the design's two chip classes (copy them from `enquire.html`; "Recording" is selected in the resting state). A script toggles
`aria-pressed` + the class and keeps one hidden input per selected type (`<input type="hidden" name="projectTypes" value="…">`).
Without JS the chips can't be toggled; the hidden input for `defaultProjectType` is rendered server-side, so the no-JS post still has a type.

## Submit
- **With JS:** prevent default, validate in the browser (same rules), `fetch('/api/enquiry', { method: 'POST', body: JSON })`.
  Success → replace the form panel with the sent-state markup (from `enquire-sent.html`), move focus to the "Got it." heading, `history.replaceState(null, '', '/enquire/thanks')`.
  Error → show `enquirePage.errorText` (or field messages) in a `role="status"` line above the submit button (styles in `additions.css`); keep the values.
- **Without JS:** the form posts urlencoded to `/api/enquiry`; the API redirects `303` to `/enquire/thanks` (static page = the sent state) or to `/enquire?error=1`.
- "Send another" → `/enquire`.

## Server (`src/pages/api/enquiry.ts`, `prerender = false`)
1. Rate limit 5 / 10 min / IP. 2. Honeypot → fake success. 3. Turnstile `siteverify` with the secret and the IP. 4. Validate.
5. `createIfNotExists` → `formSubmission` `_id: submission-<uuid>`, fields as above + `form` reference + `status: 'new'` + `submittedAt`.
6. Resend: **notification** to `form.notify` (subject "New enquiry — {name}{artist ? ' · ' + artist : ''}", all fields, link to the document in the Studio), reply-to = sender;
   **auto-reply** to the sender from `MAIL_FROM` with `form.autoReplySubject` / `autoReplyBody` (`{name}` replaced), reply-to = studio email.
7. If step 5 fails, still send the notification (marked "NOT SAVED") so no lead is lost.

## Retention and privacy
Weekly job (GitHub Action, `DEPLOY.md`) deletes `formSubmission` older than `form.retentionMonths` (24). The privacy page must say what is stored and for how long.
Sanity webhook ignores `formSubmission` so enquiries never trigger a rebuild.
