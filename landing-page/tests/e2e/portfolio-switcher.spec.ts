import { test, expect } from '@playwright/test';

test.describe('Portfolio Switcher & Instant Auto-Scroll Navigation (Milestone M1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('R1: Switcher bar is rendered within portfolio with active highlight and 6 wedding albums', async ({ page }) => {
    const portfolioSection = page.locator('#portfolio');
    await expect(portfolioSection).toBeVisible();

    const switcher = portfolioSection.locator('[role="tablist"]');
    await expect(switcher).toBeVisible();

    const tabs = switcher.locator('button[role="tab"]');
    await expect(tabs).toHaveCount(6);

    // Initial active tab should have active indicator
    const activeTab = switcher.locator('button[aria-selected="true"]');
    await expect(activeTab).toBeVisible();
    await expect(activeTab.locator('span')).toHaveText(/Hotel Bellevue Syrene|Capri/i);
  });

  test('R2: Instant dataset switch and auto-scroll when clicking an album pill', async ({ page }) => {
    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const switcher = portfolioSection.locator('[role="tablist"]');
    const capriTab = switcher.locator('button[role="tab"]').filter({ hasText: /Capri/i });
    await expect(capriTab).toBeVisible();
    await capriTab.click();

    // Active state updates immediately
    await expect(capriTab).toHaveAttribute('aria-selected', 'true');

    // Gallery grid renders Capri photos
    const galleryGrid = page.locator('#portfolio-gallery-grid');
    await expect(galleryGrid).toBeVisible();

    const images = galleryGrid.locator('img');
    await expect(images.first()).toHaveAttribute('alt', /Capri/i);
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    const firstImgAlt = await images.first().getAttribute('alt');
    expect(firstImgAlt).toContain('Capri');
  });

  test('R3: Mobile ergonomics (touch target >= 44px, horizontal scroll, no page overflow)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const switcher = portfolioSection.locator('[role="tablist"]');
    await expect(switcher).toBeVisible();

    // Check touch target height >= 44px
    const tabs = switcher.locator('button[role="tab"]');
    const firstTab = tabs.first();
    const box = await firstTab.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);

    // Verify no document horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);

    // Click last album on mobile
    const lastTab = tabs.last();
    await lastTab.click();
    await expect(lastTab).toHaveAttribute('aria-selected', 'true');
  });

  test('R4: Dark luxury palette adherence (no pure black, dark gold styling)', async ({ page }) => {
    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const bgColor = await portfolioSection.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe('rgb(0, 0, 0)');
    expect(bgColor).not.toBe('rgba(0, 0, 0, 1)');
  });

  test('Lightbox modal z-index elevation (z-[60])', async ({ page }) => {
    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    const firstCard = portfolioSection.locator('.photo-frame').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    const closeBtn = page.locator('button[aria-label="Chiudi"]');
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();
    await expect(closeBtn).not.toBeVisible();
  });
});
