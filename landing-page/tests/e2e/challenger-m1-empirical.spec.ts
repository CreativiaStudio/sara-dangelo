import { test, expect } from '@playwright/test';
import manifest from '../../public/media/albums/manifest.json';

const albumEntries = Object.entries(manifest).map(([key, data]: [string, any]) => ({
  key,
  title: data.title,
  subtitle: data.subtitle,
  imageCount: data.images.length,
}));

const TABLET_VIEWPORTS = [
  { width: 768, height: 1024, name: 'iPad Mini / iPad Portrait (768px)' },
  { width: 820, height: 1180, name: 'iPad Air Portrait (820px)' },
  { width: 912, height: 1368, name: 'Surface Pro (912px)' },
  { width: 1024, height: 1366, name: 'iPad Pro Portrait (1024px)' },
  { width: 1140, height: 900, name: 'Compact Laptop (1140px)' },
  { width: 1280, height: 800, name: 'Standard Desktop (1280px)' },
  { width: 375, height: 667, name: 'iPhone SE (375px)' },
  { width: 390, height: 844, name: 'iPhone 14 (390px)' },
];

test.describe('Challenger Empirical Verification Suite — Tablet Viewports & Rapid Switching', () => {

  for (const vp of TABLET_VIEWPORTS) {
    test(`Tablet/Viewport Check: ${vp.name} - Tab 0 in positive X and fully clickable`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const portfolioSection = page.locator('#portfolio');
      await expect(portfolioSection).toBeVisible();
      await portfolioSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const tablist = portfolioSection.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();

      const tabs = tablist.locator('button[role="tab"]');
      const tabCount = await tabs.count();
      expect(tabCount).toBe(6);

      // Verify Tab 0 bounding box
      const tab0 = tabs.first();
      const box0 = await tab0.boundingBox();
      expect(box0).not.toBeNull();
      
      console.log(`[Viewport: ${vp.name}] Tab 0 X: ${box0!.x.toFixed(1)}px, Width: ${box0!.width.toFixed(1)}px, Right: ${(box0!.x + box0!.width).toFixed(1)}px`);

      // Tab 0 must NOT be in negative X space (empirically verify positive coordinates)
      expect(box0!.x).toBeGreaterThanOrEqual(0);

      // Tab 0 must be clickable
      await tab0.click();
      await expect(tab0).toHaveAttribute('aria-selected', 'true');

      // Click last tab (Tab 5) - verify horizontal scrolling & clickability
      const tab5 = tabs.last();
      await tab5.scrollIntoViewIfNeeded();
      const box5 = await tab5.boundingBox();
      expect(box5).not.toBeNull();
      await tab5.click();
      await expect(tab5).toHaveAttribute('aria-selected', 'true');

      // Click back to Tab 0
      await tab0.scrollIntoViewIfNeeded();
      await tab0.click();
      await expect(tab0).toHaveAttribute('aria-selected', 'true');
    });
  }

  test('Sequential Clickability & Dataset Synchronization Across All 6 Tabs on 768px iPad', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const tabs = portfolioSection.locator('[role="tablist"] button[role="tab"]');

    for (let i = 0; i < albumEntries.length; i++) {
      const tab = tabs.nth(i);
      await tab.scrollIntoViewIfNeeded();
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');

      const expectedAlbum = albumEntries[i];

      // Gallery grid should update to the selected album with web-first assertion (waiting for crossfade)
      const gallery = page.locator('#portfolio-gallery-grid');
      await expect(gallery).toBeVisible();

      const firstImg = gallery.locator('img').first();
      await expect(firstImg).toHaveAttribute('alt', new RegExp(expectedAlbum.title, 'i'), { timeout: 4000 });
    }
  });

  test('Stress Test: High-Frequency Rapid Tab Switching Burst (Fuzzing / Anti-Race Condition)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const tabs = portfolioSection.locator('[role="tablist"] button[role="tab"]');
    
    // Rapid sequential clicks across distinct tabs
    const clickSequence = [0, 2, 4, 1, 5, 3];
    for (const idx of clickSequence) {
      const tab = tabs.nth(idx);
      await tab.click();
      await page.waitForTimeout(80);
    }

    // Final target is index 3 (Salone Margherita / 4th album)
    const finalIndex = 3;
    const finalAlbum = albumEntries[finalIndex];

    // Active state must strictly match final index
    const activeTab = portfolioSection.locator('[role="tablist"] button[aria-selected="true"]');
    await expect(activeTab).toHaveCount(1);
    await expect(activeTab).toHaveText(new RegExp(finalAlbum.title, 'i'), { timeout: 3000 });

    // Photos must match final album
    const galleryImages = page.locator('#portfolio-gallery-grid img');
    await expect(galleryImages.first()).toHaveAttribute('alt', new RegExp(finalAlbum.title, 'i'), { timeout: 4000 });
    expect(await galleryImages.count()).toBe(finalAlbum.imageCount);
  });

  test('Navbar Reveal on Scroll-Up De-Confliction and Tab Hit-Testing', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const tabs = portfolioSection.locator('[role="tablist"] button[role="tab"]');
    // Click tab 1 to scroll into the photo grid
    await tabs.nth(1).click();
    await page.waitForTimeout(800);

    // Now simulate user scrolling up 50px to reveal Navbar
    await page.evaluate(() => window.scrollBy({ top: -50, behavior: 'smooth' }));
    await page.waitForTimeout(600);

    const hitReport = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
      const navRect = nav?.getBoundingClientRect();
      const switcherRect = switcher?.getBoundingClientRect();

      // Check hit test on all 6 tabs
      const tabButtons = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
      const results = tabButtons.map((tab, idx) => {
        const rect = tab.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        const el = document.elementFromPoint(centerX, centerY);
        return {
          idx,
          tabText: tab.textContent?.trim(),
          isCovered: el !== tab && !tab.contains(el),
          elementFound: el?.tagName,
        };
      });

      return {
        navRect: navRect ? { y: navRect.y, height: navRect.height, bottom: navRect.bottom } : null,
        switcherRect: switcherRect ? { y: switcherRect.y, height: switcherRect.height, bottom: switcherRect.bottom } : null,
        tabs: results,
      };
    });

    console.log('HIT TEST REPORT:', JSON.stringify(hitReport, null, 2));

    // Verify 0 tabs are occluded by navbar or other overlays
    for (const tabResult of hitReport.tabs) {
      if (tabResult.isCovered) {
        console.warn(`Tab ${tabResult.idx} (${tabResult.tabText}) covered by ${tabResult.elementFound}`);
      }
      expect(tabResult.isCovered).toBe(false);
    }
  });
});
