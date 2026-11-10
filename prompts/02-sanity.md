# 02 · Sanity project, seed and Studio

Read `docs/DEPLOY.md` (Sanity part), `docs/CONTENT-MODEL.md`. The Studio in `apps/studio` is finished — do not change the schema.

I (Dimitris) have created the project **TEMS** in the NEVMA organisation and put its ID in `.env` (`SANITY_STUDIO_PROJECT_ID`, `PUBLIC_SANITY_PROJECT_ID`), dataset `production` (private), and the two tokens.

Do:
1. `pnpm --filter studio check:seed` → must say "Seed OK".
2. `cd apps/studio && npx sanity login` (if needed), then `pnpm --filter studio seed` (imports `seed/tems-seed.tar.gz` with `--missing`).
3. `pnpm --filter studio dev` → open http://localhost:3333 and confirm: Pages → Home shows the hero photo and text; Rooms lists Studio A, Live Room, Lounge; Clients A–Z has 84 entries; Enquiries → Form settings has "Register interest".
4. `pnpm --filter studio deploy` (host `tems`).

Checks: `npx sanity documents query '*[_type=="room"]{name}' --dataset production` returns 3 rooms; `count(*[_type=="client"])` = 84.

**Before you finish:** run the checks above, paste their output, list any file you changed outside the scope of this prompt (should be none),
and add anything you had to decide to `docs/DECISIONS.md` (PROPOSED) or `docs/OPEN-QUESTIONS.md`.
