"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export default function MouseFollower() {
  const { theme } = useTheme();
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar soporte de puntero y preferencia de movimiento reducido
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isCoarse || prefersReduced) {
      setReducedMotion(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (reducedMotion || !isVisible) return null;

  const isDark = theme === "dark";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="w-[420px] h-[420px] rounded-full blur-3xl will-change-transform"
        style={{
          transform: `translate3d(${position.x - 210}px, ${position.y - 210}px, 0)`,
          background: isDark
            ? "radial-gradient(circle, rgba(0, 163, 255, 0.12) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, rgba(59, 130, 246, 0.03) 45%, transparent 70%)",
        }}
      />
    </div>
  );
}
