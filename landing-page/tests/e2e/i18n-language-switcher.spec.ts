import { test, expect } from "@playwright/test";

test.describe("Bilingual Language Switcher - Sara D'Angelo Landing Page", () => {
  test("should seamlessly toggle between Italian and English across the entire page", async ({ page }) => {
    // Naviga alla landing page
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. Verifica default: Italiano
    await expect(page.locator("#hero h1")).toContainText("Non organizzo Matrimoni");
    await expect(page.locator("#about")).toContainText("Il tuo matrimonio");
    await expect(page.locator("#metodo")).toContainText("Come do forma al vostro matrimonio");
    await expect(page.locator("#contact")).toContainText("Richiedi la tua Call conoscitiva");

    // 2. Clicca sul selettore lingua: Inglese (EN)
    const enButton = page.locator('button[aria-label="English"]').first();
    await expect(enButton).toBeVisible();
    await enButton.click({ force: true });

    // 3. Verifica passaggio immediato a Inglese
    await expect(page.locator("#hero h1")).toContainText("I do not plan Weddings");
    await expect(page.locator("#about")).toContainText("Your wedding");
    await expect(page.locator("#about")).toContainText("Wedding Architect");
    await expect(page.locator("#metodo")).toContainText("How I give shape to your wedding");
    await expect(page.locator("#contact")).toContainText("Request your Discovery Call");
    await expect(page.locator("input[placeholder*='Names of the Couple']")).toBeVisible();

    // 4. Verifica persistenza localStorage
    const savedLang = await page.evaluate(() => localStorage.getItem("sda_lang"));
    expect(savedLang).toBe("en");

    // 5. Clicca di nuovo sul selettore: Italiano (IT)
    const itButton = page.locator('button[aria-label="Italiano"]').first();
    await expect(itButton).toBeVisible();
    await itButton.click({ force: true });

    // 6. Verifica ritorno immediato a Italiano
    await expect(page.locator("#hero h1")).toContainText("Non organizzo Matrimoni");
    await expect(page.locator("#about")).toContainText("Il tuo matrimonio");
    await expect(page.locator("#contact")).toContainText("Richiedi la tua Call conoscitiva");

    const savedLangIt = await page.evaluate(() => localStorage.getItem("sda_lang"));
    expect(savedLangIt).toBe("it");
  });
});
