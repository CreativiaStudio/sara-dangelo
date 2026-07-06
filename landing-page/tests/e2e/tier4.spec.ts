import { test, expect } from '@playwright/test';

test.describe('Tier 4: Real-World Scenarios', () => {

  test('Scenario 1: Visitor explores full page (triggering animations) and submits lead form successfully. (F1, F2, F3, F4)', async ({ page }) => {
    // Emulate desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Page loads
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Validate typography (F3): Check if a main title has serif font
    const mainTitle = page.locator('h1').first();
    await expect(mainTitle).toHaveCSS('font-family', /serif/i);
    
    // Validate High Fashion Layout (F1): Check background color is a valid palette color (e.g., #FDFBF7)
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).toMatch(/rgb\(253,\s*251,\s*247\)|rgba\(253,\s*251,\s*247,\s*1\)/);
    
    // Wait for hero video
    const heroVideo = page.locator('video').first();
    await expect(heroVideo).toBeVisible();
    
    // Scroll smoothly down the page (F2)
    for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
        await page.waitForTimeout(300);
    }

    // Reach the Funnel section
    const formSection = page.locator('section#funnel');
    await formSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // wait for framer motion

    // Fill out the form
    const nameInput = page.getByPlaceholder(/nome/i);
    await nameInput.fill('Mario Rossi');

    const emailInput = page.getByPlaceholder(/email/i);
    await emailInput.fill('scenario1@example.com');

    // Submit
    const submitBtn = page.getByRole('button', { name: /Scarica il Lookbook/i });
    await submitBtn.click();

    // Assert success message
    const successMessage = page.locator('text=/Grazie/i').first();
    await expect(successMessage).toBeVisible();
  });

  test('Scenario 2: Mobile visitor navigates layout, reads typography, and attempts to submit invalid email. (F1, F3, F4)', async ({ page }) => {
    // Emulate mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Read typography (F3)
    const h2Title = page.locator('h2').first();
    await expect(h2Title).toHaveCSS('font-family', /serif/i);

    // Scroll to form
    const funnelSection = page.locator('section#funnel');
    await funnelSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // wait for framer motion

    const nameInput = page.getByPlaceholder(/nome/i);
    await nameInput.fill('Mario Rossi');

    const emailInput = page.getByPlaceholder(/email/i);
    // Enter invalid email
    await emailInput.fill('bad-email');

    // Submit
    const submitBtn = page.getByRole('button', { name: /Scarica il Lookbook/i });
    await submitBtn.click();

    // See error via native HTML validation
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);

    // Correct the email
    await emailInput.fill('scenario2@example.com');
    await submitBtn.click();

    // Assert success
    const successMessage = page.locator('text=/Grazie/i').first();
    await expect(successMessage).toBeVisible();
  });

  test('Scenario 3: Visitor quickly scrolls through the page, validating performance of media and animations. (F2, F3)', async ({ page }) => {
    // Emulate tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Rapid programmatic loop to scroll through the page
    for (let i = 0; i < 10; i++) {
        await page.mouse.wheel(0, 800);
        await page.waitForTimeout(100);
    }
    
    // Check media at bottom
    const socialProofSection = page.locator('section#social-proof').first();
    await expect(socialProofSection).toBeVisible();
    
    // Check some images or other elements
    const images = page.locator('img');
    const lastImage = images.last();
    await expect(lastImage).toBeVisible();
  });

  test('Scenario 4: Visitor clicks Calendly CTA redirect, bypassing the lead generation form. (F1, F4)', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Find Calendly link
    const calendlyLink = page.locator('a[href*="calendly.com"]');
    await calendlyLink.scrollIntoViewIfNeeded();
    await expect(calendlyLink).toBeVisible();

    // Verify it points to the correct URL
    await expect(calendlyLink).toHaveAttribute('href', 'https://calendly.com/sara-dangelo');
    await expect(calendlyLink).toHaveAttribute('target', '_blank');

    // Click and wait for new page
    const pagePromise = context.waitForEvent('page');
    await calendlyLink.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Check if the new URL contains calendly.com
    expect(newPage.url()).toContain('calendly.com');
  });

  test('Scenario 5: Network delay simulation during form submission on high-fashion responsive layout. (F1, F4)', async ({ page }) => {
    // Emulate mobile/tablet for responsive layout
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Intercept API request to add delay
    await page.route('/api/supabase', async route => {
      if (route.request().method() === 'POST') {
        // Delay for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      } else {
        await route.continue();
      }
    });

    const funnelSection = page.locator('section#funnel');
    await funnelSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // wait for framer motion

    const nameInput = page.getByPlaceholder(/nome/i);
    await nameInput.fill('Scenario 5');

    const emailInput = page.getByPlaceholder(/email/i);
    await emailInput.fill('scenario5@example.com');

    const submitBtn = page.getByRole('button', { name: /Scarica il Lookbook/i });
    await submitBtn.click();

    // Verify loading state
    await expect(submitBtn).toBeDisabled();
    await expect(submitBtn).toHaveText(/Invio/i);

    // Wait for response and assert success message appears
    const successMessage = page.locator('text=/Grazie/i').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

});
