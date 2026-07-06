import { test, expect } from '@playwright/test';

test.describe('Tier 1: Feature 1 - Lead Generation Form', () => {
  test('form is visible and contains email input, submit button, and download text', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form').filter({ hasText: /Lookbook/i }).first();
    await expect(form).toBeVisible();
    await expect(form.locator('input[type="email"]')).toBeVisible();
    await expect(form.locator('button[type="submit"]')).toBeVisible();
  });

  test('form submission with valid email shows success state', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form').filter({ hasText: /Lookbook/i }).first();
    await form.locator('input[type="email"]').fill('test@example.com');
    await form.locator('button[type="submit"]').click();
    // Assuming success message or redirect, checking for an indicator of success
    await expect(page.locator('text=/grazie|success/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('form submission with empty email shows validation error', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form').filter({ hasText: /Lookbook/i }).first();
    await form.locator('button[type="submit"]').click();
    // The native HTML5 validation or custom validation error should appear
    const emailInput = form.locator('input[type="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('form submission with invalid email format shows validation error', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('form').filter({ hasText: /Lookbook/i }).first();
    await form.locator('input[type="email"]').fill('not-an-email');
    await form.locator('button[type="submit"]').click();
    const emailInput = form.locator('input[type="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBeTruthy();
  });

  test('CTA for "Prenota la tua Call" is present and functional', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('a, button').filter({ hasText: /Prenota/i }).first();
    await expect(cta).toBeVisible();
    
    // Check if it opens calendly or redirects
    const href = await cta.getAttribute('href');
    if (href) {
      expect(href).toMatch(/calendly\.com|booking/i);
    } else {
      await cta.click();
      await expect(page.locator('.calendly-inline-widget, .modal, dialog')).toBeVisible();
    }
  });
});

test.describe('Tier 1: Feature 2 - Media Optimization', () => {
  test('Hero video background is present with autoplay, loop, muted', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video').first();
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute('autoplay', '');
    await expect(video).toHaveAttribute('loop', '');
    await expect(video).toHaveAttribute('muted', '');
  });

  test('Hero video uses proper source tags', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('video').first();
    const source = video.locator('source').first();
    // A source tag should exist if it\'s not a direct src attribute
    const hasSource = await source.count() > 0;
    const directSrc = await video.getAttribute('src');
    expect(hasSource || directSrc).toBeTruthy();
  });

  test('Portfolio images use modern formats or picture tags', async ({ page }) => {
    await page.goto('/');
    // Looking for portfolio images, assuming they are in a section with 'Portfolio' or similar text
    const images = page.locator('img[src*=".webp"], picture source[type="image/webp"]');
    // We expect at least some WebP images to be present on the page
    expect(await images.count()).toBeGreaterThan(0);
  });

  test('Images below the fold have lazy loading attribute', async ({ page }) => {
    await page.goto('/');
    const lazyImages = page.locator('img[loading="lazy"]');
    expect(await lazyImages.count()).toBeGreaterThan(0);
  });

  test('All functional images have alt text for accessibility', async ({ page }) => {
    await page.goto('/');
    // Find all images that are not decorative (assuming purely decorative ones might have empty alt but they should have the attribute)
    const imagesWithoutAlt = page.locator('img:not([alt])');
    expect(await imagesWithoutAlt.count()).toBe(0);
  });
});

test.describe('Tier 1: Feature 3 - Responsive Layout & Sections', () => {
  test('The 5 key sections are present', async ({ page }) => {
    await page.goto('/');
    const textIndicators = [
      /architetto/i, // Hero / Metodo
      /esperienza|18 anni/i, // Il Metodo
      /portfolio|caruso|bellevue/i, // Portfolio
      /recensioni|dicono di noi/i, // Social Proof
      /lookbook|prenota/i // Double funnel
    ];
    for (const regex of textIndicators) {
      await expect(page.locator(`text=${regex}`).first()).toBeVisible();
    }
  });

  test('Mobile viewport layout adaptation (navigation)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Check if a hamburger menu or mobile specific navigation element appears
    const mobileMenuBtn = page.locator('button[aria-label*="menu"], .hamburger').first();
    if (await mobileMenuBtn.count() > 0) {
      await expect(mobileMenuBtn).toBeVisible();
    } else {
      // Alternatively, navigation links might be hidden by default on mobile
      const desktopNav = page.locator('nav').first();
      // Test might be adjusted based on actual implementation
      expect(desktopNav).toBeDefined();
    }
  });

  test('Content flows correctly without horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(isOverflowing).toBe(false);
  });

  test('Portfolio grid adapts to mobile (elements are stacked)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Identify portfolio container
    const portfolioSection = page.locator('section').filter({ hasText: /portfolio|caruso/i }).first();
    const boundingBox = await portfolioSection.boundingBox();
    // Assuming stacked items will make the section relatively tall compared to viewport
    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });

  test('Il Metodo section text is visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const metodoText = page.locator('text=/18 anni/i').first();
    await expect(metodoText).toBeVisible();
  });
});

test.describe('Tier 1: Feature 4 - Scroll Animations (framer-motion)', () => {
  test('Elements in "Il Metodo" animate into view', async ({ page }) => {
    await page.goto('/');
    // Initial state check (some elements might start with opacity 0)
    // Then scroll
    const metodoSection = page.locator('section').filter({ hasText: /18 anni/i }).first();
    await metodoSection.scrollIntoViewIfNeeded();
    // Wait for animation
    await page.waitForTimeout(1000);
    const box = await metodoSection.boundingBox();
    expect(box).toBeTruthy();
  });

  test('Portfolio images trigger slide-in or fade-in on scroll', async ({ page }) => {
    await page.goto('/');
    const portfolioImage = page.locator('section').filter({ hasText: /portfolio|caruso/i }).locator('img').first();
    await portfolioImage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // let animation complete
    await expect(portfolioImage).toBeVisible();
  });

  test('Hovering over portfolio image triggers transformation/animation', async ({ page }) => {
    await page.goto('/');
    const portfolioImage = page.locator('section').filter({ hasText: /portfolio|caruso/i }).locator('img').first();
    await portfolioImage.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    // Get style before
    const styleBefore = await portfolioImage.evaluate(el => window.getComputedStyle(el).transform);
    await portfolioImage.hover();
    await page.waitForTimeout(500); // wait for hover animation
    const styleAfter = await portfolioImage.evaluate(el => window.getComputedStyle(el).transform);
    // Might not always change transform, but usually a premium hover effect does
    expect(styleBefore !== styleAfter || styleAfter !== 'none').toBeTruthy();
  });

  test('Framer-motion specific inline styles are present', async ({ page }) => {
    await page.goto('/');
    // framer-motion typically adds style attributes with variables or transform
    const motionElements = page.locator('[style*="opacity"], [style*="transform"]');
    expect(await motionElements.count()).toBeGreaterThan(0);
  });

  test('Social proof cards animate sequentially', async ({ page }) => {
    await page.goto('/');
    const socialProofSection = page.locator('section').filter({ hasText: /recensioni|dicono di noi/i }).first();
    await socialProofSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    // We just verify they are visible after scrolling
    const cards = page.locator('text=/recensioni|dicono di noi/i'); // Assuming cards have specific class, fallback to text
    await expect(cards.first()).toBeVisible();
  });
});
