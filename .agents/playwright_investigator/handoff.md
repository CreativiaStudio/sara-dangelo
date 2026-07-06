# Playwright Setup Handoff Report

## Observation
- The Next.js app is located in `c:/Users/mario/Progetti Antigravity/sara-dangelo/next_app/`.
- The `TEST_INFRA.md` specifies that the E2E test runner is `npx playwright test` with test spec files located in `tests/e2e/`.
- The local app's `package.json` (`next_app/package.json`) exposes the standard Next.js scripts (`dev`, `build`, `start`).
- Based on `PROJECT.md`, the site relies on the Next.js App Router. 

## Logic Chain
- To use Playwright for E2E testing, we need to install the `@playwright/test` package as a devDependency.
- For Playwright to function, it needs browser binaries. Running `npx playwright install --with-deps` fetches these automatically.
- A `playwright.config.ts` must be created in the `next_app/` root. It must set `testDir: './tests/e2e'` to satisfy `TEST_INFRA.md` requirements.
- The configuration should also include a `webServer` block pointing to `npm run dev` to boot up the Next.js server on `http://127.0.0.1:3000` automatically before test runs. 

## Caveats
- Using `npm run dev` for the `webServer` command is great for iteration during development. For strict CI testing, you may prefer a command like `npm run build && npm run start` to test the production build directly.
- The configured browsers in the config are Chromium, Firefox, and WebKit (standard Playwright setup).

## Conclusion
Playwright is ready to be initialized with these commands and configurations.

**Installation Commands (run from inside `next_app/`):**
```bash
npm install -D @playwright/test @types/node
npx playwright install --with-deps
```

**Proposed `playwright.config.ts` (to be created at `next_app/playwright.config.ts`):**
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
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Verification Method
1. Ensure the implementer runs the `npm install` and `npx playwright install` commands successfully within the `next_app` directory.
2. Verify that creating a dummy test file in `next_app/tests/e2e/example.spec.ts` and running `npx playwright test` successfully boots the Next.js app and runs the test.
