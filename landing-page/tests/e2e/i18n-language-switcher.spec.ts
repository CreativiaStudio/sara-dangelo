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
    await expect(page.locator("#portfolio")).toContainText("Richiedi Progetto Personalizzato");
    await expect(page.locator("#social-proof")).toContainText("Leggi su Google My Business");
    await expect(page.locator("#contact")).toContainText("Richiedi la tua Call conoscitiva");

    // 2. Clicca sul selettore lingua: Inglese (EN)
    const enButton = page.locator('nav button[aria-label="English"]:visible').first();
    await expect(enButton).toBeVisible();
    await enButton.click();
    await expect(enButton).toHaveAttribute("aria-pressed", "true");

    // 3. Verifica passaggio immediato a Inglese
    await expect(page.locator("#hero h1")).toContainText("I do not plan Weddings");
    await expect(page.locator("#about")).toContainText("Your wedding");
    await expect(page.locator("#about")).toContainText("Wedding Architect");
    await expect(page.locator("#metodo")).toContainText("How I give shape to your wedding");
    await expect(page.locator("#portfolio")).toContainText("Request a Bespoke Project");
    await expect(page.locator("#social-proof")).toContainText("Read on Google My Business");
    await expect(page.locator("#contact")).toContainText("Request your Discovery Call");
    await expect(page.locator("input[placeholder*='Names of the Couple']")).toBeVisible();

    // 4. Seleziona la 4a recensione (Alessandra Sodano) per verificare che sia tradotta
    const alessandraPill = page.locator("#social-proof button").filter({ hasText: "Alessandra Sodano" });
    await alessandraPill.scrollIntoViewIfNeeded();
    await expect(alessandraPill).toBeVisible();
    await alessandraPill.click();

    // Verifica copy recensione tradotto in inglese
    await expect(page.locator("#social-proof")).toContainText("Trusting Sara D’Angelo was the best decision");
    await expect(page.locator("#social-proof")).toContainText("Bride");
    await expect(page.locator("#social-proof")).toContainText("1 review · 1 photo");

    // 5. Verifica persistenza localStorage
    const savedLang = await page.evaluate(() => localStorage.getItem("sda_lang"));
    expect(savedLang).toBe("en");

    // 6. Ritorna in cima alla pagina tramite scroll verso Hero
    await page.locator("#hero").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const itButton = page.locator('nav button[aria-label="Italiano"]:visible').first();
    await expect(itButton).toBeVisible();
    await itButton.click();
    await expect(itButton).toHaveAttribute("aria-pressed", "true");

    // 7. Verifica ritorno immediato a Italiano
    await expect(page.locator("#hero h1")).toContainText("Non organizzo Matrimoni");
    await expect(page.locator("#about")).toContainText("Il tuo matrimonio");
    await expect(page.locator("#portfolio")).toContainText("Richiedi Progetto Personalizzato");
    await expect(page.locator("#social-proof")).toContainText("Leggi su Google My Business");
    await expect(page.locator("#social-proof")).toContainText("Affidarsi a Sara D’Angelo è stata la decisione migliore");
    await expect(page.locator("#social-proof")).toContainText("Sposa");
    await expect(page.locator("#contact")).toContainText("Richiedi la tua Call conoscitiva");

    const savedLangIt = await page.evaluate(() => localStorage.getItem("sda_lang"));
    expect(savedLangIt).toBe("it");
  });
});
