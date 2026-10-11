"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface TrailPoint {
  x: number;
  y: number;
}

export default function MouseFollower() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Disable on touch devices or if user prefers reduced motion
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isCoarse || prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Cursor position tracking
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let lastX = -100;
    let lastY = -100;

    let isVisible = false;
    let animId: number;

    const trail: TrailPoint[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        currentX = targetX;
        currentY = targetY;
        lastX = targetX;
        lastY = targetY;
        isVisible = true;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      trail.length = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const isDark = theme === "dark";
    // Tropical Mint (#2DD4BF) for dark mode, Tropical Teal (#0D9488) for light mode
    const headColor = isDark ? "#2dd4bf" : "#0d9488";
    const rgbBase = isDark ? "45, 212, 191" : "13, 148, 136";
    const headRadius = 3;
    const maxHeadDiameter = headRadius * 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Fluid spring interpolation with lower constant (0.15)
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.15;
        currentY += dy * 0.15;

        // Velocity computation
        const speed = Math.hypot(currentX - lastX, currentY - lastY);
        lastX = currentX;
        lastY = currentY;

        // Record point in trail
        trail.unshift({ x: currentX, y: currentY });

        // Tail length grows proportional to velocity (minimum 1, max 24)
        const targetLength = Math.min(24, Math.max(1, Math.round(speed * 1.8)));

        if (trail.length > targetLength) {
          // Graceful shrinkage when decelerating/stopping
          const trimCount = Math.max(1, Math.ceil((trail.length - targetLength) * 0.3));
          trail.splice(trail.length - trimCount, trimCount);
        }

        // Render smooth bezier curve tail tapering from head width to 0
        if (trail.length >= 2) {
          for (let i = 0; i < trail.length - 1; i++) {
            const pCurrent = trail[i];
            const pNext = trail[i + 1];
            const pAfter = trail[i + 2] || pNext;

            const midX = (pNext.x + pAfter.x) / 2;
            const midY = (pNext.y + pAfter.y) / 2;

            const progress = i / Math.max(1, trail.length - 1);
            const lineWidth = Math.max(0.4, (1 - progress) * (maxHeadDiameter - 0.5));
            const alpha = Math.max(0.04, (1 - progress) * (isDark ? 0.6 : 0.5));

            ctx.beginPath();
            ctx.moveTo(pCurrent.x, pCurrent.y);
            ctx.quadraticCurveTo(pNext.x, pNext.y, midX, midY);
            ctx.strokeStyle = `rgba(${rgbBase}, ${alpha.toFixed(3)})`;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
          }
        }

        // Render solid head dot (3px radius, no glow, no ring, no aura)
        ctx.fillStyle = headColor;
        ctx.beginPath();
        ctx.arc(currentX, currentY, headRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    />
  );
}
