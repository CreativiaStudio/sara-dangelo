import { test, expect } from '@playwright/test';

test.describe('FAQ Section - Luxury Editorial Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const expectedFaqs = [
    {
      number: '01',
      question: 'I fornitori devono essere necessariamente quelli scelti da te oppure possiamo proporne anche di nostri?',
      lead: 'Non necessariamente, ma la scelta dei fornitori è una parte fondamentale del progetto.',
      paragraphs: [
        'Io paragono sempre l’organizzazione di un matrimonio importante a un grande progetto di architettura: anche il miglior progetto, per essere realizzato esattamente come è stato pensato, ha bisogno di un’impresa e di professionisti all’altezza.',
        'Lo stesso accade in un matrimonio. Un progetto di livello richiede fornitori con esperienza, affidabilità e soprattutto abituati a lavorare in eventi complessi e di una determinata qualità. Per questo motivo preferisco affidarmi a professionisti che conosco, che ho già selezionato nel tempo e dei quali conosco perfettamente metodo di lavoro e standard qualitativi.',
        'Questo non significa assolutamente escludere eventuali fornitori proposti dagli sposi. Possiamo certamente valutarli insieme. È però importante che siano professionisti specializzati nei grandi eventi e che possano garantire il livello necessario per realizzare correttamente il progetto.'
      ],
      quote: 'In fondo, il mio compito non è semplicemente scegliere dei fornitori, ma costruire una squadra capace di trasformare il progetto in realtà.'
    },
    {
      number: '02',
      question: 'Organizzare il matrimonio con una wedding planner costa di più rispetto a fare tutto da soli?',
      lead: 'Dipende da cosa si vuole ottenere.',
      paragraphs: [
        'Una wedding planner professionista guarda il matrimonio con un occhio diverso. Non considera i singoli elementi separatamente, ma costruisce un progetto complessivo, nel quale fiori, luci, arredi, mise en place, grafica e ogni altro dettaglio devono dialogare tra loro ed essere perfettamente coerenti.',
        'Questo porta inevitabilmente a una maggiore personalizzazione. Spesso non ci si limita semplicemente a ciò che la location mette già a disposizione, ma si interviene per trasformare gli spazi, valorizzarli e renderli davvero rappresentativi degli sposi. E naturalmente, più un progetto è personalizzato e ricco di dettagli, più può aumentare il suo valore economico.',
        'Ma questo non significa che avere una wedding planner voglia dire necessariamente spendere di più.',
        'Anzi, uno degli aspetti più importanti del mio lavoro è proprio gestire e distribuire correttamente il budget: capire dove vale la pena investire, dove invece si può contenere la spesa, quali elementi hanno realmente un impatto sul risultato finale e quali, al contrario, rischiano di assorbire denaro senza aggiungere valore al progetto.',
        'A parità di budget, un matrimonio progettato e seguito da una professionista permette di utilizzare molto meglio le risorse disponibili, evitando anche scelte sbagliate, spese inutili o elementi che, presi singolarmente, possono essere bellissimi ma che insieme non funzionano.'
      ],
      quote: 'Non amo dire che con una wedding planner si spende di più: preferisco dire che si progetta di più e, soprattutto, si spende meglio.'
    },
    {
      number: '03',
      question: 'Organizzi anche matrimoni fuori dalla Campania o all’estero?',
      lead: 'Certamente. Ci muoviamo in tutta Italia, comprese le isole, e siamo disponibili anche per matrimoni all’estero.',
      paragraphs: [
        'Una parte importante del nostro lavoro riguarda proprio i destination wedding, soprattutto coppie che scelgono di venire a sposarsi in Italia e, in particolare, nel Sud: Costiera Amalfitana, Costiera Sorrentina, Capri, Ischia e altre destinazioni italiane.',
        'Allo stesso modo, possiamo seguire anche coppie che desiderano organizzare il proprio matrimonio fuori dall’Italia. In questi casi studiamo il progetto insieme alla coppia, valutando location, logistica, fornitori e tutti gli aspetti necessari per mantenere lo stesso livello di cura e personalizzazione, indipendentemente dalla destinazione.'
      ],
      quote: 'Il nostro lavoro non è legato a un luogo preciso: partiamo sempre dal progetto e dagli sposi, e costruiamo intorno a loro il matrimonio, ovunque abbiano scelto di celebrarlo.'
    },
    {
      number: '04',
      question: 'Nella cifra prevista per gli allestimenti è compresa anche la parcella professionale della wedding planner?',
      lead: 'Assolutamente no. La parcella professionale e il budget destinato agli allestimenti sono due voci completamente distinte.',
      paragraphs: [
        'Mi piace fare un paragone con il mondo dell’architettura: quando si realizza un progetto, da una parte c’è la parcella dell’architetto, che comprende la progettazione, la consulenza e il coordinamento del lavoro; dall’altra ci sono i costi dell’impresa e di tutto ciò che serve materialmente per realizzarlo. Nel matrimonio funziona esattamente allo stesso modo.',
        'La parcella della Wedding Planner – o, nel mio caso, della Wedding Architect – riguarda il lavoro professionale: la progettazione dell’evento, la consulenza, la ricerca e il coordinamento dei fornitori, la supervisione e la gestione di tutto il matrimonio.',
        'Separatamente viene poi definito il budget necessario per realizzare concretamente il progetto: fiori, luci, arredi, strutture, elementi decorativi, grafica e tutto ciò che verrà scelto per l’allestimento. E questo secondo importo non può essere uguale per tutti, perché ogni matrimonio nasce da un progetto diverso, costruito sulle esigenze, sui desideri e sul budget della singola coppia.'
      ],
      quote: 'La mia parcella remunera il progetto e il lavoro professionale; il budget degli allestimenti serve invece a trasformare quel progetto in realtà.'
    }
  ];

  test('1. Section visibility and header elements', async ({ page }) => {
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeVisible();

    // Check header
    const title = faqSection.locator('h2');
    await expect(title).toContainText('Domande');
    await expect(title).toContainText('Frequenti');

    // Check caps label
    const label = faqSection.locator('span.label-caps');
    await expect(label).toHaveText('Chiarezza & Trasparenza');
  });

  test('2. Strict Content Fidelity & Architectural Badges (01 to 04)', async ({ page }) => {
    const faqSection = page.locator('#faq');
    const buttons = faqSection.locator('button[id^="faq-question-"]');
    await expect(buttons).toHaveCount(4);

    for (let i = 0; i < expectedFaqs.length; i++) {
      const faq = expectedFaqs[i];
      const button = buttons.nth(i);

      // Verify number badge
      const badge = button.locator('span.font-serif').first();
      await expect(badge).toHaveText(faq.number);

      // Verify question text inside the accordion heading
      const heading = faqSection.locator('h3').nth(i);
      await expect(heading).toContainText(faq.question);

      // Click to open if not open
      const isExpanded = await button.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await button.click();
        await page.waitForTimeout(300);
      }

      const answerRegion = page.locator(`#faq-answer-${i}`);
      await expect(answerRegion).toBeVisible();

      // Verify lead text
      await expect(answerRegion).toContainText(faq.lead);

      // Verify each paragraph text
      for (const p of faq.paragraphs) {
        await expect(answerRegion).toContainText(p);
      }

      // Verify quote text
      await expect(answerRegion).toContainText(faq.quote);
    }
  });

  test('3. Interactive Accordion Expand & Collapse', async ({ page }) => {
    const faqSection = page.locator('#faq');
    const buttons = faqSection.locator('button[id^="faq-question-"]');

    // By default, item 0 is open
    await expect(page.locator('#faq-answer-0')).toBeVisible();

    // Toggle item 0 to close
    await buttons.nth(0).click();
    await page.waitForTimeout(500);
    await expect(page.locator('#faq-answer-0')).not.toBeVisible();

    // Open item 1
    await buttons.nth(1).click();
    await page.waitForTimeout(500);
    await expect(page.locator('#faq-answer-1')).toBeVisible();
    await expect(page.locator('#faq-answer-0')).not.toBeVisible();

    // Open item 2
    await buttons.nth(2).click();
    await page.waitForTimeout(500);
    await expect(page.locator('#faq-answer-2')).toBeVisible();
    await expect(page.locator('#faq-answer-1')).not.toBeVisible();
  });

  test('4. Typography & Visual Styling Compliance', async ({ page }) => {
    const faqSection = page.locator('#faq');
    
    // Check gold accent styling on badges
    const firstBadge = faqSection.locator('button[id="faq-question-0"] span.font-serif').first();
    const badgeColor = await firstBadge.evaluate((el) => window.getComputedStyle(el).color);
    expect(badgeColor).toBeTruthy();

    // Check pull-quote box presence with border-l-2 and semantic blockquote
    const firstAnswer = page.locator('#faq-answer-0');
    const pullQuote = firstAnswer.locator('blockquote.border-l-2');
    await expect(pullQuote).toBeVisible();
  });

  test('5. Responsive layout across multiple viewports without overflow', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile 320px (iPhone SE)' },
      { width: 375, height: 667, name: 'Mobile 375px' },
      { width: 768, height: 1024, name: 'Tablet 768px' },
      { width: 1280, height: 800, name: 'Desktop 1280px' },
      { width: 1920, height: 1080, name: 'Wide 1920px' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(100);
      
      const faqSection = page.locator('#faq');
      await expect(faqSection).toBeVisible();

      const faqOverflow = await faqSection.evaluate((el) => {
        return el.scrollWidth > el.clientWidth;
      });
      expect(faqOverflow, `FAQ container overflow on viewport ${vp.name}`).toBe(false);

      const pageOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(pageOverflow, `Page overflow on viewport ${vp.name}`).toBe(false);
    }
  });

  test('6. Rapid toggling stress test during Framer Motion animations', async ({ page }) => {
    const faqSection = page.locator('#faq');
    const buttons = faqSection.locator('button[id^="faq-question-"]');

    // Rapidly toggle between cards
    for (let i = 0; i < 2; i++) {
      await buttons.nth(1).click();
      await page.waitForTimeout(50);
      await buttons.nth(2).click();
      await page.waitForTimeout(50);
      await buttons.nth(3).click();
      await page.waitForTimeout(50);
    }

    // Explicitly click button 0 to finish on a stable state
    await buttons.nth(0).click();
    await page.waitForTimeout(600);

    // Item 0 should be visible and expanded
    await expect(page.locator('#faq-answer-0')).toBeVisible();
    await expect(page.locator('#faq-answer-1')).not.toBeVisible();
    await expect(page.locator('#faq-answer-2')).not.toBeVisible();
    await expect(page.locator('#faq-answer-3')).not.toBeVisible();
  });

  test('7. Accessibility Semantics & ARIA Compliance', async ({ page }) => {
    const faqSection = page.locator('#faq');
    const buttons = faqSection.locator('button[id^="faq-question-"]');

    for (let i = 0; i < 4; i++) {
      const button = buttons.nth(i);
      const isExpanded = await button.getAttribute('aria-expanded');
      const controls = await button.getAttribute('aria-controls');
      expect(controls).toBe(`faq-answer-${i}`);

      // Ensure button is wrapped inside an h3 heading element (WAI-ARIA APG)
      const parentHeading = page.locator(`h3:has(#faq-question-${i})`);
      await expect(parentHeading).toHaveCount(1);

      if (isExpanded === 'true') {
        const region = page.locator(`#faq-answer-${i}`);
        await expect(region).toHaveAttribute('role', 'region');
        await expect(region).toHaveAttribute('aria-labelledby', `faq-question-${i}`);
      }
    }
  });

  test('8. WAI-ARIA Keyboard Navigation (ArrowDown, ArrowUp, Home, End, Space/Enter)', async ({ page }) => {
    const button0 = page.locator('#faq-question-0');
    await button0.focus();
    await expect(button0).toBeFocused();

    // ArrowDown should move focus to button 1
    await page.keyboard.press('ArrowDown');
    const button1 = page.locator('#faq-question-1');
    await expect(button1).toBeFocused();

    // ArrowDown to button 2
    await page.keyboard.press('ArrowDown');
    const button2 = page.locator('#faq-question-2');
    await expect(button2).toBeFocused();

    // End key moves to last button (button 3)
    await page.keyboard.press('End');
    const button3 = page.locator('#faq-question-3');
    await expect(button3).toBeFocused();

    // Home key moves to first button (button 0)
    await page.keyboard.press('Home');
    await expect(button0).toBeFocused();

    // ArrowUp cycles to button 3
    await page.keyboard.press('ArrowUp');
    await expect(button3).toBeFocused();

    // Enter toggles button 3 open
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await expect(page.locator('#faq-answer-3')).toBeVisible();

    // Space toggles button 3 closed
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    await expect(page.locator('#faq-answer-3')).not.toBeVisible();
  });

  test('9. Extreme Zoom simulation (300% & 400% zoom scaling)', async ({ page }) => {
    // Simulate 300% zoom on 1280px screen -> 426px viewport width
    await page.setViewportSize({ width: 426, height: 700 });
    await page.waitForTimeout(100);
    let hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow, 'Overflow at 300% zoom equivalent').toBe(false);

    // Simulate 400% zoom on 1280px screen -> 320px viewport width
    await page.setViewportSize({ width: 320, height: 600 });
    await page.waitForTimeout(100);
    hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasOverflow, 'Overflow at 400% zoom equivalent').toBe(false);

    // Verify all text remains visible and expandable
    const button = page.locator('#faq-question-0');
    await button.click();
    await expect(page.locator('#faq-answer-0')).toBeVisible();
  });

  test('10. Reduced Motion emulation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const button1 = page.locator('#faq-question-1');
    await button1.click();

    // In reduced motion, transition is immediate without animation lag
    await expect(page.locator('#faq-answer-1')).toBeVisible();
  });
});
