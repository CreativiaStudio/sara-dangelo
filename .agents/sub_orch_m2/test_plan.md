# Tier 1 Test Plan (Synthesized)

## Feature 1: Lead Generation Form
1. `should display the email capture form and the secondary Calendly CTA`
2. `should show required field validation errors on empty submission`
3. `should show format validation error for an invalid email address`
4. `should display a success message upon valid form submission`
5. `should successfully redirect or open the Calendly modal when clicking the secondary CTA`

## Feature 2: Media Optimization (WebP/Video)
1. `should render the hero video with autoplay, loop, and muted attributes`
2. `should load the hero video successfully without network errors`
3. `should apply loading="lazy" attribute to portfolio images`
4. `should render portfolio images using Next.js optimized srcset`
5. `should request and serve portfolio images in WebP or AVIF format`

## Feature 3: Responsive Layout & Sections
1. `desktop: should render all 5 main sections (Hero, Metodo, Portfolio, Social Proof, Funnel)`
2. `desktop: should not have horizontal scrolling overflow`
3. `mobile: should render all 5 main sections stacked correctly`
4. `mobile: should not have horizontal scrolling overflow (width <= 100vw)`
5. `mobile: should display a mobile-friendly navigation/menu`

## Feature 4: Scroll Animations (Framer Motion)
1. `should initially hide "Il Metodo" content and reveal it on scroll (opacity transition)`
2. `should reveal portfolio gallery items sequentially when scrolled into view`
3. `should reveal the Social Proof section when scrolling near the bottom of the page`
4. `should trigger a visual transformation when hovering over portfolio images`
5. `should trigger a premium hover state animation on primary CTA buttons`
