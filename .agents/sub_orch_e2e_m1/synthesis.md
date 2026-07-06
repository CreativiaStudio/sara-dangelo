# Synthesis: Playwright Setup

## Consensus
Playwright should be installed manually to avoid interactive prompt issues. The configuration should be tailored to Next.js local development.

1. **Install dependencies**:
```bash
cd next_app
npm install -D @playwright/test @types/node
npx playwright install --with-deps
```

2. **Create `next_app/playwright.config.ts`**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. **Directories**:
Create `next_app/tests/e2e`

4. **Gitignore**:
Append to `next_app/.gitignore`:
```
# Playwright
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

5. **Verification**:
Create a dummy test in `tests/e2e/example.spec.ts` to verify everything works:
```typescript
import { test, expect } from '@playwright/test';
test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Create Next App/); // Or whatever the default is
});
```
Run `npx playwright test`. If it passes, delete the dummy test file.
