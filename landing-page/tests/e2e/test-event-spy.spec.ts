import { test, expect } from '@playwright/test';

test('Track useMotionValueEvent triggers in browser console', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Inject a debug spy on scroll and property change
  await page.evaluate(() => {
    window.addEventListener('scroll', () => {
      console.log('DOM SCROLL EVENT:', window.pageYOffset);
    });
    const origSetProperty = document.documentElement.style.setProperty.bind(document.documentElement.style);
    document.documentElement.style.setProperty = function(name, val, priority) {
      if (name === '--navbar-offset') {
        console.log('SET PROPERTY --navbar-offset =', val);
      }
      return origSetProperty(name, val, priority);
    };
  });

  console.log('--- Step 1: Scroll to 3000 ---');
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(500);

  console.log('--- Step 2: Smooth scroll up to 2700 ---');
  await page.evaluate(() => window.scrollTo({ top: 2700, behavior: 'smooth' }));
  await page.waitForTimeout(1000);

  const finalCheck = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navRect: nav?.getBoundingClientRect(),
      switcherRect: switcher?.getBoundingClientRect(),
      cssOffset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      navTransform: nav ? getComputedStyle(nav).transform : null,
    };
  });
  console.log('FINAL CHECK:', JSON.stringify(finalCheck, null, 2));
});
