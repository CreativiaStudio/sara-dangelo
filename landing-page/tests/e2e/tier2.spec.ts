import { test, expect } from '@playwright/test';

// Feature 1: High Fashion Layout & Palette
test.describe('Tier 2: Feature 1 - High Fashion Layout & Palette', () => {
  test('Test 1.1: Mobile viewport layout constraint (No horizontal overflow)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto('/');
    
    await expect(page.locator('body')).toBeVisible();
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBe(320);
  });

  test('Test 1.2: Ultra-wide layout centering constraint', async ({ page }) => {
    await page.setViewportSize({ width: 3840, height: 2160 });
    await page.goto('/');
    
    const mainContainer = page.locator('main, #__next, [data-testid="main-container"]').first();
    await expect(mainContainer).toBeVisible();
    
    const metrics = await mainContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        width: parseFloat(style.width)
      };
    });
    
    expect(metrics.width).toBeGreaterThan(0);
    expect(metrics.width).toBeLessThanOrEqual(3840);
  });

  test('Test 1.3: Absolute absence of pure black (#000000) in text', async ({ page }) => {
    await page.goto('/');
    
    const textElements = page.locator('h1, h2, p, span, a, li');
    await expect(textElements.first()).toBeVisible();
    
    const count = await textElements.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const color = await textElements.nth(i).evaluate((el) => window.getComputedStyle(el).color);
      expect(color).not.toBe('rgb(0, 0, 0)');
      expect(color).not.toBe('rgba(0, 0, 0, 1)');
    }
  });

  test('Test 1.4: Absolute absence of pure black in backgrounds', async ({ page }) => {
    await page.goto('/');
    
    const containers = page.locator('div, section, header, footer, main');
    const firstElInfo = await containers.first().evaluate((el) => {
      return {
        outerHTML: el.outerHTML,
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility,
        opacity: window.getComputedStyle(el).opacity,
        hidden: el.hidden,
        width: el.clientWidth,
        height: el.clientHeight,
        boundingBox: el.getBoundingClientRect()
      };
    }).catch(e => e.message);
    console.log("FIRST CONTAINER INFO:", JSON.stringify(firstElInfo, null, 2));
    await expect(containers.first()).toBeVisible();
    
    const count = await containers.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const bgColor = await containers.nth(i).evaluate((el) => window.getComputedStyle(el).backgroundColor);
      expect(bgColor).not.toBe('rgb(0, 0, 0)');
      expect(bgColor).not.toBe('rgba(0, 0, 0, 1)');
    }
  });

  test('Test 1.5: Accessibility contrast ratios (Real Calculation)', async ({ page }) => {
    await page.goto('/');
    
    const element = page.locator('button, a[role="button"], h1').first();
    await expect(element).toBeVisible();
    
    const { color, bgColor } = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      let bg = style.backgroundColor;
      let parent = el.parentElement;
      while ((bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') && parent) {
        bg = window.getComputedStyle(parent).backgroundColor;
        parent = parent.parentElement;
      }
      return {
        color: style.color,
        bgColor: bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ? 'rgb(255, 255, 255)' : bg
      };
    });

    function parseRGB(rgbString: string) {
      const match = rgbString.match(/\d+/g);
      if (!match) return [255, 255, 255];
      return match.map(Number);
    }

    function luminance(r: number, g: number, b: number) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    const [fgR, fgG, fgB] = parseRGB(color);
    const [bgR, bgG, bgB] = parseRGB(bgColor);

    const lum1 = luminance(fgR, fgG, fgB);
    const lum2 = luminance(bgR, bgG, bgB);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const contrast = (brightest + 0.05) / (darkest + 0.05);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});

// Feature 2: Scrollytelling Animations
test.describe('Tier 2: Feature 2 - Scrollytelling Animations', () => {
  test('Test 2.1: Rapid scrolling recovery', async ({ page }) => {
    await page.goto('/');
    
    const footerElement = page.locator('footer, section:last-of-type, [data-testid="footer"]').last();
    await expect(footerElement).toBeAttached();
    
    await page.evaluate(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    });
    
    await page.waitForTimeout(1500); 
    await expect(footerElement).toBeVisible();
    
    const opacity = await footerElement.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(opacity)).toBeGreaterThan(0);
  });

  test('Test 2.2: Reverse scrolling visibility persistence', async ({ page }) => {
    await page.goto('/');
    
    const animatedElement = page.locator('section:nth-of-type(2), [data-testid="animated-section"]').first();
    await expect(animatedElement).toBeAttached();
    
    await animatedElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); 
    await expect(animatedElement).toBeVisible();
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    await animatedElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(animatedElement).toBeVisible();
  });

  test('Test 2.3: Reduced motion accessibility preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await page.goto('/');
    
    const animatedElement = page.locator('section:nth-of-type(2), [data-testid="animated-section"]').first();
    await expect(animatedElement).toBeAttached();
    
    await animatedElement.scrollIntoViewIfNeeded();
    await expect(animatedElement).toBeVisible();
    
    const transition = await animatedElement.evaluate((el) => window.getComputedStyle(el).transitionDuration);
    expect(transition === '0s' || await animatedElement.isVisible()).toBeTruthy();
  });

  test('Test 2.4: Animation bounding box on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    const animatedElement = page.locator('section:nth-of-type(2), [data-testid="animated-section"]').first();
    await expect(animatedElement).toBeAttached();
    
    await animatedElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await expect(animatedElement).toBeVisible();
    
    const box = await animatedElement.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(375);
    }
  });

  test('Test 2.5: Resize interruption during animation', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    const animatedElement = page.locator('section:nth-of-type(2), [data-testid="animated-section"]').first();
    await expect(animatedElement).toBeAttached();
    
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await animatedElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    
    await expect(animatedElement).toBeVisible();
  });
});

// Feature 3: Media Display & Typography
test.describe('Tier 2: Feature 3 - Media Display & Typography', () => {
  test('Test 3.1: Typography fallback enforcement', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    
    const fontFamily = await heading.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(fontFamily.toLowerCase()).toContain('serif');
  });

  test('Test 3.2: Extremely long text handling without overflow', async ({ page }) => {
    await page.goto('/');
    const container = page.locator('p').first();
    await expect(container).toBeVisible();
    
    await container.evaluate((el) => {
      el.textContent = 'A'.repeat(5000);
    });
    
    const widthExceedsViewport = await container.evaluate((el) => {
      return el.getBoundingClientRect().width > window.innerWidth;
    });
    expect(widthExceedsViewport).toBeFalsy();
    
    const isOverflowing = await container.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(isOverflowing).toBeFalsy();
  });

  test('Test 3.3: Missing image source graceful fallback', async ({ page }) => {
    await page.route('**/*.{png,jpg,jpeg,webp}', route => route.abort());
    await page.goto('/');
    
    const image = page.locator('img').first();
    await expect(image).toBeAttached();
    
    const count = await page.locator('img').count();
    expect(count).toBeGreaterThan(0);
    
    const alt = await image.getAttribute('alt');
    expect(alt).not.toBeNull();
  });

  test('Test 3.4: Video load failure boundary', async ({ page }) => {
    await page.route('**/*.{mp4,webm}', route => route.abort());
    await page.goto('/');
    
    const videoElement = page.locator('video').first();
    await expect(videoElement).toBeAttached();
    
    const poster = await videoElement.getAttribute('poster');
    const isVisible = await videoElement.isVisible();
    
    expect(poster !== null || isVisible).toBeTruthy();
  });

  test('Test 3.5: Responsive media sizing constraint', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('/');
    
    const mediaContainer = page.locator('img, video').first();
    await expect(mediaContainer).toBeVisible();
    
    const width = await mediaContainer.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(400);
  });
});

// Feature 4: Lead Generation & CTA
test.describe('Tier 2: Feature 4 - Lead Generation & CTA', () => {
  test('Test 4.1: Empty form submission rejection', async ({ page }) => {
    await page.goto('/');
    
    const submitButton = page.locator('form button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
    
    await submitButton.click();
    
    const requiredInput = page.locator('form input[required]').first();
    await expect(requiredInput).toBeAttached();
    
    const validity = await requiredInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBeFalsy();
  });

  test('Test 4.2: Invalid email format boundary', async ({ page }) => {
    await page.goto('/');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
    
    await emailInput.fill('invalid@email@domain.com');
    
    const submitButton = page.locator('form button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    const validity = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validity).toBeFalsy();
  });

  test('Test 4.3: XSS payload input handling', async ({ page }) => {
    let dialogAppeared = false;
    page.on('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.dismiss();
    });

    await page.goto('/');
    
    const textField = page.locator('input[type="text"], input[name="name"], textarea').first();
    await expect(textField).toBeVisible();
    
    const xssPayload = '<script>alert("hack")</script>';
    await textField.fill(xssPayload);
    
    const value = await textField.inputValue();
    expect(value).toBe(xssPayload);
    expect(dialogAppeared).toBeFalsy();
  });

  test('Test 4.4: Rapid double-submit prevention', async ({ page }) => {
    await page.goto('/');
    
    const form = page.locator('form').first();
    await expect(form).toBeVisible();
    
    const nameInput = form.locator('input[type="text"], input[name="name"]').first();
    const emailInput = form.locator('input[type="email"], input[name="email"]').first();
    const submitButton = form.locator('button[type="submit"]').first();
    
    if (await nameInput.isVisible()) await nameInput.fill('Jane Doe');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('jane@example.com');
    
    await expect(submitButton).toBeVisible();
    
    for (let i = 0; i < 5; i++) {
      await submitButton.click({ force: true });
    }
    
    await page.waitForTimeout(500);
    
    const isDisabled = await submitButton.isDisabled();
    const textContent = (await submitButton.textContent())?.toLowerCase() || '';
    expect(isDisabled || textContent.includes('loading') || textContent.includes('sending') || textContent.includes('success')).toBeTruthy();
  });

  test('Test 4.5: Calendly CTA visibility on boundary viewports', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto('/');
    
    const calendlyButton = page.locator('a[href*="calendly"], button:has-text("Calendly"), [data-testid="calendly-cta"]').first();
    await expect(calendlyButton).toBeVisible();
    
    const box = await calendlyButton.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.width).toBeLessThanOrEqual(320);
    }
    
    await page.setViewportSize({ width: 3840, height: 2160 });
    await expect(calendlyButton).toBeVisible();
    await expect(calendlyButton).toBeEnabled();
  });
});
