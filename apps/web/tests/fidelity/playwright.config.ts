import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

// apps/web is "type": "module", so the spec's __dirname fallback throws in the worker.
// DESIGN_DIR is the documented override (docs/FIDELITY.md). Default it before workers spawn.
if (!process.env.DESIGN_DIR) {
  process.env.DESIGN_DIR = path.resolve(fileURLToPath(new URL('../../../../design/build', import.meta.url)));
}

// Fidelity suite only. Run against a running site: SITE_URL=http://localhost:4321
export default defineConfig({
  testDir: '.',
  testMatch: /fidelity\.spec\.ts$/,
  timeout: 120_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '../../playwright-report/fidelity' }]],
  outputDir: '../../test-results/fidelity',
  use: { browserName: 'chromium', deviceScaleFactor: 1, colorScheme: 'dark' },
});
