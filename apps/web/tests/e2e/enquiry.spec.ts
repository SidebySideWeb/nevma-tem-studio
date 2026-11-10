import { expect, test, type Page } from '@playwright/test';

const TURNSTILE_PASS = 'XXXX.DUMMY.TOKEN.XXXX';

async function resetLimiter(request: Page['request']) {
  await request.post('/api/enquiry', {
    headers: {
      'content-type': 'application/json',
      'x-e2e-reset-ratelimit': '1',
    },
    data: {},
  });
}

async function stubTurnstile(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: (_el: unknown, opts: { callback?: (t: string) => void }) => {
        (window as unknown as { __tsCb?: (t: string) => void }).__tsCb = opts.callback;
        return 'w1';
      },
      execute: () => {
        (window as unknown as { __tsCb?: (t: string) => void }).__tsCb?.('XXXX.DUMMY.TOKEN.XXXX');
      },
    };
  });
}

test.describe('enquiry', () => {
  test.beforeEach(async ({ page }) => {
    await resetLimiter(page.request);
  });

  test('success with JS: swaps to sent state and replaceState thanks', async ({ page }) => {
    await stubTurnstile(page);
    await page.goto('/enquire');
    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test.user@example.com');
    await page.locator('input[name="artist"]').fill('Test Act');
    await page.locator('input[name="consent"]').check();

    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/enquiry') && r.request().method() === 'POST'),
      page.locator('button[type="submit"]').click(),
    ]);
    const body = await res.json();
    expect(body.ok).toBeTruthy();
    expect(body.e2e?.submission?.email).toBe('test.user@example.com');

    await expect(page.locator('[data-enquire-sent]')).toBeVisible();
    await expect(page.locator('form[data-enquire-form]')).toHaveCount(0);
    await expect(page).toHaveURL(/\/enquire\/thanks$/);
    await expect(page.locator('[data-enquire-thanks-title]')).toBeFocused();
  });

  test('success without JS redirects to thanks', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/enquire');
    await page.locator('input[name="name"]').fill('No JS User');
    await page.locator('input[name="email"]').fill('nojs@example.com');
    await page.locator('input[name="consent"]').check();
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/enquire/thanks');
    await expect(page.locator('[data-enquire-thanks-title]')).toContainText('Got it');
    await context.close();
  });

  test('validation error shows status line', async ({ page }) => {
    await stubTurnstile(page);
    await page.goto('/enquire');
    await page.locator('input[name="name"]').fill('A');
    await page.locator('input[name="email"]').fill('bad');
    await page.locator('input[name="consent"]').check();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[data-enquire-error]')).not.toBeEmpty();
    await expect(page.locator('form[data-enquire-form]')).toBeVisible();
  });

  test('honeypot pretends success and stores nothing', async ({ page }) => {
    await resetLimiter(page.request);
    const res = await page.request.post('/api/enquiry', {
      headers: { 'content-type': 'application/json' },
      data: {
        name: 'Bot',
        email: 'bot@example.com',
        projectTypes: ['Recording'],
        consent: true,
        company: 'Acme Corp',
        'cf-turnstile-response': TURNSTILE_PASS,
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBeTruthy();
    expect(body.e2e).toBeFalsy();
  });

  test('rate limit trips after 5 requests', async ({ page }) => {
    await resetLimiter(page.request);
    const payload = {
      name: 'Rate Limit',
      email: 'rate@example.com',
      projectTypes: ['Recording'],
      consent: true,
      company: 'x',
      'cf-turnstile-response': TURNSTILE_PASS,
    };
    for (let i = 0; i < 5; i++) {
      const r = await page.request.post('/api/enquiry', {
        headers: { 'content-type': 'application/json' },
        data: payload,
      });
      expect(r.status(), `request ${i + 1}`).toBe(200);
    }
    const blocked = await page.request.post('/api/enquiry', {
      headers: { 'content-type': 'application/json' },
      data: payload,
    });
    expect(blocked.status()).toBe(429);
  });

  test('?room=studio-a is stored on the submission', async ({ page }) => {
    await stubTurnstile(page);
    await resetLimiter(page.request);
    await page.goto('/enquire?room=studio-a');
    await expect(page.locator('input[name="room"]')).toHaveValue('studio-a');
    await page.locator('input[name="name"]').fill('Room Guest');
    await page.locator('input[name="email"]').fill('room@example.com');
    await page.locator('input[name="consent"]').check();
    const [res] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/enquiry') && r.request().method() === 'POST'),
      page.locator('button[type="submit"]').click(),
    ]);
    const body = await res.json();
    expect(body.ok).toBeTruthy();
    expect(body.e2e?.submission?.room).toBe('studio-a');
  });
});
