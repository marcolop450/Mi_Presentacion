"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export default function MouseFollower() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Verificar si el dispositivo es táctil o tiene movimiento reducido
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

    // Coordenadas actuales del cursor
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let lastX = -100;
    let lastY = -100;

    let isVisible = false;
    let animId: number;

    const trail: TrailPoint[] = [];
    const maxTrailPoints = 25;
    const sparks: Spark[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        currentX = targetX;
        currentY = targetY;
        isVisible = true;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const isDark = theme === "dark";
    const primaryColor = isDark ? "#00F0FF" : "#0284C7";
    const secondaryColor = isDark ? "#0066FF" : "#2563EB";

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Interpolación suave del punto principal (spring physics)
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * 0.45;
        currentY += dy * 0.45;

        // Calcular velocidad de movimiento
        const speed = Math.hypot(currentX - lastX, currentY - lastY);
        lastX = currentX;
        lastY = currentY;

        // Agregar punto a la cola con la posición actual
        trail.unshift({ x: currentX, y: currentY, age: 0 });

        // Longitud dinámica de la cola: crece según la velocidad del movimiento
        const dynamicLength = Math.min(
          maxTrailPoints,
          Math.max(6, Math.floor(speed * 1.8) + 8)
        );

        if (trail.length > dynamicLength) {
          trail.length = dynamicLength;
        }

        // Generar chispas / partículas cuando el movimiento es rápido
        if (speed > 8 && Math.random() > 0.4) {
          sparks.push({
            x: currentX + (Math.random() - 0.5) * 6,
            y: currentY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 2 - (dx * 0.08),
            vy: (Math.random() - 0.5) * 2 - (dy * 0.08),
            alpha: 1,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? primaryColor : "#FFFFFF",
          });
        }

        // 1. Dibujar la cola elástica que se estira y adelgaza hacia la punta
        if (trail.length > 2) {
          for (let i = 0; i < trail.length - 1; i++) {
            const p1 = trail[i];
            const p2 = trail[i + 1];
            const ratio = 1 - i / trail.length;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Ancho que decrece hacia el extremo de la cola
            ctx.lineWidth = Math.max(1, ratio * 6.5);
            ctx.lineCap = "round";

            // Gradiente de transparencia y color
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(${isDark ? "0, 240, 255" : "2, 132, 199"}, ${ratio * 0.85})`);
            grad.addColorStop(1, `rgba(${isDark ? "0, 102, 255" : "37, 99, 235"}, ${ratio * 0.15})`);

            ctx.strokeStyle = grad;
            ctx.stroke();
          }
        }

        // 2. Dibujar las micro-chispas del cometa
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.alpha -= 0.04;

          if (s.alpha <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 3. Dibujar el punto principal (Cabeza con resplandor radiante)
        // Aura exterior
        const auraGrad = ctx.createRadialGradient(
          currentX, currentY, 0,
          currentX, currentY, 14
        );
        auraGrad.addColorStop(0, isDark ? "rgba(0, 240, 255, 0.6)" : "rgba(2, 132, 199, 0.4)");
        auraGrad.addColorStop(0.5, isDark ? "rgba(0, 102, 255, 0.25)" : "rgba(37, 99, 235, 0.15)");
        auraGrad.addColorStop(1, "transparent");

        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo brillante
        ctx.fillStyle = isDark ? "#FFFFFF" : "#003B99";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Anillo de pulso fino
        ctx.strokeStyle = isDark ? "#00F0FF" : "#0284C7";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5.5, 0, Math.PI * 2);
        ctx.stroke();
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
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
}
