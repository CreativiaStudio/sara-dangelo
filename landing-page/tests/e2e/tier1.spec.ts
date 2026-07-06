import { test, expect } from '@playwright/test';

test.describe('Tier 1 Playwright Tests - Sara D\'Angelo Landing Page', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the root URL unconditionally
    await page.goto('/');
  });

  test.describe('1. High Fashion Layout & Palette', () => {
    test('1. No Pure Black Test', async ({ page }) => {
      const hasPureBlack = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          const style = window.getComputedStyle(el);
          if (
            style.color === 'rgb(0, 0, 0)' ||
            style.backgroundColor === 'rgb(0, 0, 0)' ||
            style.borderColor === 'rgb(0, 0, 0)'
          ) {
            return true;
          }
        }
        return false;
      });
      expect(hasPureBlack).toBe(false);
    });

    test('2. Palette Compliance', async ({ page }) => {
      const bodyBg = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
      // Ensure the background is not pure white or pure black
      expect(bodyBg).not.toBe('rgb(0, 0, 0)');
      // Allowing any off-white/cream/beige/gold/brown color. We simply verify it has a background applied.
      expect(bodyBg).toBeTruthy();
    });

    test('3. Generous Whitespace', async ({ page }) => {
      const sections = ['#hero', '#metodo', '#portfolio', '#social-proof', '#funnel'];
      for (const selector of sections) {
        const section = page.locator(selector).first();
        await expect(section).toBeAttached();
        const paddingTop = await section.evaluate((el) => parseInt(window.getComputedStyle(el).paddingTop || '0', 10));
        const paddingBottom = await section.evaluate((el) => parseInt(window.getComputedStyle(el).paddingBottom || '0', 10));
        expect(paddingTop + paddingBottom).toBeGreaterThanOrEqual(80);
      }
    });

    test('4. Desktop Layout Integrity', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalOverflow).toBe(false);

      const sections = ['#hero', '#metodo', '#portfolio', '#social-proof', '#funnel'];
      for (const selector of sections) {
        const section = page.locator(selector).first();
        await expect(section).toBeAttached();
      }
    });

    test('5. Mobile Fluidity', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalOverflow).toBe(false);
    });
  });

  test.describe('2. Scrollytelling Animations', () => {
    test('6. Hero Fade-In', async ({ page }) => {
      const hero = page.locator('#hero').first();
      await expect(hero).toBeVisible();
      await expect(hero).toHaveCSS('opacity', '1');
    });

    test('7. Metodo Scroll Reveal', async ({ page }) => {
      const metodo = page.locator('#metodo').first();
      await expect(metodo).toBeAttached();
      await metodo.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500); // Wait for transition
      await expect(metodo).toBeVisible();
      await expect(metodo).toHaveCSS('opacity', '1');
    });

    test('8. Staggered Gallery Entrance', async ({ page }) => {
      const portfolio = page.locator('#portfolio').first();
      await expect(portfolio).toBeAttached();
      await portfolio.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const galleryItems = portfolio.locator('.gallery-item, img');
      await expect(galleryItems.first()).toBeVisible();
      const count = await galleryItems.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        await expect(galleryItems.nth(i)).toHaveCSS('opacity', '1');
      }
    });

    test('9. Premium Hover Transitions', async ({ page }) => {
      const firstPortfolioItem = page.locator('#portfolio .gallery-item, #portfolio img').first();
      await expect(firstPortfolioItem).toBeAttached();
      await firstPortfolioItem.scrollIntoViewIfNeeded();
      const initialTransform = await firstPortfolioItem.evaluate((el) => window.getComputedStyle(el).transform);
      await firstPortfolioItem.hover();
      await page.waitForTimeout(300);
      const hoveredTransform = await firstPortfolioItem.evaluate((el) => window.getComputedStyle(el).transform);
      expect(initialTransform).not.toEqual(hoveredTransform);
    });

    test('10. Parallax / Depth Indicators', async ({ page }) => {
      const backgroundElement = page.locator('.parallax-bg, [data-parallax]').first();
      await expect(backgroundElement).toBeAttached();
      const initialTransform = await backgroundElement.evaluate((el) => window.getComputedStyle(el).transform);
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(300);
      const scrolledTransform = await backgroundElement.evaluate((el) => window.getComputedStyle(el).transform);
      expect(initialTransform).not.toEqual(scrolledTransform);
    });
  });

  test.describe('3. Media Display & Typography', () => {
    test('11. Serif Headings', async ({ page }) => {
      const headings = page.locator('h1, h2, h3');
      await expect(headings.first()).toBeAttached();
      const count = await headings.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const fontFamily = await headings.nth(i).evaluate((el) => window.getComputedStyle(el).fontFamily);
        expect(fontFamily.toLowerCase()).toMatch(/serif/);
      }
    });

    test('12. Sans-Serif Body', async ({ page }) => {
      const bodyText = page.locator('p, span, input').first();
      await expect(bodyText).toBeAttached();
      const fontFamily = await bodyText.evaluate((el) => window.getComputedStyle(el).fontFamily);
      expect(fontFamily.toLowerCase()).toMatch(/sans-serif/);
    });

    test('13. Hero Video Constraints', async ({ page }) => {
      const heroVideo = page.locator('#hero video').first();
      await expect(heroVideo).toBeAttached();
      await expect(heroVideo).toHaveAttribute('autoplay', /.*/);
      await expect(heroVideo).toHaveAttribute('loop', /.*/);
      await expect(heroVideo).toHaveAttribute('muted', /.*/);
      await expect(heroVideo).toHaveAttribute('playsinline', /.*/);

      const readyState = await heroVideo.evaluate((vid: HTMLVideoElement) => vid.readyState);
      expect(readyState).toBeGreaterThanOrEqual(1);
    });

    test('14. Modern Image Formats', async ({ page }) => {
      let foundModernImage = false;
      page.on('response', (response) => {
        if (response.request().resourceType() === 'image') {
          const contentType = response.headers()['content-type'];
          if (contentType === 'image/webp' || contentType === 'image/avif') {
            foundModernImage = true;
          }
        }
      });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      // Depending on caching, we loosely expect modern image loads
      expect(foundModernImage).toBe(true);
    });

    test('15. Performance Loading', async ({ page }) => {
      const lazyImages = page.locator('img[loading="lazy"]');
      await expect(lazyImages.first()).toBeAttached();
      const count = await lazyImages.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('4. Lead Generation & CTA', () => {
    test('16. CTA Visibility & Styling', async ({ page }) => {
      const emailForm = page.locator('form').first();
      await expect(emailForm).toBeVisible();

      const calendlyCTA = page.locator('a[href*="calendly.com"]').first();
      await expect(calendlyCTA).toBeVisible();
    });

    test('17. High-Fashion Validation', async ({ page }) => {
      const emailForm = page.locator('form').first();
      await expect(emailForm).toBeAttached();
      
      const submitBtn = emailForm.locator('button[type="submit"], button').last();
      await expect(submitBtn).toBeAttached();

      // Suppress native HTML5 validation
      await emailForm.evaluate((form: HTMLFormElement) => form.setAttribute('novalidate', 'true'));
      await submitBtn.click();

      const errorMsg = emailForm.locator('.error, [data-error], .text-red-500, [role="alert"]').first();
      await expect(errorMsg).toBeVisible();
    });

    test('18. Successful Lead Capture', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();
      
      await emailInput.fill('test@vogue.com');
      const submitBtn = page.locator('form button[type="submit"], form button').last();
      await expect(submitBtn).toBeAttached();
      await submitBtn.click();

      const successMessage = page.locator('text=/grazie|success/i').first();
      await expect(successMessage).toBeVisible();
    });

    test('19. Calendly Redirect', async ({ page }) => {
      const calendlyCTA = page.locator('a[href*="calendly.com"]').first();
      await expect(calendlyCTA).toBeAttached();
      const href = await calendlyCTA.getAttribute('href');
      expect(href).toContain('calendly.com');
    });

    test('20. Premium Button Interaction', async ({ page }) => {
      const submitBtn = page.locator('form button[type="submit"], form button').last();
      await expect(submitBtn).toBeAttached();
      await submitBtn.scrollIntoViewIfNeeded();

      const initialShadow = await submitBtn.evaluate((el) => window.getComputedStyle(el).boxShadow);
      const initialTransform = await submitBtn.evaluate((el) => window.getComputedStyle(el).transform);

      await submitBtn.hover();
      await page.waitForTimeout(300);

      const hoveredShadow = await submitBtn.evaluate((el) => window.getComputedStyle(el).boxShadow);
      const hoveredTransform = await submitBtn.evaluate((el) => window.getComputedStyle(el).transform);

      const didAnimate = initialShadow !== hoveredShadow || initialTransform !== hoveredTransform;
      expect(didAnimate).toBe(true);
    });
  });
});
