/**
 * TEMS design fidelity test.
 *
 * Compares every block of the built site with the same block of the exact design build
 * (design/build/*.html) at 1440 px and 390 px:
 *   1. the same blocks exist, in the same order (data-block="NN-name");
 *   2. block height within ±2% (and ±2 px for blocks under 100 px);
 *   3. the same visible text;
 *   4. pixels: at most 0.1% of pixels differ, with photos blanked on both sides;
 *   5. type and colour: the same set of text styles (font, size, weight, width, case, spacing, colour)
 *      and the same background and border colours — catches changes too small for pixels.
 *
 * The site must run with the seed content (design copy). Start it, then:
 *   SITE_URL=http://localhost:4321 pnpm --filter web test:fidelity
 * A block that is intentionally different carries data-fidelity-skip="reason" on the site.
 */
import { test, expect, type Page } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DESIGN = path.resolve(process.env.DESIGN_DIR ?? path.join(__dirname, '../../../../design/build'));
const SITE = (process.env.SITE_URL ?? 'http://localhost:4321').replace(/\/$/, '');
const blocks: Record<string, string[]> = JSON.parse(fs.readFileSync(path.join(DESIGN, 'blocks.json'), 'utf8'));

/** Design page -> site route. Keep in step with docs/PAGES.md. */
export const ROUTES: Record<string, string> = {
  home: '/',
  studio: '/studio/studio-a',
  about: '/about',
  clients: '/clients',
  sessions: '/sessions',
  enquire: '/enquire',
  'enquire-sent': '/enquire/thanks',
  contact: '/contact',
};
const VIEWPORTS = [1440, 390];
const MAX_PIXEL_RATIO = Number(process.env.FIDELITY_MAX_RATIO ?? 0.001);

// Photos are content, not design: blank them on both sides. Freeze anything that moves.
const NEUTRAL = `img, picture, video { opacity: 0 !important; }
*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }`;

async function prepare(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: NEUTRAL });
  await page.evaluate(() => document.fonts.ready);
  // scroll through once so lazy content settles, then back to the top
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
    window.scrollTo(0, 0);
  });
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Every distinct text style and paint colour inside a block, as sorted strings. */
function styleFingerprint(el: Element) {
  const text = new Set<string>(), paint = new Set<string>();
  const all = [el, ...el.querySelectorAll('*')] as HTMLElement[];
  for (const e of all) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const ownText = [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue!.trim());
    if (ownText) {
      text.add([cs.fontFamily.split(',')[0].replace(/["']/g, ''), cs.fontSize, cs.fontWeight, cs.fontStretch,
        cs.fontStyle, cs.textTransform, cs.letterSpacing, cs.lineHeight, cs.color].join(' | '));
    }
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') paint.add('bg ' + cs.backgroundColor);
    if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url(')) paint.add('bgimg ' + cs.backgroundImage);
    for (const side of ['Top', 'Right', 'Bottom', 'Left'] as const) {
      const w = (cs as any)[`border${side}Width`], st = (cs as any)[`border${side}Style`];
      if (st !== 'none' && w !== '0px') paint.add(`border ${w} ${st} ${(cs as any)[`border${side}Color`]}`);
    }
  }
  return { text: [...text].sort(), paint: [...paint].sort() };
}

for (const vw of VIEWPORTS) {
  for (const [design, route] of Object.entries(ROUTES)) {
    test.describe(`${design} @${vw}`, () => {
      test.use({ viewport: { width: vw, height: 900 } });

      test('blocks, heights, text and pixels match the design', async ({ browser }) => {
        const ctx = await browser.newContext({ viewport: { width: vw, height: 900 }, deviceScaleFactor: 1 });
        const d = await ctx.newPage();
        const s = await ctx.newPage();
        await prepare(d, pathToFileURL(path.join(DESIGN, `${design}.html`)).href);
        await prepare(s, SITE + route);

        const expected = blocks[design];
        const siteBlocks = await s.$$eval('[data-block]', els => els.map(e => e.getAttribute('data-block')));
        expect(siteBlocks, 'same blocks in the same order').toEqual(expected);

        const problems: string[] = [];
        for (const name of expected) {
          const sel = `[data-block="${name}"]`;
          const skip = await s.getAttribute(sel, 'data-fidelity-skip');
          if (skip) { test.info().annotations.push({ type: 'skipped block', description: `${name}: ${skip}` }); continue; }
          const [db, sb] = [await d.$(sel), await s.$(sel)];
          if (!db || !sb) { problems.push(`${name}: missing`); continue; }
          const [dbox, sbox] = [await db.boundingBox(), await sb.boundingBox()];
          const dh = Math.round(dbox!.height), sh = Math.round(sbox!.height);
          const tol = Math.max(2, dh * 0.02);
          if (Math.abs(dh - sh) > tol) problems.push(`${name}: height ${sh}px, design ${dh}px`);

          const [dt, st] = [norm(await db.innerText()), norm(await sb.innerText())];
          if (dt !== st) problems.push(`${name}: text differs\n    design: ${dt.slice(0, 300)}\n    site:   ${st.slice(0, 300)}`);

          const [dfp, sfp] = [await db.evaluate(styleFingerprint), await sb.evaluate(styleFingerprint)];
          for (const k of ['text', 'paint'] as const) {
            const missing = dfp[k].filter(x => !sfp[k].includes(x)), extra = sfp[k].filter(x => !dfp[k].includes(x));
            if (missing.length || extra.length)
              problems.push(`${name}: ${k === 'text' ? 'text styles' : 'colours/borders'} differ\n    design only: ${missing.join(' ; ') || '-'}\n    site only:   ${extra.join(' ; ') || '-'}`);
          }

          const [dimg, simg] =[PNG.sync.read(await db.screenshot()), PNG.sync.read(await sb.screenshot())];
          const w = Math.min(dimg.width, simg.width), h = Math.min(dimg.height, simg.height);
          const crop = (img: PNG) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, 0, 0, w, h, 0, 0); return o; };
          const [a, b] = [crop(dimg), crop(simg)];
          const diff = new PNG({ width: w, height: h });
          const n = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: Number(process.env.FIDELITY_COLOR_THRESHOLD ?? 0.02), includeAA: true });
          const ratio = n / (w * h);
          if (ratio > MAX_PIXEL_RATIO) {
            const out = test.info().outputPath(`${design}-${vw}-${name}-diff.png`);
            fs.writeFileSync(out, PNG.sync.write(diff));
            fs.writeFileSync(test.info().outputPath(`${design}-${vw}-${name}-design.png`), PNG.sync.write(a));
            fs.writeFileSync(test.info().outputPath(`${design}-${vw}-${name}-site.png`), PNG.sync.write(b));
            problems.push(`${name}: ${(ratio * 100).toFixed(2)}% pixels differ (limit ${(MAX_PIXEL_RATIO * 100).toFixed(1)}%) — see ${path.basename(out)}`);
          }
        }
        await ctx.close();
        expect(problems, problems.join('\n')).toEqual([]);
      });
    });
  }
}
