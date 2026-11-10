# Pages, routes, blocks and behaviours

Every designed route, the blocks it is made of (`design/build/blocks.json`), where each block's data comes from, and what moves.
"Design" = the file in `design/build/`. Block names are the `data-block` values.

| Route | Design | Body class | Data | Index |
| --- | --- | --- | --- | --- |
| `/` | `home.html` | `pg-home` | `homePage`, `siteSettings`, 3 rooms, 3 quotes | yes |
| `/studio` | — | — | 301 → `/studio/<slug of room with lowest order>` (Vercel redirect, generated at build) | — |
| `/studio/[slug]` | `studio.html` | `pg-studio` | `room`, `roomsPage`, other rooms | yes |
| `/about` | `about.html` | `pg-about` | `aboutPage`, team, questions | yes |
| `/clients` | `clients.html` | `pg-clients` | `clientsPage`, all clients | yes |
| `/sessions` | `sessions.html` | `pg-sessions` | `sessionsPage`, questions | yes |
| `/enquire` | `enquire.html` | `pg-enquire` | `enquirePage`, `form`, questions | yes |
| `/enquire/thanks` | `enquire-sent.html` | `pg-enquire` | same | **noindex** |
| `/contact` | `contact.html` | `pg-contact` | `contactPage` | yes |
| `/legal/[slug]` | not designed | `pg-home` | `legalPage` | yes |
| 404 | not designed | `pg-home` | `notFoundPage` | noindex |
| `POST /api/enquiry` | — | — | see `FORMS.md` | — |

Header and footer are the same on every page (`01-header`, last block `NN-footer`). Header `active`: studio on room pages, about, clients, sessions, contact; none on Home, Enquire and legal.

## Shared blocks
- **Header** — top strip: red dot + `${street}, ${area}, ${city}` · `${phoneDisplay} · ${emailDisplay}`. Bar: white logo → `/`; nav The Studio, About, Clients, Sessions, Contact (labels in `ui.ts`); orange button `headerCta` → `/enquire`. On phones the design wraps the nav onto two lines; build it as designed (no menu button — see OPEN-QUESTIONS).
- **Footer** — white logo, `footerText`, partner line: `partnerFooterLabel` + partner logo + "↗" → `partnerUrl`. Columns (titles in `ui.ts`): Explore (The Studio, About, Clients, Sessions) · Work with us (Register interest, Contact, each social + " ↗", `partnerName` + " ↗") · Studio (street, `${area}, ${city}, ${country}`, email link showing `emailDisplay`, `phoneDisplay`). Bottom: `© {build year} {studioName}` · Privacy → `/legal/privacy`, Cookies → `/legal/cookies`.
- **CtaBand** (orange) — `displayHeading` title, optional text (Sessions has none: omit the `<p>`), main button (black), second button (outline). Used by Home `07-cta`, Room `07-cta`, Clients `04-cta`, Sessions `06-cta`.

## Home `/`
| Block | Content |
| --- | --- |
| 02-hero | `heroImage` (eager, `fetchpriority=high`), red dot + `heroLabel`, white logo from settings (alt = studioName), `heroIntro`, `heroPrimary`, `heroSecondary` |
| 03-rooms | `rooms` heading (chapter, title, intro); 3 cards from `roomCards`: `cardImage`, `name`, `cardLabel` + " →", link to the room |
| 04-records | `records` heading (title "The\nRecords" → `The<br>Records`), `recordsCta`; 12 `recordCovers` (4 × 3; 3 across on phones). Partner box: `partnerLabel`, partner logo, `partnerText`, `partnerLinkLabel` → `partnerUrl`; 3 `partnerReleases` (cover, title, `label`, link = release url or `partnerUrl`) |
| 05-gear | `gearImage`, `gear` heading, 4 `gearStats`, `gearCta` |
| 06-quotes | `quotes` heading, 3 quotes: `“{quote}”`, `{name} — {role}` |
| 07-cta | `cta` band |

## Room `/studio/[slug]`
| Block | Content |
| --- | --- |
| 02-hero | `heroImage`, label `Room {order:02} / {total:02}`, `name` (h1), `heroIntro`, buttons `askLabel` → `/enquire?room={slug}` and `roomsPage.contactLabel` → `/contact` |
| 03-facts | 4 `facts` (label, value) |
| 04-room | `storyChapter`, `headline`, `story` paragraphs, `notable` / `tasks` / `clientsLine` (labels Notable, Tasks, Clients in `ui.ts`); floor plan: `floorPlan` image inside the bordered 4:5 box, or the design's placeholder text "[Floor plan drawing]" when empty; `floorPlanCaption` |
| 05-gallery | `galleryChapter`, `roomsPage.galleryTitle`, counter `01 / {count:02}`, prev/next buttons; one large + two stacked photos |
| 06-equipment | `equipmentChapter`, `roomsPage.equipmentTitle`, `equipmentIntro`; groups in a 3-column grid: title + number `01…`, items one per line |
| 07-cta | room `cta`, else `roomsPage.cta` with `{room}` → name ("Record in\n{room}." → `Record in<br>Studio A.`) |
| 08-other-rooms | `roomsPage.otherRoomsTitle`; every other room in order: `wideImage` or `cardImage`, name, `Room {order:02} →` |

**Gallery behaviour** (PROPOSED — the design shows the resting state): the three slots show photos *i, i+1, i+2* (wrapping). Next/previous move *i* by one; the counter shows *i+1*. Swap `src`/`alt` with a 150 ms opacity fade (none with reduced motion). Keyboard: buttons only. With JS off the first three photos show and the buttons do nothing (hide them with `[data-js-only]` until JS adds `.js` to `<html>` — this changes no pixels with JS on).

## About `/about`
| Block | Content |
| --- | --- |
| 02-hero | `heroImage`, `title`, `captionTitle`, `captionText` |
| 03-story | `estLabel`, `year`, `locationLabel`, `location`, `lead`, `paragraphs` |
| 04-team | `teamTitle`, `teamSummary`; per `teamGroups`: group title (orange label), members: photo (or the design's striped `ph` square when empty), name, role |
| 05-faq | `faqTitle`, `faqIntro`, questions closed (accordion, see below) |
| 06-partner | partner logo, `partnerLabel`, `partnerText`, `partnerLinkLabel` → `partnerUrl` |
| 07-panorama | `panorama` (full width, 480 px high) |

## Clients `/clients`
| Block | Content |
| --- | --- |
| 02-hero | wall of `heroCovers`, 10 across (4 on phones), 3 rows = 30 tiles; repeat the list in order if fewer than 30; `title`, `heroCaption` |
| 03-a-z | `azLabel`, `intro`; jump bar A–Z (all 26 letters, links to `#letter-x`; letters without clients rendered but not linked — PROPOSED); columns: each letter that has clients, partners first with the black "Partner" tag, then by name |
| 04-cta | `cta` band |

The jump links in the design all point to `#az`. Give each letter group `id="letter-a"` and link to it — this changes no pixels.

## Sessions `/sessions`
| Block | Content |
| --- | --- |
| 02-hero | `heroImage` (object position centre 60% — in the design class), `title`, `heroCta` |
| 03-intro | 3 `introItems` numbered `01–03` (orange), title, text; 4 `introImages` (2 × 2) |
| 04-how-it-works | `stepsTitle`; 4 `steps` numbered `01–04` |
| 05-faq | `faqTitle`, `faqIntro`, questions closed (accordion) |
| 06-cta | `cta` band without text |

## Register interest `/enquire` and `/enquire/thanks`
| Block | Content |
| --- | --- |
| 02-form | left: darkened `image`, red dot + `label`, `title`, `intro`, rows Email (`emailDisplay`, mailto) / Phone (`phoneDisplay`) / Reply within (`replyTime`) — labels in `ui.ts`. Right: the form (labels and placeholders from `labels`, choices from `form.projectTypes`, `defaultProjectType` pressed) — or on `/enquire/thanks` the sent state (`thanksTitle`, `thanksText`, `againLabel` → `/enquire`) |
| 03-faq | `faqTitle`, `faqIntro`; first question **open** (as designed), the rest closed |

Behaviours (see `FORMS.md`): chips toggle (`aria-pressed`, at least one required); `?room=<slug>` pre-fills a hidden `room` field and adds "Room: {name}" as the first line of the message placeholder (not the value); submit with JS → in-place swap to the sent-state markup (copied from `enquire-sent.html`) and `history.replaceState` to `/enquire/thanks`; error → `errorText` in a `role="status"` line above the submit button (additions.css).

## Contact `/contact`
| Block | Content |
| --- | --- |
| 02-hero | `heroImage`, `title`, `intro` |
| 03-channels | 3 `channels`: label, value (link when `href`), note |
| 04-map-cta | `mapImage` linking to `siteSettings.mapUrl` (or the design's striped placeholder with "[Map — static image, links to Google Maps]" when empty); orange panel: `ctaTitle`, `ctaText`, `ctaButton` |

## FAQ accordion (About, Sessions, Enquire)
The Enquire design shows the pattern: a wrapper with the bottom border, a full-width `<button>` row (question + sign), and the answer `<p>` below. About and Sessions show closed rows only: build them with the **Enquire structure**, keeping their own colours, so the closed state is pixel-identical (the fidelity test checks it). Open answer on Sessions (dark band): colour `#D9D6CE`, otherwise as Enquire. Sign: "+" closed, "−" open. One open at a time per list. CSS for open states → `additions.css`.

## Not designed: legal pages and 404 (built from the design's parts)
- **Legal** `/legal/[slug]`: Header; paper band (`#F2F0EB`, padding 120px 0, `wrap` 1280px): mono label "Legal" (grey `#5E5E5E`), `d hx` title at 88px (64px on phones), "Last updated {date}" in mono; body in a 720px column: paragraphs 17px/1.65, `h2` as `d` 40px with 48px top margin, `h3` Archivo 700 22px, links underlined; Footer. Not in the fidelity test.
- **404**: Header; black band like the Home hero without photo: red dot + "404", `d hx` title 150px from `notFoundPage.title`, text, main button; Footer.
Offer: these two can be designed on the canvas first if the client wants them reviewed.
