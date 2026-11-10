# Design system

Concept "Two takes": the logo exists in black and white, so the site alternates hard black and paper bands. Heavy condensed type
echoes the TEMS mark; mono labels read like tape-box notes; one signal-orange accent is the REC light. Structure follows blackbirdstudio.com.

**The implementation is `design/build/tems.css`, unchanged.** This page explains it; it does not replace it.

## Tokens (for additions.css and the undesigned pages only)
| Name | Value | Use |
| --- | --- | --- |
| Ink | `#0A0A0A` | black bands, text on paper |
| Paper | `#F2F0EB` | light bands, text on ink |
| REC orange | `#FF4F00` | buttons with **black text**, closing bands, dots, active nav underline, focus ring. Never orange text on paper (fails contrast) |
| Grey on paper | `#5E5E5E` | mono labels on paper |
| Grey on ink | `#9A9A9A` | mono labels on ink |
| Soft paper text | `#D9D6CE` | body text on ink |
| Rule on paper | `#BDB9B0` | thin dividers on paper |
| Rules on ink | `rgba(242,240,235,.25)` / `.2` / `.18` / `.12` | dividers on ink |
| Placeholder stripes | `.ph` (ink) / `.phl` (paper) | empty photo slots |

## Type
- Display `.d`: Archivo 900, width 72%, uppercase, line-height 0.86. Sizes used: 200, 180, 150, 140, 120, 88, 80, 72, 64, 56, 48, 44, 40 (404), 30, 28, 26. Phone overrides: `.hx` → 64px, `.hy` → 44px (40px on Sessions).
- Mono `.m`: JetBrains Mono 12px, uppercase, tracking 0.08em (11px in header strip and footer labels; 10px for the "Partner" tag).
- Body: Archivo 400; 16–20px, line-height 1.45–1.65. Lead: 26–34px, 700.
- Nav: Archivo 800, width 72%, 17px, uppercase, tracking 0.02em.
- Fonts are self-hosted (`assets/fonts.css`): Archivo variable (weight 100–900, width 62–125%), JetBrains Mono 400/500.

## Layout
- Content width 1280px (`max-width`), side padding 40px (16px on phones via `.wrap`).
- Bands: padding 120px top/bottom (96–112 on some), heroes 440–820px tall with the photo `object-fit: cover` and a bottom ink gradient.
- Breakpoints: 760px (phones: `.stack` stacks, `.g2/.g3/.g4` become one column, `.cov` becomes 3 columns, `.hx`/`.hy` shrink), 1000px (Clients A–Z: 5 → 3 columns; phones 2).

## Class notes for builders
- `t-xxxxxx` classes are the designer's inline styles, one class per distinct style, tripled in the CSS so they keep inline precedence. Do not reuse a `t-` class elsewhere for convenience — copy the element that has it.
- Header links: inactive `t-baae53`, active `t-8b9489` (only the underline colour differs).
- Page-scoped rules: `.pg-<page>` prefixes the rules that differ between pages (e.g. `.hy` is 40px on Sessions phones, 44px elsewhere). The body class must match the design page (room pages `pg-studio`, `/enquire/thanks` `pg-enquire`).
- Buttons: orange (`#FF4F00` bg, ink text), ink (ink bg, paper text), paper (paper bg, ink text), outline (1px border, 17px vertical padding so heights match the 18px filled buttons).
- Hover (design/canvas): only plain links turn orange (`a:hover`); designed buttons don't change. Focus: 2px orange outline, offset 2px.
- Hover (site `additions.css`, optional): nav underline, CTA brightness/press, card fade — resting paint unchanged for fidelity.
