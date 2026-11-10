import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const root = path.resolve(fileURLToPath(new URL('../../../..', import.meta.url)));

export default defineConfig({
  testDir: '.',
  testMatch: /enquiry\.spec\.ts$/,
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '../../playwright-report/e2e' }]],
  outputDir: '../../test-results/e2e',
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:4321',
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm --filter web dev -- --host 127.0.0.1 --port 4321',
    cwd: root,
    url: 'http://127.0.0.1:4321/enquire',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ...process.env,
      E2E_MOCK_OUTBOUND: '1',
      PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    },
  },
});
