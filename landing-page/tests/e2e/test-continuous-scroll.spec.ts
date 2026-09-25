import { test, expect } from '@playwright/test';

test('Simulate continuous upward scroll and verify Navbar reveal and Switcher pin', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // 1. Scroll down deep into #portfolio
  await page.evaluate(() => window.scrollTo({ top: 3500, behavior: 'instant' }));
  // Wait 1.5s for all animations to completely settle
  await page.waitForTimeout(1500);

  const settledDown = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    return {
      scrollY: window.pageYOffset,
      navY: nav?.getBoundingClientRect().y,
      offset: getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset'),
      switcherY: switcher?.getBoundingClientRect().y,
    };
  });
  console.log('SETTLED AT BOTTOM (NAV HIDDEN):', settledDown);

  // 2. Perform continuous scroll up (e.g. 5 wheel events or continuous smooth scroll)
  for (let i = 0; i < 5; i++) {
    await page.mouse.wheel(0, -80);
    await page.waitForTimeout(100);
  }
  // Wait for reveal animation to complete (duration: 0.5s in Navbar.tsx)
  await page.waitForTimeout(800);

  const revealedState = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const switcherRect = switcher ? switcher.getBoundingClientRect() : null;
    const offset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset');

    const tabs = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
    const hitResults = tabs.map((btn, idx) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.x + rect.width / 2;
      const cy = rect.y + rect.height / 2;
      const elAtCenter = document.elementFromPoint(cx, cy);

      return {
        idx,
        text: btn.textContent?.trim(),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        centerHit: elAtCenter ? elAtCenter.tagName + (elAtCenter.className ? '.' + elAtCenter.className.split(' ')[0] : '') : 'none',
        isCovered: elAtCenter !== btn && !btn.contains(elAtCenter),
      };
    });

    return {
      scrollY: window.pageYOffset,
      navRect,
      switcherRect,
      offset,
      overlapPx: navRect && switcherRect ? Math.max(0, navRect.bottom - switcherRect.top) : null,
      hitResults,
    };
  });

  console.log('REVEALED STATE (NAV VISIBLE):', JSON.stringify(revealedState, null, 2));

  // Assertions when Nav is revealed:
  expect(revealedState.navRect).not.toBeNull();
  expect(revealedState.switcherRect).not.toBeNull();
  expect(revealedState.navRect!.y).toBeGreaterThanOrEqual(-5); // Nav is at top: 0
  expect(revealedState.offset).toMatch(/^(80|97(\.\d+)?)px$/); // Offset matches nav height
  expect(revealedState.overlapPx).toBeLessThanOrEqual(1); // 0px overlap

  // All tabs clickable
  for (const tab of revealedState.hitResults) {
    expect(tab.isCovered).toBe(false);
  }
});
