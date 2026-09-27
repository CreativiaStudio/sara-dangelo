'use client';

import { useEffect, useRef } from 'react';

/* -------------------------------------------------------------------------- */
/*  Luxury cursor ring — a fluid trailing follower.                           */
/*                                                                            */
/*  The native OS pointer is left untouched (restored in globals.css) so it   */
/*  stays at 0ms / native refresh rate; this ring is a purely decorative      */
/*  follower rendered above the video. It keeps ZERO React state in the hot   */
/*  loop and self-pauses its RAF when it comes to rest (0% idle CPU).         */
/* -------------------------------------------------------------------------- */

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'select',
  'textarea',
  'label',
  'summary',
  '[data-cursor="hover"]',
  '.cursor-pointer',
].join(',');

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;

    // Only run on precise pointers that can actually hover.
    if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---- State (plain locals — never React state, never a re-render) ------
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let targetScale = 1;
    let currentScale = 1;
    let isHovered = false;

    let rafId: number | null = null;

    // ---- RAF tick --------------------------------------------------------
    const tick = () => {
      const factor = reducedMotion.matches ? 1 : 0.18;

      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;
      currentScale += (targetScale - currentScale) * 0.16;

      const settled =
        Math.hypot(targetX - currentX, targetY - currentY) < 0.05 &&
        Math.abs(targetScale - currentScale) < 0.002;

      if (settled) {
        // Snap to the exact target and stop: 0% CPU while idle.
        currentX = targetX;
        currentY = targetY;
        currentScale = targetScale;
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
        rafId = null;
        return;
      }

      ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
      rafId = requestAnimationFrame(tick);
    };

    // ---- Lazily (re)start the loop only when there is work to do ---------
    const ensureLoop = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    // ---- Listeners -------------------------------------------------------
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      ring.style.opacity = '1';
      ensureLoop();
    };

    const onMouseOver = (e: MouseEvent) => {
      const isInteractive =
        e.target instanceof Element &&
        e.target.closest(INTERACTIVE_SELECTOR) !== null;

      if (isInteractive !== isHovered) {
        isHovered = isInteractive;
        ring.setAttribute('data-hover', isInteractive ? '1' : '0');
        targetScale = isInteractive ? 1.65 : 1;
        ensureLoop();
      }
    };

    const onMouseDown = () => {
      targetScale = 0.85;
      ensureLoop();
    };

    const onMouseUp = () => {
      targetScale = isHovered ? 1.65 : 1;
      ensureLoop();
    };

    const onHide = () => {
      ring.style.opacity = '0';
    };

    const onShow = () => {
      ring.style.opacity = '1';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('blur', onHide);
    document.addEventListener('mouseleave', onHide);
    document.addEventListener('mouseenter', onShow);

    // ---- Cleanup ---------------------------------------------------------
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onHide);
      document.removeEventListener('mouseleave', onHide);
      document.removeEventListener('mouseenter', onShow);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
