# Original User Request

## Initial Request — 2026-06-10T17:38:41Z

Sviluppo di una Landing Page in React/Next.js per Sara D'Angelo, Wedding Planner di alto livello a Napoli, finalizzata alla generazione di contatti altospendenti.

Working directory: c:/Users/mario/Progetti Antigravity/sara-dangelo
Integrity mode: development

## Requirements

### R1. Architettura e Tech Stack
- Costruire la pagina utilizzando React e Next.js (App Router preferito).
- Integrare Supabase per il salvataggio dei contatti (lead) generati dalla Landing Page.
- Preparare il progetto per il deploy su Vercel.

### R2. Posizionamento e Design Visivo (Architetto degli Eventi)
- Il copy deve posizionare Sara come "Architetto del Matrimonio". **Trovare un'headline principale molto più forte e originale** (NON usare le frasi di default dei reference). Deve trasmettere il lusso sartoriale e la sicurezza dei 18 anni di carriera.
- **Estetica e Colori**: Implementare una palette di toni neutri caldi (crema, beige, panna) con accenti oro/bronzo antico. 
- **Tipografia**: Utilizzare un font Serif elegante e lussuoso per i titoli, e un Sans-Serif pulito per i paragrafi.
- **Layout**: Impostazione "editoriale" in stile magazine di moda, con ampi spazi bianchi (negative space), lines divisorie sottili.
- **Ottimizzazione Media (CRITICO)**: Ottimizzare tutte le foto reali e i video presenti nella cartella (conversione in WebP, compressione avanzata, lazy loading) per mantenere la qualità visiva altissima senza abbattere le performance.

### R3. Struttura della Landing Page (Wireframe)
La pagina deve essere strutturata in 5 sezioni ad alto impatto:
1. **Hero Section (Effetto WOW)**: Video background in autoplay (loop, muto) che mostra i momenti più d'impatto dei matrimoni. Nuova Headline potente + Pulsante CTA primaria.
2. **Il Metodo (L'Architetto)**: Sezione pulita ed elegante che spiega il valore dei 18 anni di esperienza (approccio sartoriale + sicurezza totale contro gli imprevisti).
3. **Portfolio Selezionato**: Una galleria asimmetrica (stile editoriale, molto ariosa) con una selezione ristretta delle foto più spettacolari (es. Caruso, Bellevue Syrene). *Non servono 100 foto, ma le migliori 10-15.*
4. **Social Proof (Recensioni)**: 2 o 3 recensioni di clienti selezionati.
5. **Double Funnel (Lead Generation)**: 
   - Sezione "Lead Magnet": Modulo cattura email (collegato a Supabase) per scaricare il "Lookbook delle location esclusive".
   - Sezione Finale CTA: Calendly embed (o simile) per "Prenota la tua Call Conoscitiva".

## Acceptance Criteria

### Performance e Qualità Visiva
- [ ] Esecuzione di test (es. Lighthouse) che confermi un punteggio Performance e Best Practices > 90. Le foto ottimizzate e il video non devono penalizzare il punteggio.
- [ ] Un agente indipendente deve verificare che il design rispetti l'impostazione "magazine", risulti fluido e non si rompa sui dispositivi mobili.

### Funzionalità Core
- [ ] Test programmatico: Inviando un form dal Lead Magnet, il contatto deve risultare salvato correttamente nella tabella Supabase.
- [ ] Test programmatico: Cliccando sulla CTA per la call, il sistema deve reindirizzare correttamente al modulo senza errori.

## Follow-up — 2026-06-10T17:40:07Z

AGGIORNAMENTO DAI REQUISITI DELL'UTENTE: Per il front-end React/Next.js, è strettamente richiesto l'utilizzo della libreria 'framer-motion' per gestire tutte le animazioni (scroll reveals, page transitions, hover states). Le animazioni devono essere estremamente premium, fluide (smooth) e lussuose. Integrate questo requisito nella vostra implementazione.

## Follow-up — 2026-06-11T20:07:49Z

Rifacimento totale della Landing Page per Sara D'Angelo. L'obiettivo è stravolgere l'attuale design "statico" per creare un'esperienza ultra-premium ad altissimo impatto emotivo ("mordente"), mantenendo rigorosamente una palette chiara e luminosa (Bianco, Beige, Oro, con tocchi di Marrone caldo). Le spose devono emozionarsi dal primo istante.

Working directory: c:/Users/mario/Progetti Antigravity/sara-dangelo
Integrity mode: development

## Requirements

### R1. Architettura Visiva "Scrollytelling Emozionale"
- Abbandonare la struttura a "blocchi standard" per un layout in stile *Vogue/High Fashion*.
- Ampissimo respiro (negative space), elementi asimmetrici, foto grandi che si sovrappongono elegantemente con effetti di parallasse allo scroll.
- **Palette Inviolabile:** Sfondo bianco/panna, testi marrone caldo, accenti e dettagli grafici in Oro e Beige. ASSOLUTAMENTE NO sfondi neri o dark mode.
- Utilizzare animazioni `framer-motion` morbidissime e lente, che svelano le foto e i testi gradualmente, accompagnando la sposa in un sogno a occhi aperti.

### R2. Copywriting "Poetico ed Emozionale"
- Riscrivere tutto il copy attuale. Niente elenchi di servizi o frasi banali, niente testi lunghi che annoiano.
- Il testo deve colpire al cuore e far sognare. Ogni sezione deve sembrare la pagina di un libro illustrato sul lusso.
- Usare font Serif giganteschi ed elegantissimi per i titoli, contrastati da font Sans piccolissimi, maiuscoli e molto spaziati per i dettagli.

### R3. Utilizzo Media

- Sfruttare le immagini e il video già presenti e ottimizzati in `public/media/` per costruire questa narrazione visiva, assicurandosi che il video nella Hero non sia scurito con del nero, ma semmai fuso dolcemente con i toni del beige/oro.

## Acceptance Criteria

### Emozione e Impatto Visivo
- [ ] Il layout NON deve sembrare un sito web convenzionale (no griglie rigide 50/50), ma l'impaginazione di un prestigioso magazine cartaceo.
- [ ] Il copy della Hero section e delle sezioni successive deve puntare sull'evocazione di un'emozione forte (es. l'unicità dell'amore, la magia del giorno perfetto), non su sterili dati tecnici ("18 anni di esperienza").

### Stile e Brand
- [ ] Ispezione visiva: non esiste traccia di nero puro o grigio scuro negli sfondi o negli overlay. Tutto è luminoso, caldo e rassicurante.

## Follow-up — 2026-06-12T05:30:00Z

[RESUMING PREVIOUS WORK - FINISH THE JOB FOR CLIENT MEETING TOMORROW]
Rifacimento totale della Landing Page per Sara D'Angelo. L'obiettivo è stravolgere l'attuale design "statico" per creare un'esperienza ultra-premium ad altissimo impatto emotivo ("mordente"), mantenendo rigorosamente una palette chiara e luminosa (Bianco, Beige, Oro, con tocchi di Marrone caldo). Le spose devono emozionarsi dal primo istante. L'interfaccia di base è stata abbozzata nelle scorse ore, ora è il momento di portarla alla PERFEZIONE assoluta, completare i dettagli, rifinire il layout asimmetrico in ogni sezione e completare i test E2E.

Working directory: c:/Users/mario/Progetti Antigravity/sara-dangelo
Integrity mode: development

## Requirements

### R1. Architettura Visiva "Scrollytelling Emozionale"
- Abbandonare la struttura a "blocchi standard" per un layout in stile *Vogue/High Fashion*.
- Ampissimo respiro (negative space), elementi asimmetrici, foto grandi che si sovrappongono elegantemente con effetti di parallasse allo scroll.
- **Palette Inviolabile:** Sfondo bianco/panna, testi marrone caldo, accenti e dettagli grafici in Oro e Beige. ASSOLUTAMENTE NO sfondi neri o dark mode.
- Utilizzare animazioni `framer-motion` morbidissime e lente, che svelano le foto e i testi gradualmente, accompagnando la sposa in un sogno a occhi aperti.

### R2. Copywriting "Poetico ed Emozionale"
- Riscrivere tutto il copy attuale. Niente elenchi di servizi o frasi banali, niente testi lunghi che annoiano.
- Il testo deve colpire al cuore e far sognare. Ogni sezione deve sembrare la pagina di un libro illustrato sul lusso.
- Usare font Serif giganteschi ed elegantissimi per i titoli, contrastati da font Sans piccolissimi, maiuscoli e molto spaziati per i dettagli.

### R3. Utilizzo Media e Test E2E
- Sfruttare le immagini e il video già presenti e ottimizzati in `public/media/` per costruire questa narrazione visiva, assicurandosi che il video nella Hero non sia scurito con del nero, ma semmai fuso dolcemente con i toni del beige/oro.
- **FINALIZZARE I TEST E2E** per la sezione funnel che si erano interrotti prima del blackout delle quote, garantendo che l'acquisizione contatti funzioni perfettamente.

## Acceptance Criteria

### Emozione e Impatto Visivo
- [ ] Il layout NON deve sembrare un sito web convenzionale (no griglie rigide 50/50), ma l'impaginazione di un prestigioso magazine cartaceo.
- [ ] Il copy della Hero section e delle sezioni successive deve puntare sull'evocazione di un'emozione forte (es. l'unicità dell'amore, la magia del giorno perfetto), non su sterili dati tecnici ("18 anni di esperienza").

### Stile e Brand
- [ ] Ispezione visiva: non esiste traccia di nero puro o grigio scuro negli sfondi o negli overlay. Tutto è luminoso, caldo e rassicurante.
- [ ] L'integrazione Supabase nella sezione Funnel è completely testata e funzionante tramite script E2E.

## Follow-up — 2026-06-12T07:32:02+02:00

UPDATE: The parent agent has provided additional requirements identified by the browser research subagent for tomorrow's client meeting. Please ensure these are implemented immediately during the final styling pass:

1. Micro-interactions: Implement staggered text reveal fade-ins from bottom up. Ensure all interactive states have very smooth transitions (0.8s ease-in).
2. Typography Pairing: Use extreme contrast. Massive Serif headers (mix regular and italicized words within the same heading). Micro-sized sans-serif (12-14px) with generous letter-spacing (all-caps) for labels.
3. Whitespace & Asymmetry: Drastically increase margins/padding. Offset photography and let text blocks subtly overlap the edges of images. Eliminate any rigid boxed grids.
