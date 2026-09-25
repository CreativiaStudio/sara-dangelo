import { test, expect } from '@playwright/test';

test('Framer Motion scrollY getPrevious inspection', async ({ page }) => {
  page.on('console', msg => console.log('LOG:', msg.text()));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    let lastY = window.pageYOffset;
    window.addEventListener('scroll', () => {
      const curY = window.pageYOffset;
      const prev = lastY;
      lastY = curY;
      const nav = document.querySelector('nav');
      const offset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset');
      console.log(`SCROLL EVT: cur=${curY}, prev=${prev}, diff=${curY - prev}, offset=${offset}, navTransform=${nav ? getComputedStyle(nav).transform : 'none'}`);
    });
  });

  console.log('=== Step 1: Scroll to 3000 ===');
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);

  console.log('=== Step 2: User scrolls up 100px with wheel ===');
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(500);

  console.log('=== Step 3: User scrolls up another 100px with wheel ===');
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(1000);

  const state = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navRect: nav?.getBoundingClientRect(),
      switcherRect: switcher?.getBoundingClientRect(),
      offset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      navTransform: nav ? getComputedStyle(nav).transform : null,
    };
  });
  console.log('FINAL STATE AFTER WHEEL UP:', JSON.stringify(state, null, 2));
});
