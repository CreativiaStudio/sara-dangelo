import { test, expect } from '@playwright/test';

test.describe('Empirical Challenger M1-It2: Adversarial Stress & Occlusion Verification', () => {

  test('Scenario 1: Scroll-up in #portfolio — Navbar reveal, zero vertical overlap, tab clickability', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // 1. Scroll down deep into #portfolio section so switcher is pinned and navbar is hidden
    await page.evaluate(() => {
      const portfolio = document.querySelector('#portfolio');
      if (portfolio) {
        const top = portfolio.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: top + 600, behavior: 'instant' });
      }
    });
    // Wait for downward scroll and motion values to settle
    await page.waitForTimeout(600);

    // Verify navbar is hidden on downward scroll
    const navHiddenState = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const rect = nav?.getBoundingClientRect();
      const offset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset').trim();
      return {
        scrollY: window.pageYOffset,
        navY: rect?.y,
        navBottom: rect?.bottom,
        navbarOffset: offset,
      };
    });
    console.log('[Stress 1] After scroll-down:', navHiddenState);

    // 2. Scroll UP inside #portfolio by 250px (simulating user scrolling up)
    await page.evaluate(() => {
      window.scrollBy({ top: -250, behavior: 'instant' });
    });
    // Wait for scroll event, motion values, and navbar transition to complete (500ms transition duration)
    await page.waitForTimeout(800);

    // 3. Inspect geometry when Navbar is revealed
    const geometricAudit = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
      const navRect = nav ? nav.getBoundingClientRect() : null;
      const switcherRect = switcher ? switcher.getBoundingClientRect() : null;
      const offset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset').trim();

      const tabs = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
      const hitResults = tabs.map((btn, i) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        const elAtCenter = document.elementFromPoint(cx, cy);
        const topEl = document.elementFromPoint(cx, rect.y + 2);

        return {
          index: i,
          title: btn.textContent?.trim(),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          isCenterCovered: elAtCenter !== btn && !btn.contains(elAtCenter),
          centerTag: elAtCenter?.tagName,
          isTopCovered: topEl !== btn && !btn.contains(topEl),
          topTag: topEl?.tagName,
        };
      });

      return {
        scrollY: window.pageYOffset,
        navRect,
        switcherRect,
        navbarOffset: offset,
        overlapPx: switcherRect && navRect ? Math.max(0, navRect.bottom - switcherRect.top) : null,
        switcherTopRelativeToNavBottom: switcherRect && navRect ? switcherRect.top - navRect.bottom : null,
        hitResults,
      };
    });

    console.log('[Stress 1] Geometric Audit on Scroll-Up:', JSON.stringify(geometricAudit, null, 2));

    // Assertions
    expect(geometricAudit.navRect).not.toBeNull();
    expect(geometricAudit.switcherRect).not.toBeNull();
    // Navbar must be visible (top >= -5px)
    expect(geometricAudit.navRect!.y).toBeGreaterThanOrEqual(-5);
    // Switcher top must be greater than or equal to navbar bottom (0px overlap)
    expect(geometricAudit.overlapPx).toBeLessThanOrEqual(0.5);
    expect(geometricAudit.switcherTopRelativeToNavBottom).toBeGreaterThanOrEqual(-0.5);

    // Every tab must be 100% clickable and NOT covered
    for (const tab of geometricAudit.hitResults) {
      expect(tab.isCenterCovered).toBe(false);
      expect(tab.isTopCovered).toBe(false);
    }

    // 4. Click tabs while Navbar is revealed and verify state & gallery update
    const switcher = page.locator('#portfolio [role="tablist"]');
    const capriTab = switcher.locator('button[role="tab"]').filter({ hasText: /Capri/i });
    await capriTab.click();
    await expect(capriTab).toHaveAttribute('aria-selected', 'true');

    const galleryGrid = page.locator('#portfolio-gallery-grid');
    const capriImages = galleryGrid.locator('img');
    await expect(capriImages.first()).toHaveAttribute('alt', /Capri/i);

    // Click another tab
    const lancellottiTab = switcher.locator('button[role="tab"]').filter({ hasText: /Castello Lancellotti/i });
    await lancellottiTab.click();
    await expect(lancellottiTab).toHaveAttribute('aria-selected', 'true');
    const lancellottiImages = galleryGrid.locator('img');
    await expect(lancellottiImages.first()).toHaveAttribute('alt', /Castello Lancellotti/i);
  });

  test('Scenario 2: Rapid bidirectional scroll oscillation stress', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Scroll to portfolio
    await page.evaluate(() => {
      const p = document.querySelector('#portfolio');
      if (p) window.scrollTo({ top: p.getBoundingClientRect().top + window.pageYOffset + 400, behavior: 'instant' });
    });
    await page.waitForTimeout(400);

    // Rapidly oscillate scroll 8 times
    for (let i = 0; i < 8; i++) {
      const delta = i % 2 === 0 ? -120 : 120;
      await page.evaluate((d) => window.scrollBy({ top: d, behavior: 'instant' }), delta);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(600);

    // Check that state settled cleanly with no NaN or broken CSS properties
    const state = await page.evaluate(() => {
      const offset = getComputedStyle(document.documentElement).getPropertyValue('--navbar-offset').trim();
      const switcher = document.querySelector('#portfolio [role="tablist"]')?.closest('.sticky');
      const switcherRect = switcher?.getBoundingClientRect();
      const nav = document.querySelector('nav');
      const navRect = nav?.getBoundingClientRect();
      return { offset, switcherY: switcherRect?.y, navY: navRect?.y };
    });
    console.log('[Stress 2] Settled state after oscillation:', state);
    expect(state.offset).toMatch(/^\d+(\.\d+)?px$/);
  });

  test('Scenario 3: AnimatePresence mode="wait" transition — 0 layout shift and single in-flow grid', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Setup PerformanceObserver for layout-shift
    await page.evaluate(() => {
      (window as any).__layoutShifts = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          (window as any).__layoutShifts.push((entry as any).value);
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    });

    const switcher = portfolioSection.locator('[role="tablist"]');
    const tabs = switcher.locator('button[role="tab"]');

    // Click Capri tab
    await tabs.nth(1).click();

    // Sample DOM at 25ms intervals during 0.15s transition
    const gridCounts: number[] = [];
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(25);
      const count = await page.evaluate(() => {
        const grid = document.querySelector('#portfolio-gallery-grid');
        return grid ? grid.querySelectorAll(':scope > div.grid').length : 0;
      });
      gridCounts.push(count);
    }

    console.log('[Stress 3] Grid container counts during transition samples:', gridCounts);

    // With mode="wait", there should NEVER be 2 grids simultaneously in DOM
    for (const count of gridCounts) {
      expect(count).toBeLessThanOrEqual(1);
    }

    // Wait for transition to complete
    await page.waitForTimeout(300);

    const shifts = await page.evaluate(() => (window as any).__layoutShifts as number[]);
    const totalCLS = shifts.reduce((a, b) => a + b, 0);
    console.log('[Stress 3] Cumulative Layout Shift during tab switch:', totalCLS);
    // Layout shift should be zero or negligible (< 0.05)
    expect(totalCLS).toBeLessThan(0.05);
  });

  test('Scenario 4: Multi-viewport boundary scan & Tab 0 clearance across 7 viewports', async ({ page }) => {
    const viewports = [
      { name: 'iPhone SE (375px)', width: 375, height: 667 },
      { name: 'iPhone 14 (390px)', width: 390, height: 844 },
      { name: 'iPad Portrait (768px)', width: 768, height: 1024 },
      { name: 'iPad Air (820px)', width: 820, height: 1180 },
      { name: 'iPad Pro (1024px)', width: 1024, height: 1366 },
      { name: 'Small Laptop (1140px)', width: 1140, height: 900 },
      { name: 'Desktop (1280px)', width: 1280, height: 800 },
      { name: 'Full HD (1920px)', width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const portfolioSection = page.locator('#portfolio');
      await portfolioSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const metrics = await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('#portfolio [role="tab"]'));
        const tab0 = tabs[0];
        const rect0 = tab0 ? tab0.getBoundingClientRect() : null;
        const hasDocOverflow = document.documentElement.scrollWidth > window.innerWidth;
        const allTabsVisibleOrScrollable = tabs.every(t => {
          const r = t.getBoundingClientRect();
          return r.width > 0 && r.height >= 44;
        });

        return {
          tab0X: rect0?.x,
          tab0Width: rect0?.width,
          tab0Height: rect0?.height,
          hasDocOverflow,
          allTabsVisibleOrScrollable,
        };
      });

      console.log(`[Stress 4] Viewport ${vp.name}: Tab 0 X = ${metrics.tab0X}px, Height = ${metrics.tab0Height}px, DocOverflow = ${metrics.hasDocOverflow}`);

      // Tab 0 must NOT be in negative space (clipped off left)
      expect(metrics.tab0X).toBeGreaterThanOrEqual(0);
      // Touch target height >= 44px
      expect(metrics.tab0Height).toBeGreaterThanOrEqual(44);
      // No document-level horizontal overflow
      expect(metrics.hasDocOverflow).toBe(false);
      expect(metrics.allTabsVisibleOrScrollable).toBe(true);
    }
  });

  test('Scenario 5: Lightbox navigation with keyboard and mouse while sticky bar is active', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const portfolioSection = page.locator('#portfolio');
    await portfolioSection.scrollIntoViewIfNeeded();

    // Open first photo
    const firstCard = portfolioSection.locator('.photo-frame').first();
    await firstCard.click();

    // Check lightbox modal is displayed at z-[60]
    const lightboxModal = page.locator('.fixed.inset-0.z-\\[60\\]');
    await expect(lightboxModal).toBeVisible();

    // Click Next
    const nextBtn = page.locator('button[aria-label="Foto successiva"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Verify counter updated to 2
    const counter = lightboxModal.locator('.absolute.bottom-4');
    await expect(counter).toBeVisible();
    await expect(counter).toContainText('2 /');

    // Click Prev
    const prevBtn = page.locator('button[aria-label="Foto precedente"]');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await expect(counter).toContainText('1 /');

    // Close
    const closeBtn = page.locator('button[aria-label="Chiudi"]');
    await closeBtn.click();
    await expect(lightboxModal).not.toBeVisible();
  });
});
