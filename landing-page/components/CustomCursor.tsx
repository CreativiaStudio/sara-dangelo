"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Brand & visual constants                                                  */
/* -------------------------------------------------------------------------- */

const ACCENT_GOLD = "#8C6D46";
const ACCENT_WHITE = "#FFFFFF";

const RING_SIZE = 32;
const RING_HOVER_SCALE = 1.9;

const DOT_SIZE = 4;
const DOT_HOVER_SCALE = 0.5;

/* -------------------------------------------------------------------------- */
/*  Zero-reflow selectors (no getComputedStyle, ever)                         */
/* -------------------------------------------------------------------------- */

/** Anything the browser treats as clickable / interactive. */
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  "input",
  "select",
  "textarea",
  "label",
  "[data-cursor-hover]",
  ".cursor-pointer",
].join(",");

/** Anything that requires the cursor to flip to the light (white) accent. */
const THEME_SELECTOR = ["img", '[data-theme="dark"]', "#hero"].join(",");

/* -------------------------------------------------------------------------- */
/*  Motion configs                                                            */
/* -------------------------------------------------------------------------- */

/** Ultra-reactive spring — the outer ring stays glued to the pointer while
 *  still giving it a subtle, premium elastic feel. */
const RING_SPRING = {
  stiffness: 800,
  damping: 35,
  mass: 0.1,
} as const;

/** Snappy spring used for hover / scale transitions. */
const UI_SPRING = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
  mass: 0.6,
};

/** Fast tween for color / opacity transitions. */
const COLOR_TWEEN = { duration: 0.18, ease: "easeOut" as const };

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [onDark, setOnDark] = useState(false);

  /** Kept in a ref so the hot `mousemove` path never touches React state twice. */
  const visibleRef = useRef(false);

  /* Raw pointer coordinates — updated on every mousemove WITHOUT React
     re-renders (they live in MotionValues, not useState). */
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  /* Spring-smoothed coordinates for the outer ring only. */
  const ringX = useSpring(mouseX, RING_SPRING);
  const ringY = useSpring(mouseY, RING_SPRING);

  /* ---- Enable only on fine-pointer devices (skip touch/coarse) ---------- */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  /* ---- Global listeners (passive where possible) ------------------------ */
  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      // Pure MotionValue writes: no re-render, no layout read.
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;

      // `Element.closest` is a native tree walk — no style resolution, no reflow.
      setHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
      setOnDark(Boolean(target.closest(THEME_SELECTOR)));
    };

    const handleHide = () => {
      if (!visibleRef.current) return;
      visibleRef.current = false;
      setVisible(false);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    window.addEventListener("blur", handleHide);
    document.addEventListener("mouseleave", handleHide);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("blur", handleHide);
      document.removeEventListener("mouseleave", handleHide);
    };
  }, [enabled, mouseX, mouseY]);

  /* ---- Never render on touch devices ----------------------------------- */
  if (!enabled) return null;

  const accent = onDark ? ACCENT_WHITE : ACCENT_GOLD;
  const ringFill = hovering
    ? onDark
      ? "rgba(255, 255, 255, 0.18)"
      : "rgba(140, 109, 70, 0.18)"
    : "rgba(0, 0, 0, 0)";

  return (
    <>
      {/* -------------------------------- RING ------------------------------- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          boxSizing: "border-box",
          borderWidth: 1,
          borderStyle: "solid",
          willChange: "transform, opacity, border-color, background-color",
        }}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? RING_HOVER_SCALE : 1,
          borderColor: accent,
          backgroundColor: ringFill,
        }}
        transition={{
          opacity: COLOR_TWEEN,
          scale: UI_SPRING,
          borderColor: COLOR_TWEEN,
          backgroundColor: COLOR_TWEEN,
        }}
      />

      {/* --------------------------------- DOT ------------------------------- */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
        style={{
          // Same MotionValues as the ring, but WITHOUT the spring:
          // the inner dot stays pixel-crisp on the hardware cursor.
          x: mouseX,
          y: mouseY,
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          boxSizing: "border-box",
          willChange: "transform, opacity, background-color",
        }}
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: hovering ? DOT_HOVER_SCALE : 1,
          backgroundColor: accent,
        }}
        transition={{
          opacity: COLOR_TWEEN,
          scale: UI_SPRING,
          backgroundColor: COLOR_TWEEN,
        }}
      />
    </>
  );
}
