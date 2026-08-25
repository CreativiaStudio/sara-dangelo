import { test, expect } from '@playwright/test';

test('Verify Navbar and Sticky Switcher Geometric Overlap after auto-scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const portfolioSection = page.locator('#portfolio');
  await portfolioSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const switcher = portfolioSection.locator('[role="tablist"]');
  const tabs = switcher.locator('button[role="tab"]');
  
  // Click tab 1 to trigger auto-scroll
  await tabs.nth(1).click();
  await page.waitForTimeout(1000); // Wait for scroll animation and navbar motion to settle

  const overlapReport = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
    const firstPhoto = document.querySelector('#portfolio-gallery-grid .photo-frame');

    const navRect = nav ? nav.getBoundingClientRect() : null;
    const switcherRect = switcher ? switcher.getBoundingClientRect() : null;
    const photoRect = firstPhoto ? firstPhoto.getBoundingClientRect() : null;

    // Check hit test on the tabs
    const tabButtons = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
    const hitResults = tabButtons.map((btn, idx) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      const topX = rect.x + rect.width / 2;
      const topY = rect.y + 5;
      
      const elAtCenter = document.elementFromPoint(centerX, centerY);
      const elAtTop = document.elementFromPoint(topX, topY);

      return {
        tabIndex: idx,
        tabText: btn.textContent?.trim(),
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        centerHit: elAtCenter ? elAtCenter.tagName + (elAtCenter.className ? '.' + elAtCenter.className.split(' ')[0] : '') : 'none',
        isCenterCovered: elAtCenter !== btn && !btn.contains(elAtCenter),
        topHit: elAtTop ? elAtTop.tagName + (elAtTop.className ? '.' + elAtTop.className.split(' ')[0] : '') : 'none',
        isTopCovered: elAtTop !== btn && !btn.contains(elAtTop),
      };
    });

    return {
      scrollY: window.pageYOffset,
      nav: navRect ? { y: navRect.y, height: navRect.height, bottom: navRect.bottom } : null,
      switcher: switcherRect ? { y: switcherRect.y, height: switcherRect.height, bottom: switcherRect.bottom } : null,
      photo: photoRect ? { y: photoRect.y, height: photoRect.height, bottom: photoRect.bottom } : null,
      photoClearanceUnderSwitcher: photoRect && switcherRect ? photoRect.y - switcherRect.bottom : null,
      photoClearanceUnderNav: photoRect && navRect ? photoRect.y - navRect.bottom : null,
      hitResults,
    };
  });

  console.log('OVERLAP REPORT:', JSON.stringify(overlapReport, null, 2));
});
