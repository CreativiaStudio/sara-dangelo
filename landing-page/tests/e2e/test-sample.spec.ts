import { test, expect } from '@playwright/test';

test('Interval sample of --navbar-offset after scrollBy', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Scroll down to 3500
  await page.evaluate(() => window.scrollTo({ top: 3500, behavior: 'instant' }));
  await page.waitForTimeout(600);

  const initial = await page.evaluate(() => {
    return {
      scrollY: window.pageYOffset,
      offset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      navY: document.querySelector('nav')?.getBoundingClientRect().y,
    };
  });
  console.log('INITIAL AT 3500:', initial);

  // Scroll up by 250px
  await page.evaluate(() => window.scrollBy({ top: -250, behavior: 'instant' }));

  // Sample every 50ms for 1000ms
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(50);
    const sample = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
      return {
        t: window.pageYOffset,
        offset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
        navY: nav?.getBoundingClientRect().y,
        switcherY: switcher?.getBoundingClientRect().y,
      };
    });
    console.log(`SAMPLE ${i * 50}ms:`, sample);
  }
});
