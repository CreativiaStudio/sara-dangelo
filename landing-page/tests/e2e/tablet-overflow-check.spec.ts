import { test, expect } from '@playwright/test';

test('Verify tablet viewport (768px) flexbox center overflow behavior', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const portfolioSection = page.locator('#portfolio');
  await portfolioSection.scrollIntoViewIfNeeded();

  const tabMetrics = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
    return tabs.map((tab, idx) => {
      const rect = tab.getBoundingClientRect();
      return {
        idx,
        text: tab.textContent?.trim(),
        x: rect.x,
        right: rect.right,
        width: rect.width,
        isFullyVisible: rect.x >= 0 && rect.right <= window.innerWidth,
        isOffscreenLeft: rect.x < 0,
        isOffscreenRight: rect.right > window.innerWidth
      };
    });
  });

  console.log('TABLET TAB METRICS (768px):', JSON.stringify(tabMetrics, null, 2));
});
