# How to use these prompts

- One prompt = one new Cursor chat (Agent mode). Paste the prompt text, let it work, review the diff, run the checks, commit.
- Order matters. Don't start a page prompt before 03 and 04 are done.
- Every page prompt ends with the fidelity test for that page. **A page is done only when it passes at 1440 and 390.**
- If Cursor wants to change `design/build/`, `tems.css`, the test thresholds or the seed text: stop it. Those are the reference.
- Commit after each prompt: `git commit -m "TEMS NN: <title>"`.

| # | Prompt | Days |
| --- | --- | --- |
| 01 | Workspace | 0.25 |
| 02 | Sanity project, seed, Studio deploy | 0.25 |
| 03 | Foundation: layout, CSS, fonts, header, footer, closing band | 0.75 |
| 04 | Data layer | 0.5 |
| 05 | Home | 0.75 |
| 06 | Room pages + gallery | 1 |
| 07 | About + FAQ accordion | 0.5 |
| 08 | Clients A–Z | 0.5 |
| 09 | Sessions | 0.4 |
| 10 | Register interest page + thanks page | 0.5 |
| 11 | Enquiry API, email, Turnstile, submit | 1 |
| 12 | Contact | 0.25 |
| 13 | Legal pages + 404 | 0.4 |
| 14 | SEO | 0.5 |
| 15 | Deploy, webhook, GitHub Actions | 0.5 |
| 16 | QA and launch checks | 1 |
| | **Total** | **≈ 9** |
