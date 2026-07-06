"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [shouldBeWhite, setShouldBeWhite] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Rileva se stiamo passando sopra un'immagine o una sezione scura
      const themeElement = target.closest('[data-theme="dark"], [data-theme="light"]');
      const isDarkTheme = themeElement?.getAttribute('data-theme') === 'dark';

      if (
        target.tagName.toLowerCase() === "img" || 
        target.closest("img") ||
        isDarkTheme
      ) {
        setShouldBeWhite(true);
      } else {
        setShouldBeWhite(false);
      }

      // Seleziona elementi cliccabili
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full border pointer-events-none z-[9999] flex items-center justify-center"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHovering ? 2 : 1,
        borderColor: shouldBeWhite ? "#FFFFFF" : "#8C6D46",
        backgroundColor: shouldBeWhite ? (isHovering ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)") : (isHovering ? "rgba(140, 109, 70, 0.15)" : "transparent"),
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <motion.div 
        className="w-1 h-1 rounded-full"
        animate={{
          opacity: isHovering && !shouldBeWhite ? 0 : 1,
          backgroundColor: shouldBeWhite ? "#FFFFFF" : "#8C6D46"
        }}
      />
    </motion.div>
  );
}
