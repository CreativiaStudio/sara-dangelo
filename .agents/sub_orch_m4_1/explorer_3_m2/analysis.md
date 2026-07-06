# Framer Motion Architecture Analysis

## Overview
This analysis defines the exact Framer Motion architecture for `MethodSection.tsx` and `PortfolioSection.tsx` to achieve a "slow, luxurious reveal" scrollytelling effect. This incorporates the parallax recommendations from Explorers 1 and 2.

## Global Animation Primitives
The core of the "High Fashion magazine-style" experience relies on very slow durations and a specific custom easing curve that starts fast and ends extremely slowly.
- **Easing**: `[0.16, 1, 0.3, 1]` (custom cubic-bezier)
- **Durations**: Between `1.6s` and `2.0s`.

### Reveal Variants (for text and static images)
```javascript
const slowReveal = {
  hidden: { opacity: 0, y: 80 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

const imageReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 2.0, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};
```

## MethodSection Architecture
Explorer 1 recommended a 3-act narrative with extreme vertical spacing and a drifting scroll effect.
- **Hook**: Use `useScroll` attached to a `useRef` wrapping the entire section or individual block wrappers to track scroll progress.
- **Transform**: Implement `useTransform` to create subtle parallax for the massive serif numerals (I, II, III).
  ```javascript
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  // Slow parallax upward for numerals
  const yNumeral = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  // Even slower drift for text blocks
  const yText = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  ```
- Use `<motion.div variants={slowReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>` for the text blocks to fade in as they enter the viewport.

## PortfolioSection Architecture
Explorer 2 recommended a vertically spaced, flex-based asymmetric layout with parallax overlapping.
- **Hook**: When the accordion expands, the gallery becomes visible. Attach a `ref` to the gallery container and use `useScroll`.
  ```javascript
  const galleryRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });
  ```
- **Transform**: Map over the images and apply different vertical speed multipliers based on their index to create the asymmetrical parallax overlap.
  ```javascript
  // Inside the map loop for images
  // For example, even indexes move faster upward than odd indexes
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, i % 2 === 0 ? -150 : -50]);
  ```
- **Wrapper**: Wrap each `<img />` in a `<motion.div style={{ y: yParallax }}>` that also has `variants={imageReveal}` and `whileInView="visible"`.

## ESLint Rules & Code Quality (CRITICAL)
- **Unescaped Quotes**: Do not use unescaped single or double quotes in JSX text. E.g., `L'Attesa` must be `L&apos;Attesa`. `Sposati a ...` should be careful with quotes.
- **Unused Variables**: Ensure all imported hooks (`useScroll`, `useTransform`, `useRef`, `motion`) are actually used. Remove any leftover imports or unused variables.
