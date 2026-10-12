"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Firefly {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseSpeed: number;
  hue: number; // warm green to golden-amber
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  vy: number;
  swaySpeed: number;
  swayAmplitude: number;
  swayOffset: number;
  alpha: number;
}

interface Spore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initForest();
      }, 120);
    };
    window.addEventListener("resize", handleResize);

    const isDark = theme === "dark";

    // Mouse tracking for natural interaction (wind/scare fireflies)
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Entities
    let fireflies: Firefly[] = [];
    let spores: Spore[] = [];
    let snowflakes: Snowflake[] = [];

    const initForest = () => {
      fireflies = [];
      spores = [];
      snowflakes = [];

      if (isDark) {
        // --- MODO OSCURO: BOSQUE VIVO (Luciérnagas y Esporas Bioluminiscentes) ---
        const fireflyCount = Math.min(45, Math.floor((width * height) / 28000) + 16);
        for (let i = 0; i < fireflyCount; i++) {
          const x = Math.random() * width;
          const y = Math.random() * (height * 0.85);
          fireflies.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 2.2 + 1.2,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.03 + 0.015,
            hue: Math.random() > 0.4 ? 152 : 75, // 152 = Emerald/Mint, 75 = Warm Golden Lime
          });
        }

        // Esporas de polen flotante
        const sporeCount = Math.min(35, Math.floor(width / 35));
        for (let i = 0; i < sporeCount; i++) {
          spores.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: -(Math.random() * 0.35 + 0.15), // flotan lentamente hacia arriba
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.4 + 0.2,
          });
        }
      } else {
        // --- MODO CLARO: BOSQUE DE INVIERNO (Nieve natural y cristales helados) ---
        const snowCount = Math.min(75, Math.floor((width * height) / 18000) + 25);
        for (let i = 0; i < snowCount; i++) {
          snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.8,
            vy: Math.random() * 0.9 + 0.5, // velocidad de caída suave
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayAmplitude: Math.random() * 1.8 + 0.6,
            swayOffset: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.5 + 0.4,
          });
        }
      }
    };

    initForest();

    let animId: number;
    let clock = 0;

    // Dibujar siluetas de pinos del bosque en el horizonte inferior
    const drawForestSilhouettes = (isDarkTheme: boolean) => {
      const baseY = height;
      const forestHeight = Math.min(220, height * 0.28);

      // Capa lejana de árboles
      ctx.fillStyle = isDarkTheme
        ? "rgba(6, 25, 20, 0.45)"
        : "rgba(180, 205, 205, 0.35)";

      ctx.beginPath();
      ctx.moveTo(0, baseY);
      const step = 45;
      for (let x = 0; x <= width + step; x += step) {
        const treePeak = baseY - forestHeight * (0.55 + Math.sin(x * 0.018) * 0.2);
        ctx.lineTo(x - 15, baseY - forestHeight * 0.25);
        ctx.lineTo(x, treePeak);
        ctx.lineTo(x + 15, baseY - forestHeight * 0.25);
      }
      ctx.lineTo(width, baseY);
      ctx.closePath();
      ctx.fill();

      // Capa cercana de árboles en el suelo
      ctx.fillStyle = isDarkTheme
        ? "rgba(4, 18, 14, 0.7)"
        : "rgba(150, 182, 180, 0.45)";

      ctx.beginPath();
      ctx.moveTo(0, baseY);
      const stepNear = 70;
      for (let x = -20; x <= width + stepNear; x += stepNear) {
        const treePeak = baseY - forestHeight * (0.75 + Math.cos(x * 0.015) * 0.22);
        ctx.lineTo(x - 25, baseY - forestHeight * 0.35);
        ctx.lineTo(x, treePeak);
        ctx.lineTo(x + 25, baseY - forestHeight * 0.35);
      }
      ctx.lineTo(width, baseY);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      if (isDark) {
        // ========================================================
        // 🌲 MODO OSCURO: BOSQUE VIVO
        // ========================================================

        // 1. Niebla del bosque nocturno
        const mistGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        mistGrad.addColorStop(0, "transparent");
        mistGrad.addColorStop(0.7, "rgba(5, 28, 22, 0.35)");
        mistGrad.addColorStop(1, "rgba(3, 16, 12, 0.65)");
        ctx.fillStyle = mistGrad;
        ctx.fillRect(0, height * 0.5, width, height * 0.5);

        // 2. Siluetas del bosque
        drawForestSilhouettes(true);

        // 3. Esporas bioluminiscentes flotantes
        for (let i = 0; i < spores.length; i++) {
          const sp = spores[i];
          sp.x += sp.vx + Math.sin(clock + i) * 0.2;
          sp.y += sp.vy;

          if (sp.y < 0) {
            sp.y = height + 5;
            sp.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(167, 243, 208, ${sp.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Luciérnagas vivas con pulso y aura orgánica
        for (let i = 0; i < fireflies.length; i++) {
          const f = fireflies[i];
          f.phase += f.pulseSpeed;

          // Movimiento orgánico en onda
          f.x += f.vx + Math.sin(clock * 0.8 + f.phase) * 0.35;
          f.y += f.vy + Math.cos(clock * 0.7 + f.phase) * 0.3;

          // Suave contención en pantalla
          if (f.x < -20) f.x = width + 20;
          if (f.x > width + 20) f.x = -20;
          if (f.y < -20) f.y = height * 0.85;
          if (f.y > height * 0.88) f.y = -10;

          // Reacción suave al mouse (las luciérnagas se apartan tímidamente)
          const distMouse = Math.hypot(f.x - mouseX, f.y - mouseY);
          if (distMouse < 130 && distMouse > 0) {
            const push = (130 - distMouse) / 130;
            const angle = Math.atan2(f.y - mouseY, f.x - mouseX);
            f.x += Math.cos(angle) * push * 2.2;
            f.y += Math.sin(angle) * push * 2.2;
          }

          // Intensidad de luz pulsante natural (respiración)
          const intensity = Math.max(0.08, (Math.sin(f.phase) + 1) / 2);
          const glowRadius = f.radius * (3.5 + intensity * 4);

          // Aura luminosa exterior
          const auraGrad = ctx.createRadialGradient(
            f.x, f.y, 0,
            f.x, f.y, glowRadius
          );
          if (f.hue === 152) {
            // Esmeralda / Menta viva
            auraGrad.addColorStop(0, `rgba(52, 211, 153, ${(0.6 * intensity).toFixed(2)})`);
            auraGrad.addColorStop(0.5, `rgba(16, 185, 129, ${(0.2 * intensity).toFixed(2)})`);
            auraGrad.addColorStop(1, "transparent");
          } else {
            // Oro cálido / Limoncillo
            auraGrad.addColorStop(0, `rgba(250, 204, 21, ${(0.65 * intensity).toFixed(2)})`);
            auraGrad.addColorStop(0.5, `rgba(163, 230, 53, ${(0.22 * intensity).toFixed(2)})`);
            auraGrad.addColorStop(1, "transparent");
          }

          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo brillante de la luciérnaga
          ctx.fillStyle = f.hue === 152
            ? `rgba(209, 250, 229, ${(0.9 * intensity + 0.1).toFixed(2)})`
            : `rgba(254, 240, 138, ${(0.9 * intensity + 0.1).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // ========================================================
        // ❄️ MODO CLARO: BOSQUE EN INVIERNO
        // ========================================================

        // 1. Atmósfera fría de invierno en el horizonte
        const winterMist = ctx.createLinearGradient(0, height * 0.6, 0, height);
        winterMist.addColorStop(0, "transparent");
        winterMist.addColorStop(0.7, "rgba(224, 238, 238, 0.45)");
        winterMist.addColorStop(1, "rgba(209, 230, 230, 0.7)");
        ctx.fillStyle = winterMist;
        ctx.fillRect(0, height * 0.6, width, height * 0.4);

        // 2. Siluetas de pinos nevados
        drawForestSilhouettes(false);

        // 3. Nieve cayendo con brisa suave
        for (let i = 0; i < snowflakes.length; i++) {
          const s = snowflakes[i];
          s.y += s.vy;
          // Bamboleo horizontal de brisa
          s.x += Math.sin(clock * s.swaySpeed * 10 + s.swayOffset) * s.swayAmplitude + 0.2;

          // Viento provocado por el mouse
          const distMouse = Math.hypot(s.x - mouseX, s.y - mouseY);
          if (distMouse < 100 && distMouse > 0) {
            const windForce = (100 - distMouse) / 100;
            s.x += (s.x - mouseX > 0 ? 1 : -1) * windForce * 1.8;
          }

          // Reinicio al llegar al suelo
          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 20) s.x = -10;
          if (s.x < -20) s.x = width + 10;

          // Dibujar copo de nieve suave
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          // Sutil aureola blanca en copos más grandes
          if (s.radius > 1.8) {
            ctx.fillStyle = `rgba(204, 251, 241, ${(s.alpha * 0.35).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Canvas 60 FPS: Bosque Vivo (Noche) vs Bosque en Invierno (Día) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Iluminación atmosférica ambiental sutil */}
      <div
        className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${
          isDark ? "bg-emerald-950/25" : "bg-teal-200/25"
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-colors duration-1000 ${
          isDark ? "bg-teal-950/20" : "bg-cyan-100/35"
        }`}
      />
    </div>
  );
}
