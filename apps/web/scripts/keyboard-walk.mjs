#!/usr/bin/env node
/** Keyboard-only smoke: Tab reaches primary interactive controls on each page. */
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://127.0.0.1:4326';
const pages = [
  '/',
  '/studio/studio-a',
  '/studio/live-room',
  '/studio/lounge',
  '/about',
  '/clients',
  '/sessions',
  '/contact',
  '/enquire',
  '/legal/privacy',
  '/legal/cookies',
  '/legal/terms',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const results = [];

for (const path of pages) {
  const url = base + path;
  await page.goto(url, { waitUntil: 'networkidle' });
  const focusable = await page.evaluate(() => {
    const sel =
      'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return [...document.querySelectorAll(sel)].filter((el) => {
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length;
    }).length;
  });
  // Tab a handful of times; collect focused tags/roles/names
  const trail = [];
  for (let i = 0; i < Math.min(12, Math.max(focusable, 4)); i += 1) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const name =
        el.getAttribute('aria-label') ||
        el.getAttribute('alt') ||
        (el.textContent || '').trim().slice(0, 40) ||
        el.getAttribute('name') ||
        el.getAttribute('placeholder') ||
        '';
      return { tag: el.tagName.toLowerCase(), name };
    });
    if (info) trail.push(`${info.tag}:${info.name.replace(/\s+/g, ' ')}`);
  }
  const ok = trail.length > 0 && focusable > 0;
  results.push({ path, focusable, ok, sample: trail.slice(0, 6).join(' → ') });
  console.log(ok ? 'OK' : 'FAIL', path, `focusable=${focusable}`, trail.slice(0, 4).join(' → '));
}

// Enquire form labels / aria for SR spot-check
await page.goto(base + '/enquire', { waitUntil: 'networkidle' });
const formA11y = await page.evaluate(() => {
  const form = document.querySelector('form');
  if (!form) return { ok: false, reason: 'no form' };
  const controls = [...form.querySelectorAll('input, textarea, button, select')].filter(
    (el) => el.type !== 'hidden' && !el.classList.contains('sr-only'),
  );
  const issues = [];
  for (const el of controls) {
    if (el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'BUTTON') continue;
    const id = el.id;
    const label =
      (id && form.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
      el.closest('label');
    const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (!label && !aria) issues.push(el.name || el.tagName);
  }
  const faq = [...document.querySelectorAll('[aria-expanded]')].map((b) => ({
    expanded: b.getAttribute('aria-expanded'),
    text: (b.textContent || '').trim().slice(0, 50),
  }));
  const live = !!document.querySelector('[aria-live]');
  return {
    ok: issues.length === 0,
    labeled: controls.length - issues.length,
    issues,
    faqFirstOpen: faq[0]?.expanded === 'true',
    ariaLive: live,
    honeypotHidden: !!form.querySelector('input[name="company"]'),
  };
});
console.log('FORM_SR', JSON.stringify(formA11y));

await browser.close();
const fails = results.filter((r) => !r.ok).length + (formA11y.ok ? 0 : 1);
process.exit(fails ? 1 : 0);
