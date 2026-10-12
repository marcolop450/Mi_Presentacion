"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  pulseSpeed: number;
  hue: number; // 152 = Emerald/Mint, 55 = Warm Amber/Gold
  depth: number; // 0 = far, 1 = mid, 2 = foreground bokeh
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  vy: number;
  swaySpeed: number;
  swayAmp: number;
  swayOffset: number;
  alpha: number;
  depth: number;
}

interface Spore {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface PineTree {
  x: number;
  height: number;
  width: number;
  tiers: number;
  swaySpeed: number;
  swayOffset: number;
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

    // Mouse tracking for organic interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let prevMouseX = -1000;
    let mouseSpeed = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseSpeed = Math.hypot(mouseX - prevMouseX);
      prevMouseX = mouseX;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Arrays de entidades
    let fireflies: Firefly[] = [];
    let spores: Spore[] = [];
    let snowflakes: Snowflake[] = [];
    let stars: Star[] = [];
    let distantTrees: PineTree[] = [];
    let midTrees: PineTree[] = [];
    let nearTrees: PineTree[] = [];

    // Generar árbol de pino estilizado y orgánico
    const createPine = (x: number, baseHeight: number, widthRatio: number): PineTree => ({
      x,
      height: baseHeight * (0.8 + Math.random() * 0.4),
      width: baseHeight * widthRatio * (0.85 + Math.random() * 0.3),
      tiers: Math.floor(Math.random() * 2) + 3, // 3 a 4 niveles de ramas
      swaySpeed: 0.6 + Math.random() * 0.8,
      swayOffset: Math.random() * Math.PI * 2,
    });

    const initForest = () => {
      fireflies = [];
      spores = [];
      snowflakes = [];
      stars = [];
      distantTrees = [];
      midTrees = [];
      nearTrees = [];

      // 1. Estrellas en el cielo superior (solo modo oscuro)
      if (isDark) {
        const starCount = Math.min(60, Math.floor(width / 25));
        for (let i = 0; i < starCount; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.55),
            radius: Math.random() * 1.3 + 0.4,
            alpha: Math.random() * 0.7 + 0.2,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }

      // 2. Capas de árboles (Árboles lejanos, medios y cercanos)
      // Ajustados para que no sean murallas altas que tapen el texto central
      const forestBaseHeight = Math.min(130, height * 0.16);

      // Capa distante (montículos y pinos lejanos)
      const distCount = Math.ceil(width / 38) + 3;
      for (let i = -1; i < distCount; i++) {
        distantTrees.push(createPine(i * 38 + (Math.random() - 0.5) * 15, forestBaseHeight * 0.65, 0.45));
      }

      // Capa media
      const midCount = Math.ceil(width / 55) + 3;
      for (let i = -1; i < midCount; i++) {
        midTrees.push(createPine(i * 55 + (Math.random() - 0.5) * 20, forestBaseHeight * 0.85, 0.52));
      }

      // Capa cercana (más detallada)
      const nearCount = Math.ceil(width / 80) + 3;
      for (let i = -1; i < nearCount; i++) {
        nearTrees.push(createPine(i * 80 + (Math.random() - 0.5) * 30, forestBaseHeight, 0.58));
      }

      if (isDark) {
        // --- MODO OSCURO: BOSQUE VIVO (Luciérnagas con 3 planos de profundidad) ---
        const fireflyCount = Math.min(48, Math.floor((width * height) / 26000) + 18);
        for (let i = 0; i < fireflyCount; i++) {
          const depth = Math.random() > 0.8 ? 2 : Math.random() > 0.35 ? 1 : 0;
          fireflies.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.9),
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.3,
            radius: depth === 2 ? Math.random() * 2.8 + 2.2 : depth === 1 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.0 + 0.6,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.025 + 0.012,
            hue: Math.random() > 0.35 ? 152 : 55, // Esmeralda / Menta y Oro Cálido
            depth,
          });
        }

        // Esporas de polen bioluminiscentes
        const sporeCount = Math.min(32, Math.floor(width / 40));
        for (let i = 0; i < sporeCount; i++) {
          spores.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.3 + 0.12),
            radius: Math.random() * 1.4 + 0.5,
            alpha: Math.random() * 0.35 + 0.15,
          });
        }
      } else {
        // --- MODO CLARO: BOSQUE EN INVIERNO (Nieve con paralaje en 3 planos) ---
        const snowCount = Math.min(75, Math.floor((width * height) / 16000) + 25);
        for (let i = 0; i < snowCount; i++) {
          const depth = Math.random() > 0.8 ? 2 : Math.random() > 0.4 ? 1 : 0;
          snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: depth === 2 ? Math.random() * 2.8 + 2.0 : depth === 1 ? Math.random() * 1.8 + 1.0 : Math.random() * 1.0 + 0.5,
            vy: depth === 2 ? Math.random() * 1.2 + 0.9 : depth === 1 ? Math.random() * 0.8 + 0.5 : Math.random() * 0.5 + 0.3,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayAmp: depth === 2 ? 2.2 : 1.4,
            swayOffset: Math.random() * Math.PI * 2,
            alpha: depth === 2 ? 0.85 : depth === 1 ? 0.6 : 0.35,
            depth,
          });
        }
      }
    };

    initForest();

    let animId: number;
    let clock = 0;

    // Dibuja un pino con niveles de follaje orgánicos y balanceo de viento
    const drawOrganicPine = (
      tree: PineTree,
      baseY: number,
      fillColor: string,
      snowHighlight: boolean,
      windSway: number
    ) => {
      const sway = Math.sin(clock * tree.swaySpeed + tree.swayOffset) * 4 + windSway * 6;
      const topX = tree.x + sway;
      const topY = baseY - tree.height;
      const halfW = tree.width / 2;

      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.beginPath();

      // Pico superior
      ctx.moveTo(topX, topY);

      // Niveles de ramas hacia abajo por el lado derecho
      const tiers = tree.tiers;
      const tierH = tree.height / tiers;

      for (let t = 1; t <= tiers; t++) {
        const tierProgress = t / tiers;
        const currentW = halfW * tierProgress;
        const currentTierY = topY + tierH * t;
        const indentY = currentTierY - tierH * 0.3;
        const indentW = currentW * 0.65;

        const currentX = tree.x + (sway * (1 - tierProgress * 0.6));

        // Curva convexa suave de follaje
        ctx.quadraticCurveTo(
          currentX + currentW * 0.7,
          currentTierY - tierH * 0.4,
          currentX + currentW,
          currentTierY
        );

        if (t < tiers) {
          ctx.lineTo(currentX + indentW, indentY);
        }
      }

      // Base del árbol en el suelo
      ctx.lineTo(tree.x + 3, baseY);
      ctx.lineTo(tree.x - 3, baseY);

      // Lado izquierdo subiendo
      for (let t = tiers; t >= 1; t--) {
        const tierProgress = t / tiers;
        const currentW = halfW * tierProgress;
        const currentTierY = topY + tierH * t;
        const indentY = currentTierY - tierH * 0.3;
        const indentW = currentW * 0.65;

        const currentX = tree.x + (sway * (1 - tierProgress * 0.6));

        if (t < tiers) {
          ctx.lineTo(currentX - indentW, indentY);
        }

        ctx.quadraticCurveTo(
          currentX - currentW * 0.7,
          currentTierY - tierH * 0.4,
          currentX - currentW,
          currentTierY
        );
      }

      ctx.closePath();
      ctx.fill();

      // Si es invierno, agregar escarcha en las puntas superiores de las ramas
      if (snowHighlight) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.arc(topX, topY + 4, 3, 0, Math.PI * 2);
        for (let t = 1; t <= tiers; t++) {
          const tierProgress = t / tiers;
          const currentW = halfW * tierProgress;
          const currentTierY = topY + tierH * t;
          const currentX = tree.x + (sway * (1 - tierProgress * 0.6));
          ctx.moveTo(currentX + currentW, currentTierY);
          ctx.arc(currentX + currentW, currentTierY, 2, 0, Math.PI * 2);
          ctx.moveTo(currentX - currentW, currentTierY);
          ctx.arc(currentX - currentW, currentTierY, 2, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.restore();
    };

    const render = () => {
      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Viento global suave que acaricia el bosque
      const globalWind = Math.sin(clock * 0.5) * 0.8;

      // Suelo del bosque anclado en la parte inferior
      const baseY = height + 4;

      if (isDark) {
        // ========================================================
        // 🌲 MODO OSCURO: BOSQUE VIVO
        // ========================================================

        // 1. Estrellas tenues en el cielo nocturno
        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          const twinkle = (Math.sin(clock * st.twinkleSpeed * 10 + st.phase) + 1) / 2;
          const alpha = st.alpha * (0.4 + twinkle * 0.6);
          ctx.fillStyle = `rgba(209, 250, 229, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Colinas lejanas y siluetas distantes (Capa 1)
        ctx.fillStyle = "rgba(4, 20, 16, 0.4)";
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(5, 26, 21, 0.35)", false, globalWind * 0.4);
        }

        // 3. Bruma nocturna entre capas de árboles
        const midMist = ctx.createLinearGradient(0, baseY - 120, 0, baseY);
        midMist.addColorStop(0, "transparent");
        midMist.addColorStop(0.6, "rgba(5, 24, 19, 0.35)");
        midMist.addColorStop(1, "rgba(3, 14, 11, 0.75)");
        ctx.fillStyle = midMist;
        ctx.fillRect(0, baseY - 120, width, 120);

        // 4. Capa media de árboles (Capa 2)
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(4, 28, 22, 0.55)", false, globalWind * 0.7);
        }

        // 5. Capa cercana de árboles (Capa 3)
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(3, 20, 15, 0.75)", false, globalWind);
        }

        // 6. Esporas bioluminiscentes flotantes
        for (let i = 0; i < spores.length; i++) {
          const sp = spores[i];
          sp.x += sp.vx + Math.sin(clock * 1.5 + i) * 0.3;
          sp.y += sp.vy;

          if (sp.y < 0) {
            sp.y = height + 10;
            sp.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(167, 243, 208, ${sp.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // 7. Luciérnagas vivas con física orgánica y halos de luz
        for (let i = 0; i < fireflies.length; i++) {
          const f = fireflies[i];
          f.phase += f.pulseSpeed;

          // Movimiento orgánico ondulante
          f.x += f.vx + Math.sin(clock * 0.9 + f.phase) * 0.45;
          f.y += f.vy + Math.cos(clock * 0.7 + f.phase) * 0.35;

          // Límites de pantalla suaves
          if (f.x < -30) f.x = width + 30;
          if (f.x > width + 30) f.x = -30;
          if (f.y < -30) f.y = height * 0.88;
          if (f.y > height * 0.9) f.y = -10;

          // Reacción al cursor del ratón (se apartan con gracia)
          const distMouse = Math.hypot(f.x - mouseX, f.y - mouseY);
          if (distMouse < 140 && distMouse > 0) {
            const push = (140 - distMouse) / 140;
            const angle = Math.atan2(f.y - mouseY, f.x - mouseX);
            f.x += Math.cos(angle) * push * 2.8;
            f.y += Math.sin(angle) * push * 2.8;
          }

          // Intensidad de pulsación lumínica
          const pulse = (Math.sin(f.phase) + 1) / 2;
          const intensity = Math.max(0.12, pulse);
          const glowR = f.radius * (3.8 + intensity * 4.2);

          // Halos bioluminiscentes suaves
          const aura = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
          if (f.hue === 152) {
            // Menta / Esmeralda viva
            aura.addColorStop(0, `rgba(52, 211, 153, ${(0.65 * intensity).toFixed(2)})`);
            aura.addColorStop(0.4, `rgba(16, 185, 129, ${(0.22 * intensity).toFixed(2)})`);
            aura.addColorStop(1, "transparent");
          } else {
            // Oro cálido / Limoncillo de bosque
            aura.addColorStop(0, `rgba(250, 204, 21, ${(0.7 * intensity).toFixed(2)})`);
            aura.addColorStop(0.4, `rgba(163, 230, 53, ${(0.25 * intensity).toFixed(2)})`);
            aura.addColorStop(1, "transparent");
          }

          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(f.x, f.y, glowR, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo brillante
          ctx.fillStyle = f.hue === 152
            ? `rgba(236, 253, 245, ${(0.92 * intensity + 0.08).toFixed(2)})`
            : `rgba(254, 252, 232, ${(0.92 * intensity + 0.08).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // ========================================================
        // ❄️ MODO CLARO: BOSQUE EN INVIERNO
        // ========================================================

        // 1. Árboles lejanos en bruma fría
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(185, 212, 210, 0.35)", false, globalWind * 0.4);
        }

        // 2. Bruma invernal
        const winterMist = ctx.createLinearGradient(0, baseY - 110, 0, baseY);
        winterMist.addColorStop(0, "transparent");
        winterMist.addColorStop(0.6, "rgba(224, 242, 240, 0.45)");
        winterMist.addColorStop(1, "rgba(204, 233, 230, 0.75)");
        ctx.fillStyle = winterMist;
        ctx.fillRect(0, baseY - 110, width, 110);

        // 3. Capa media con sutil escarcha
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(150, 188, 185, 0.5)", true, globalWind * 0.7);
        }

        // 4. Capa cercana
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(125, 170, 168, 0.7)", true, globalWind);
        }

        // 5. Nieve con paralaje y viento dinámico
        for (let i = 0; i < snowflakes.length; i++) {
          const s = snowflakes[i];
          s.y += s.vy;
          s.x += Math.sin(clock * s.swaySpeed * 10 + s.swayOffset) * s.swayAmp + globalWind * 0.5;

          // Viento causado por el mouse
          const distMouse = Math.hypot(s.x - mouseX, s.y - mouseY);
          if (distMouse < 110 && distMouse > 0) {
            const force = (110 - distMouse) / 110;
            s.x += (s.x - mouseX > 0 ? 1 : -1) * force * 2.2;
          }

          // Reinicio al salir
          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 20) s.x = -15;
          if (s.x < -20) s.x = width + 15;

          // Dibujo del copo suave
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          // Sutil halo helado en copos en primer plano
          if (s.depth === 2) {
            ctx.fillStyle = `rgba(204, 251, 241, ${(s.alpha * 0.3).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 1.8, 0, Math.PI * 2);
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
      {/* Canvas 60 FPS: Bosque Vivo Orgánico & Bosque en Invierno */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Iluminación atmosférica de fondo ultra-sutil */}
      <div
        className={`absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000 ${
          isDark ? "bg-emerald-950/20" : "bg-teal-200/20"
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none transition-colors duration-1000 ${
          isDark ? "bg-teal-950/15" : "bg-cyan-100/25"
        }`}
      />
    </div>
  );
}
