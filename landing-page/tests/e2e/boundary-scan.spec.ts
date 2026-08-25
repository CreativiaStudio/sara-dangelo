import { test, expect } from '@playwright/test';

const testCases = [
  { width: 768, name: 'iPad Portrait 768px' },
  { width: 820, name: 'iPad Air 820px' },
  { width: 1024, name: 'iPad Pro 1024px' },
  { width: 1140, name: 'Small Laptop 1140px' },
  { width: 1280, name: 'Desktop 1280px' },
];

test.describe('Boundary Scan: First Tab Accessibility', () => {
  for (const tc of testCases) {
    test(`Check Tab 0 placement on ${tc.name}`, async ({ page }) => {
      await page.setViewportSize({ width: tc.width, height: 900 });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const portfolioSection = page.locator('#portfolio');
      await portfolioSection.scrollIntoViewIfNeeded();

      const firstTab = portfolioSection.locator('[role="tab"]').first();
      const box = await firstTab.boundingBox();

      console.log(`[Result] ${tc.name} (${tc.width}px): Tab 0 X = ${box ? box.x.toFixed(1) : 'null'}px | Clipped: ${box ? box.x < 0 : 'unknown'}`);
      
      expect(box).not.toBeNull();
      // Tab 0 must not have negative X (must not be clipped offscreen left)
      expect(box!.x).toBeGreaterThanOrEqual(0);
    });
  }
});
