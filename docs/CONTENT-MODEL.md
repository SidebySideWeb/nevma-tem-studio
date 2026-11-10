# Content model (Sanity)

Schema: `apps/studio/schemaTypes/`. One Sanity project ("TEMS") in the NEVMA organisation, dataset `production` (private).
Principle: **fixed layouts, editable content.** Each page is one document whose fields map 1:1 to places in the design blocks
(`PAGES.md` gives the block-by-block map). Editors cannot add, remove or reorder blocks — that is what keeps the site identical to the design.

## Singletons (fixed IDs = type names)
| Type | Studio title | Feeds |
| --- | --- | --- |
| `siteSettings` | Site settings | header strip, footer, contact rows on Enquire, partner (NEVMA) logo/link, SEO defaults, LocalBusiness data |
| `homePage` | Home | Home blocks 02–07 |
| `roomsPage` | Room pages (shared labels) | gallery/equipment titles, "Contact" button, "Other rooms" title, default closing band with `{room}` |
| `aboutPage` | About | About blocks 02–07 |
| `clientsPage` | Clients | Clients hero wall, A–Z intro, closing band |
| `sessionsPage` | Sessions | Sessions blocks 02–06 |
| `enquirePage` | Register interest | form intro, every field label and placeholder, sent state, error text, FAQ |
| `contactPage` | Contact | Contact blocks 02–04 |
| `notFoundPage` | Page not found | 404 |

## Collections
| Type | Used by | Notes |
| --- | --- | --- |
| `room` | Home room cards, room pages, Other rooms, Gear button | `order` 1 = the page "The Studio" opens; `Room 02 / 03` is computed. Fields grouped like the page: Card · Top of page · The room · Gallery · Equipment · Closing band · SEO |
| `client` | Clients A–Z | `sortName` decides the letter (placeholders in the seed use it); `partner` = black tag, listed first |
| `testimonial` | Home quotes | quote without quotation marks |
| `teamMember` | About team (through `aboutPage.teamGroups`) | photo optional → striped placeholder |
| `faq` | About, Sessions, Enquire | a question can be reused on several pages (seed: "How are rates set?" on Sessions and Enquire) |
| `legalPage` | `/legal/[slug]` | Portable Text body (normal, h2, h3, links) |
| `form` | Enquire | project-type options, default option, recipients, auto-reply subject/text (`{name}`), retention months |
| `formSubmission` | Studio → Enquiries | written only by `/api/enquiry`; status new/replied/booked/closed/spam; internal notes. Read-only for non-admins |

## Shared field types
`cta` (label + internal page **or** room **or** URL) · `displayHeading` (text; one line per row → `<br>`) · `imageWithAlt` (hotspot + alt) ·
`statItem` · `labelValue` · `numberedText` · `ctaBand` · `chapterHeading` (chapter label, title, intro) · `seo` (title, description, share image, noindex).

## Rules the site applies
- `href(cta)`: `url` → as is; `room` → `/studio/<slug>`; `page` → route table in `PAGES.md` (`studio` = room with lowest `order`).
- Arrows are added by the site, not stored: room card label + " →"; "Room 02 →"; footer socials and partner + " ↗". Labels that the design shows with an arrow inside the text (e.g. "Visit NEVMA Music ↗", "Send enquiry →", "NEVMA ↗") are stored with it.
- Quotes are wrapped as `“…”` by the site.
- Numbers `01`, `02`… (equipment groups, sessions items, steps) are computed from position.
- Images: `img(asset, width)` → Sanity CDN with `auto=format&fit=max&q=80`; `srcset` at 480/768/1200/1600/2400 where the image is wider than 400 px. Hotspot honoured with `&crop=focalpoint&fp-x=&fp-y=` only for fixed aspect-ratio slots.

## Seed (`seed/tems-seed.tar.gz`)
129 documents + 22 photos. Text is the design copy word for word, including `[bracketed]` placeholders, so the fidelity test can compare text.
Photos: the six studio photos supplied by the client, both logos, the NEVMA logo, and 13 **stand-in release covers** (`standin-cover-*`)
borrowed from the Nevma Music design — to be replaced by real client covers. The room gallery seed repeats the five interior photos to reach the design's "01 / 12".
`pnpm --filter studio check:seed` checks the seed against the schema (fields, required values, references, IDs).
