const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3003/');
    const firstContainer = page.locator('div, section, header, footer, main').first();
    const outerHTML = await firstContainer.evaluate(el => el.outerHTML);
    const visible = await firstContainer.isVisible();
    const computedStyle = await firstContainer.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        width: style.width,
        height: style.height,
        clip: style.clip,
        position: style.position
      };
    });
    console.log("FIRST CONTAINER INFO:");
    console.log("outerHTML:", outerHTML);
    console.log("isVisible:", visible);
    console.log("computedStyle:", JSON.stringify(computedStyle, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await browser.close();
  }
})();
