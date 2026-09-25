import { test, expect } from '@playwright/test';

test('Targeted investigation of why navbarOffset is 0px when nav is visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  
  // Expose binding to log from browser
  await page.exposeFunction('traceEvent', (tag: string, data: any) => {
    console.log(`[TRACE ${tag}]:`, data);
  });

  await page.addInitScript(() => {
    // Intercept style setProperty
    const origSet = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function(prop, val, priority) {
      if (prop === '--navbar-offset') {
        (window as any).traceEvent?.('setProperty', { val, stack: new Error().stack });
      }
      return origSet.call(this, prop, val, priority);
    };
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  console.log('--- Action 1: Scroll to 3000 ---');
  await page.evaluate(() => window.scrollTo({ top: 3000, behavior: 'instant' }));
  await page.waitForTimeout(500);

  console.log('--- Action 2: Scroll up by 250px ---');
  await page.evaluate(() => window.scrollBy({ top: -250, behavior: 'instant' }));
  await page.waitForTimeout(500);

  const state = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navRect: nav?.getBoundingClientRect(),
      switcherRect: switcher?.getBoundingClientRect(),
      offset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
    };
  });
  console.log('FINAL STATE:', state);
});
