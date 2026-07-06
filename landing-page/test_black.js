const { chromium } = require('@playwright/test');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3003');
    
    const blackElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const result = [];
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        const style = window.getComputedStyle(el);
        if (
          style.color === 'rgb(0, 0, 0)' ||
          style.backgroundColor === 'rgb(0, 0, 0)' ||
          style.borderColor === 'rgb(0, 0, 0)'
        ) {
          let path = el.tagName;
          if (el.id) path += '#' + el.id;
          if (el.className) path += '.' + [...el.classList].join('.');
          result.push({
            path,
            color: style.color,
            bgColor: style.backgroundColor,
            borderColor: style.borderColor,
            display: style.display,
            html: el.outerHTML.substring(0, 100)
          });
        }
      }
      return result;
    });
    
    console.log('Black elements count:', blackElements.length);
    console.log(JSON.stringify(blackElements, null, 2));
  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
