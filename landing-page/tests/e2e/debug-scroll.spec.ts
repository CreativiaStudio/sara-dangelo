import { test, expect } from '@playwright/test';

test('Deep Debug: Inspect scroll-up event and style synchronization', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // 1. Scroll into portfolio
  await page.evaluate(() => {
    const portfolio = document.querySelector('#portfolio');
    if (portfolio) {
      const top = portfolio.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: top + 600, behavior: 'instant' });
    }
  });
  await page.waitForTimeout(500);

  const state1 = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navRect: nav?.getBoundingClientRect(),
      switcherRect: switcher?.getBoundingClientRect(),
      cssOffset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      navClass: nav?.className,
      navTransform: nav ? getComputedStyle(nav).transform : null,
    };
  });
  console.log('STATE 1 (after scroll down):', JSON.stringify(state1, null, 2));

  // 2. Dispatch a wheel/scroll event scrolling UP
  // Using mouse wheel or page.mouse.wheel
  await page.mouse.wheel(0, -300);
  await page.waitForTimeout(600);

  const state2 = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navRect: nav?.getBoundingClientRect(),
      switcherRect: switcher?.getBoundingClientRect(),
      cssOffset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      navTransform: nav ? getComputedStyle(nav).transform : null,
      tab0Rect: document.querySelector('#portfolio [role="tab"]')?.getBoundingClientRect(),
      elementOverTab0: document.elementFromPoint(
        (document.querySelector('#portfolio [role="tab"]')?.getBoundingClientRect().x || 0) + 50,
        (document.querySelector('#portfolio [role="tab"]')?.getBoundingClientRect().y || 0) + 20
      )?.tagName,
    };
  });
  console.log('STATE 2 (after mouse wheel up):', JSON.stringify(state2, null, 2));
});
