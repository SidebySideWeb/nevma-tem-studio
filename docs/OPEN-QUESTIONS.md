# Open questions

## For the client (TEMS)
| # | Question | Needed for |
| --- | --- | --- |
| Q1 | All `[bracketed]` copy: positioning line, room texts and facts, equipment lists, gear numbers, team names/roles/photos, founding year, quotes, FAQ answers, address, phone, email, reply time | content entry before launch |
| Q2 | Real client list and release covers (the 13 `standin-cover-*` images are borrowed from the Nevma Music design) | Home records grid, Clients wall |
| Q3 | Building photo with the TEMS sign (the current one shows "THE SOUND LAB") | Contact hero |
| Q4 | Floor plans per room (line drawing, portrait) | room pages |
| Q5 | Is the "Lounge" really a room to show, or is there a third recording room? | rooms, "Room 03" |
| Q6 | Domain name; sending address for emails; who receives enquiries | DNS, Resend, form settings |
| Q7 | Partner wording with NEVMA ("partner studio of NEVMA Music, the London label") approved by both; NEVMA Music site URL; which NEVMA releases were recorded here | partner blocks |
| Q8 | Privacy, cookie and terms text | legal pages |
| Q9 | Instagram / YouTube URLs | footer |
| Q10 | Map: static map image or Google Maps link only? Coordinates | Contact |

## For Dimitris
| # | Question | Default if no answer |
| --- | --- | --- |
| D1 | Phones: the design wraps the header nav onto two lines (no menu button). Keep, or design a compact phone menu? | keep as designed |
| D2 | Legal and 404 pages: build from parts (as specified), or design them on the canvas first? | build from parts |
| D3 | Forms in Sanity (like Nevma Music) instead of the shared Supabase table | Sanity |
| D4 | Cookieless analytics and no cookie banner | yes |
| D5 | Create separate Sanity tokens (`tems-web-viewer` Viewer, `tems-web-forms` Editor, `tems-backup` Viewer) as in DEPLOY.md? One token is currently used for both web Viewer and Write | yes — split when convenient; rotate the shared token if it was pasted into chat |
| D6 | Run `npx sanity login` locally so Studio at http://localhost:3333 and https://tems.sanity.studio can be opened without the API-token CLI workaround | yes, once per machine |
| D7 | Create Vercel project `tems-web` (DEPLOY.md) and set Preview env (`RESEND_API_KEY`, live Turnstile, `SANITY_WRITE_TOKEN`, `PUBLIC_SITE_URL`) so prompt 11’s “one real submission on a Vercel preview” can be run | blocked until project exists; local live write to Sanity succeeded; emails blocked without `RESEND_API_KEY` |
| D8 | Rich Results test for LocalBusiness (AC-12) needs a public preview URL | run Google Rich Results Test on Home or Contact after first Vercel preview; JSON-LD is already in the built HTML |
| D9 | Init git remote for TEMS, create Vercel project `tems-web`, add GitHub Action secrets, Sanity→deploy webhook; then: push a branch for preview, “Run workflow” on rebuild/backup/retention, publish in Studio → prod rebuild ~2 min | blocked: this workspace has no `.git` / no `tems-web` project yet; code (workflows, `vercel.json`, retention, analytics) is ready |
| D10 | Real VoiceOver/NVDA pass of Enquire before launch? Prompt 16 used Playwright keyboard walk + form label/`aria-live`/`aria-expanded` spot-check | yes — SR on a real device/browser before go-live; automated spot-check already green |
| D11 | Re-run AC-13 Lighthouse on the first Vercel production URL (CDN + HTTPS + live Analytics) to confirm LCP/SEO without local lab caveats | after `tems-web` exists |
