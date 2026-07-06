import { test, expect } from '@playwright/test';

test.describe('Tier 3: Pairwise Cross-Feature Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('Test Case 1: Layout + Scrollytelling (F1 & F2)', async ({ page }) => {
    // Verify scrollytelling animations trigger accurately on desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Scroll down to trigger animations
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000); // Wait for framer motion

    // Verify no horizontal overflow on desktop
    let hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);

    // Verify on mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(1000);

    hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('Test Case 2: Layout + Media (F1 & F3)', async ({ page }) => {
    // Ensure media elements are responsive and maintain aspect ratios across viewports
    await page.setViewportSize({ width: 1280, height: 720 });
    const mediaElement = page.locator('video').first();
    await expect(mediaElement).toBeVisible();
    
    const desktopBox = await mediaElement.boundingBox();
    expect(desktopBox).not.toBeNull();

    // Verify mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for resize

    const mobileBox = await mediaElement.boundingBox();
    expect(mobileBox).not.toBeNull();
    
    // Check width is constrained by viewport and scaled down
    expect(mobileBox!.width).toBeLessThanOrEqual(375);
    if (desktopBox!.width > 375) {
      expect(mobileBox!.width).toBeLessThan(desktopBox!.width);
    }
  });

  test('Test Case 3: Layout + Lead Gen (F1 & F4)', async ({ page }) => {
    // Validate Lead Gen form/CTA styling and positioning across layouts
    // Desktop check
    await page.setViewportSize({ width: 1280, height: 720 });
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const ctaButton = page.getByRole('button', { name: /Scarica ora/i });
    await expect(ctaButton).toBeVisible();

    // Check styling (e.g. not pure black)
    const bgColor = await ctaButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toBe('rgb(0, 0, 0)');

    // Mobile check
    await page.setViewportSize({ width: 375, height: 667 });
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await expect(ctaButton).toBeVisible();
    const mobileBgColor = await ctaButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(mobileBgColor).not.toBe('rgb(0, 0, 0)');
  });

  test('Test Case 4: Scrollytelling + Media (F2 & F3)', async ({ page }) => {
    // Verify media elements lazy-load or animate into view smoothly based on scrollytelling
    const portfolioSection = page.locator('section#portfolio').or(page.getByRole('region', { name: /portfolio/i })).first();
    
    // Scroll to the section
    await portfolioSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for animation to finish
    
    const firstImage = portfolioSection.locator('img').first();
    await expect(firstImage).toBeVisible();

    // Verify no layout shifts causing horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('Test Case 5: Scrollytelling + Lead Gen (F2 & F4)', async ({ page }) => {
    // Test that Lead Gen form/CTA animates into view smoothly upon scrolling and is interactive
    const contactSection = page.locator('#contact');
    
    // Scroll down to the contact section to trigger scroll animations
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for entrance animation

    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toBeEnabled();

    const submitBtn = page.getByRole('button', { name: /Scarica ora/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('Test Case 6: Media + Lead Gen (F3 & F4)', async ({ page }) => {
    // Interact with the Lead Generation form while background/adjacent media is present
    const heroVideo = page.locator('video').first();
    await expect(heroVideo).toBeVisible();
    
    // Ensure video is playing (media present)
    const isPausedBefore = await heroVideo.evaluate((vid: HTMLVideoElement) => vid.paused);
    expect(isPausedBefore).toBe(false);

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const emailInput = page.getByPlaceholder(/email/i);
    
    // Focus and fill
    await emailInput.focus();
    await emailInput.fill('test-media-leadgen@example.com');
    
    // Verify it remains focused
    const isFocused = await emailInput.evaluate((node) => document.activeElement === node);
    expect(isFocused).toBe(true);
    
    // Verify we can read the value
    await expect(emailInput).toHaveValue('test-media-leadgen@example.com');
    
    // Verify video is still playing in the background
    const isPausedAfter = await heroVideo.evaluate((vid: HTMLVideoElement) => vid.paused);
    expect(isPausedAfter).toBe(false);
  });

});
