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
  hue: number;
  depth: number;
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

interface FrostMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  swirlSpeed: number;
  swirlOffset: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  isGlint: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

interface WinterCloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
  wispOffset: number;
}

interface IceCrystal {
  x: number;
  y: number;
  size: number;
  glintPhase: number;
  glintSpeed: number;
  vy: number;
}

interface WinterBird {
  x: number;
  y: number;
  speed: number;
  wingPhase: number;
  size: number;
}

interface PineTree {
  x: number;
  height: number;
  width: number;
  tiers: number;
  swaySpeed: number;
  swayOffset: number;
}

interface Lantern {
  x: number;
  baseY: number;
  height: number;
  glowRadius: number;
  flickerOffset: number;
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
        initEntities();
      }, 120);
    };
    window.addEventListener("resize", handleResize);

    const isDark = theme === "dark";

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Colecciones de entidades
    let fireflies: Firefly[] = [];
    let spores: Spore[] = [];
    let frostMotes: FrostMote[] = [];
    let snowflakes: Snowflake[] = [];
    let stars: Star[] = [];
    let shootingStar: ShootingStar = { x: 0, y: 0, length: 0, speed: 0, angle: 0, alpha: 0, active: false };
    let shootingStarTimer = 0;
    let winterClouds: WinterCloud[] = [];
    let iceCrystals: IceCrystal[] = [];
    let winterBirds: WinterBird[] = [];
    let distantTrees: PineTree[] = [];
    let midTrees: PineTree[] = [];
    let nearTrees: PineTree[] = [];
    let lanterns: Lantern[] = [];

    const createPine = (x: number, baseHeight: number, widthRatio: number): PineTree => ({
      x,
      height: baseHeight * (0.85 + Math.random() * 0.35),
      width: baseHeight * widthRatio * (0.85 + Math.random() * 0.3),
      tiers: Math.floor(Math.random() * 2) + 3,
      swaySpeed: 0.6 + Math.random() * 0.8,
      swayOffset: Math.random() * Math.PI * 2,
    });

    const initEntities = () => {
      fireflies = [];
      spores = [];
      frostMotes = [];
      snowflakes = [];
      stars = [];
      winterClouds = [];
      iceCrystals = [];
      winterBirds = [];
      distantTrees = [];
      midTrees = [];
      nearTrees = [];
      lanterns = [];

      const forestBaseHeight = Math.min(145, height * 0.18);

      // Pinos lejanos
      const distCount = Math.ceil(width / 42) + 4;
      for (let i = -1; i < distCount; i++) {
        distantTrees.push(createPine(i * 42 + (Math.random() - 0.5) * 15, forestBaseHeight * 0.7, 0.45));
      }

      // Pinos medios
      const midCount = Math.ceil(width / 60) + 4;
      for (let i = -1; i < midCount; i++) {
        midTrees.push(createPine(i * 60 + (Math.random() - 0.5) * 20, forestBaseHeight * 0.88, 0.52));
      }

      // Pinos cercanos
      const nearCount = Math.ceil(width / 88) + 4;
      for (let i = -1; i < nearCount; i++) {
        nearTrees.push(createPine(i * 88 + (Math.random() - 0.5) * 30, forestBaseHeight, 0.58));
      }

      // Faroles rústicos ubicados estratégicamente para verse en el frente
      const lanternPositions = [0.18, 0.52, 0.84];
      for (const ratio of lanternPositions) {
        lanterns.push({
          x: width * ratio + (Math.random() - 0.5) * 30,
          baseY: height + 4,
          height: 82 + Math.random() * 14,
          glowRadius: 95 + Math.random() * 20,
          flickerOffset: Math.random() * Math.PI * 2,
        });
      }

      if (isDark) {
        // --- NOCHE / BOSQUE VIVO ---
        const starCount = Math.min(75, Math.floor(width / 20));
        for (let i = 0; i < starCount; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.6),
            radius: Math.random() * 1.4 + 0.4,
            alpha: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.03 + 0.015,
            phase: Math.random() * Math.PI * 2,
            isGlint: Math.random() > 0.82,
          });
        }

        const fireflyCount = Math.min(50, Math.floor((width * height) / 25000) + 20);
        for (let i = 0; i < fireflyCount; i++) {
          const depth = Math.random() > 0.8 ? 2 : Math.random() > 0.35 ? 1 : 0;
          fireflies.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.92),
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.3,
            radius: depth === 2 ? Math.random() * 3.0 + 2.2 : depth === 1 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.0 + 0.6,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.025 + 0.012,
            hue: Math.random() > 0.35 ? 152 : 50,
            depth,
          });
        }

        const sporeCount = Math.min(35, Math.floor(width / 38));
        for (let i = 0; i < sporeCount; i++) {
          spores.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -(Math.random() * 0.32 + 0.12),
            radius: Math.random() * 1.5 + 0.6,
            alpha: Math.random() * 0.4 + 0.15,
          });
        }
      } else {
        // --- DÍA / BOSQUE EN INVIERNO ---
        // Nubes nórdicas realistas alargadas en tono gris claro suave
        const cloudCount = 4;
        for (let i = 0; i < cloudCount; i++) {
          winterClouds.push({
            x: (width / cloudCount) * i + Math.random() * 80,
            y: 35 + i * 28 + Math.random() * 20,
            width: 260 + Math.random() * 160,
            height: 26 + Math.random() * 14,
            speed: 0.12 + Math.random() * 0.08,
            alpha: 0.32 + Math.random() * 0.18,
            wispOffset: Math.random() * Math.PI * 2,
          });
        }

        // Cristales de hielo en el aire (azul blanquecino)
        for (let i = 0; i < 40; i++) {
          iceCrystals.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.75),
            size: Math.random() * 2.2 + 0.9,
            glintPhase: Math.random() * Math.PI * 2,
            glintSpeed: Math.random() * 0.04 + 0.02,
            vy: Math.random() * 0.35 + 0.15,
          });
        }

        // Esporas de escarcha / Polvo de nieve en suspensión (azul blanquecino)
        const moteCount = Math.min(45, Math.floor(width / 30));
        for (let i = 0; i < moteCount; i++) {
          frostMotes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: -(Math.random() * 0.4 + 0.18),
            radius: Math.random() * 1.8 + 0.8,
            alpha: Math.random() * 0.55 + 0.3,
            swirlSpeed: Math.random() * 0.03 + 0.015,
            swirlOffset: Math.random() * Math.PI * 2,
          });
        }

        // Copos de nieve con paralaje en 3 capas (azul blanquecino para resaltar en fondo blanco)
        const snowCount = Math.min(115, Math.floor((width * height) / 12000) + 35);
        for (let i = 0; i < snowCount; i++) {
          const depth = Math.random() > 0.78 ? 2 : Math.random() > 0.38 ? 1 : 0;
          snowflakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: depth === 2 ? Math.random() * 3.4 + 2.2 : depth === 1 ? Math.random() * 2.0 + 1.2 : Math.random() * 1.2 + 0.6,
            vy: depth === 2 ? Math.random() * 1.4 + 1.0 : depth === 1 ? Math.random() * 0.9 + 0.6 : Math.random() * 0.55 + 0.35,
            swaySpeed: Math.random() * 0.025 + 0.012,
            swayAmp: depth === 2 ? 2.8 : 1.6,
            swayOffset: Math.random() * Math.PI * 2,
            alpha: depth === 2 ? 0.92 : depth === 1 ? 0.72 : 0.45,
            depth,
          });
        }

        // Bandada de 7 aves en formación de cuña horizontal natural hacia la derecha (>)
        const birdBaseX = width * 0.12;
        const birdBaseY = 90;
        winterBirds = [
          // 1. Ave líder en la punta frontal derecha
          { x: birdBaseX, y: birdBaseY, speed: 0.45, wingPhase: 0, size: 4.5 },
          // 2, 3, 4. Brazo superior extendiéndose hacia atrás y arriba
          { x: birdBaseX - 25, y: birdBaseY - 12, speed: 0.45, wingPhase: 0.5, size: 4.0 },
          { x: birdBaseX - 50, y: birdBaseY - 24, speed: 0.45, wingPhase: 1.0, size: 3.6 },
          { x: birdBaseX - 75, y: birdBaseY - 36, speed: 0.45, wingPhase: 1.5, size: 3.2 },
          // 5, 6, 7. Brazo inferior extendiéndose hacia atrás y abajo
          { x: birdBaseX - 25, y: birdBaseY + 12, speed: 0.45, wingPhase: 0.7, size: 4.0 },
          { x: birdBaseX - 50, y: birdBaseY + 24, speed: 0.45, wingPhase: 1.2, size: 3.6 },
          { x: birdBaseX - 75, y: birdBaseY + 36, speed: 0.45, wingPhase: 1.7, size: 3.2 },
        ];
      }
    };

    initEntities();

    let animId: number;
    let clock = 0;

    // Dibuja pino orgánico
    const drawOrganicPine = (
      tree: PineTree,
      baseY: number,
      fillColor: string,
      rimColor: string | null,
      snowCover: boolean,
      windSway: number
    ) => {
      const sway = Math.sin(clock * tree.swaySpeed + tree.swayOffset) * 4 + windSway * 6;
      const topX = tree.x + sway;
      const topY = baseY - tree.height;
      const halfW = tree.width / 2;

      ctx.save();
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(topX, topY);

      const tiers = tree.tiers;
      const tierH = tree.height / tiers;

      for (let t = 1; t <= tiers; t++) {
        const tierProgress = t / tiers;
        const currentW = halfW * tierProgress;
        const currentTierY = topY + tierH * t;
        const indentY = currentTierY - tierH * 0.3;
        const indentW = currentW * 0.65;
        const currentX = tree.x + (sway * (1 - tierProgress * 0.6));

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

      ctx.lineTo(tree.x + 3, baseY);
      ctx.lineTo(tree.x - 3, baseY);

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

      if (rimColor) {
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      if (snowCover) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.beginPath();
        ctx.arc(topX, topY + 3, 3.5, 0, Math.PI * 2);
        for (let t = 1; t <= tiers; t++) {
          const tierProgress = t / tiers;
          const currentW = halfW * tierProgress;
          const currentTierY = topY + tierH * t;
          const currentX = tree.x + (sway * (1 - tierProgress * 0.6));
          ctx.moveTo(currentX + currentW, currentTierY);
          ctx.arc(currentX + currentW, currentTierY, 2.5, 0, Math.PI * 2);
          ctx.moveTo(currentX - currentW, currentTierY);
          ctx.arc(currentX - currentW, currentTierY, 2.5, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.restore();
    };

    // Dibuja el farol rústico (encendido de noche, apagado de día)
    const drawRusticLantern = (l: Lantern, isWinterDay: boolean) => {
      const postX = l.x;
      const postTopY = l.baseY - l.height;
      const lanternX = postX + 14;
      const lanternY = postTopY + 12;

      ctx.save();

      if (!isWinterDay) {
        // DE NOCHE: FAROL ENCENDIDO CON LUZ ÁMBAR
        const flicker = (Math.sin(clock * 10 + l.flickerOffset) + 1) * 0.08 + 0.92;
        const glowR = l.glowRadius * flicker;

        const lightPool = ctx.createRadialGradient(
          lanternX, lanternY, 0,
          lanternX, lanternY, glowR
        );
        lightPool.addColorStop(0, "rgba(251, 191, 36, 0.48)");
        lightPool.addColorStop(0.35, "rgba(245, 158, 11, 0.20)");
        lightPool.addColorStop(0.7, "rgba(217, 119, 6, 0.06)");
        lightPool.addColorStop(1, "transparent");

        ctx.fillStyle = lightPool;
        ctx.beginPath();
        ctx.arc(lanternX, lanternY, glowR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Poste de madera / hierro forjado
      ctx.strokeStyle = isWinterDay ? "#475569" : "#0f2f27";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(postX, l.baseY);
      ctx.lineTo(postX, postTopY);
      ctx.quadraticCurveTo(postX + 4, postTopY - 6, lanternX, postTopY);
      ctx.stroke();

      // Cadena/gancho
      ctx.strokeStyle = isWinterDay ? "#64748b" : "#134e40";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lanternX, postTopY);
      ctx.lineTo(lanternX, lanternY - 10);
      ctx.stroke();

      // Carcasa del farol
      ctx.fillStyle = isWinterDay ? "#1e293b" : "#06221c";
      ctx.beginPath();
      ctx.moveTo(lanternX - 7, lanternY - 8);
      ctx.lineTo(lanternX, lanternY - 14);
      ctx.lineTo(lanternX + 7, lanternY - 8);
      ctx.closePath();
      ctx.fill();

      // Nieve acumulada en el tejadillo
      if (isWinterDay) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(lanternX, lanternY - 12, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!isWinterDay) {
        // Llama encendida en la noche
        const flicker = (Math.sin(clock * 10 + l.flickerOffset) + 1) * 0.08 + 0.92;
        ctx.fillStyle = "rgba(254, 240, 138, 0.95)";
        ctx.beginPath();
        ctx.arc(lanternX, lanternY - 2, 3.5 * flicker, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // APAGADO EN EL DÍA: Vela de cera fría con mecha y reflejo de cristal
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(lanternX - 2, lanternY - 1, 4, 6);
        ctx.fillStyle = "#334155";
        ctx.fillRect(lanternX - 0.5, lanternY - 3.5, 1, 2.5);

        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.moveTo(lanternX - 4, lanternY - 6);
        ctx.lineTo(lanternX - 1, lanternY - 6);
        ctx.lineTo(lanternX - 4, lanternY + 3);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = isWinterDay ? "#64748b" : "#0d3b31";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(lanternX - 6, lanternY - 8, 12, 12);

      ctx.restore();
    };

    // Dibuja la Luna Realista
    const drawRealisticMoon = () => {
      const moonX = width * 0.84;
      const moonY = 80;
      const radiusX = 27;
      const radiusY = 25.5;

      ctx.save();

      const moonGlow = ctx.createRadialGradient(
        moonX, moonY, radiusX * 0.4,
        moonX, moonY, radiusX * 4.6
      );
      moonGlow.addColorStop(0, "rgba(204, 251, 241, 0.32)");
      moonGlow.addColorStop(0.35, "rgba(52, 211, 153, 0.12)");
      moonGlow.addColorStop(1, "transparent");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.ellipse(moonX, moonY, radiusX * 4.6, radiusY * 4.6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(7, 35, 30, 0.45)";
      ctx.beginPath();
      ctx.ellipse(moonX, moonY, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#f0fdfa";
      ctx.beginPath();
      ctx.ellipse(moonX, moonY, radiusX, radiusY, 0, -Math.PI * 0.48, Math.PI * 0.52);
      ctx.quadraticCurveTo(
        moonX - radiusX * 0.3,
        moonY,
        moonX + radiusX * 0.1,
        moonY - radiusY * 0.95
      );
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(167, 243, 208, 0.22)";
      ctx.beginPath();
      ctx.ellipse(moonX + 11, moonY - 5, 4, 3, 0.3, 0, Math.PI * 2);
      ctx.ellipse(moonX + 14, moonY + 7, 5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(6, 40, 32, 0.35)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(moonX - 35, moonY + 4);
      ctx.quadraticCurveTo(moonX, moonY - 3, moonX + 35, moonY + 2);
      ctx.stroke();

      ctx.restore();
    };

    // Dibuja la Aurora Boreal
    const drawAurora = () => {
      const auroraGrad = ctx.createLinearGradient(0, 0, 0, 200);
      auroraGrad.addColorStop(0, "transparent");
      auroraGrad.addColorStop(0.4, "rgba(16, 185, 129, 0.12)");
      auroraGrad.addColorStop(0.7, "rgba(45, 212, 191, 0.08)");
      auroraGrad.addColorStop(1, "transparent");

      ctx.save();
      ctx.fillStyle = auroraGrad;
      ctx.beginPath();
      ctx.moveTo(0, 40);

      const step = 60;
      for (let x = 0; x <= width + step; x += step) {
        const y = 80 + Math.sin(x * 0.005 + clock * 0.4) * 35 + Math.cos(x * 0.008 - clock * 0.25) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Dibuja una nube invernal realista en GRIS CLARO nórdico
    const drawOrganicWinterCloud = (cloud: WinterCloud) => {
      const cx = cloud.x;
      const cy = cloud.y;
      const w = cloud.width;
      const h = cloud.height;

      ctx.save();

      // Gradiente horizontal en GRIS CLARO SUAVE (Slate-200 / Slate-300 nórdico)
      const grad = ctx.createLinearGradient(cx - w * 0.5, cy, cx + w * 0.5, cy);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.18, `rgba(203, 213, 225, ${(cloud.alpha * 0.65).toFixed(2)})`);
      grad.addColorStop(0.5, `rgba(218, 226, 235, ${cloud.alpha.toFixed(2)})`);
      grad.addColorStop(0.82, `rgba(203, 213, 225, ${(cloud.alpha * 0.65).toFixed(2)})`);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.5, cy + h * 0.1);

      // Borde superior ondulado orgánico de estrato invernal
      ctx.quadraticCurveTo(cx - w * 0.35, cy - h * 0.6, cx - w * 0.2, cy - h * 0.4);
      ctx.bezierCurveTo(cx - w * 0.05, cy - h * 0.9, cx + w * 0.15, cy - h * 0.8, cx + w * 0.3, cy - h * 0.3);
      ctx.quadraticCurveTo(cx + w * 0.42, cy - h * 0.1, cx + w * 0.5, cy);

      // Borde inferior alargado y plano
      ctx.quadraticCurveTo(cx + w * 0.25, cy + h * 0.45, cx, cy + h * 0.3);
      ctx.quadraticCurveTo(cx - w * 0.25, cy + h * 0.4, cx - w * 0.5, cy + h * 0.1);

      ctx.closePath();
      ctx.fill();

      // Filamento secundario rasgado con sombra suave gris-fría
      ctx.fillStyle = `rgba(180, 195, 212, ${(cloud.alpha * 0.45).toFixed(2)})`;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, cy + h * 0.5);
      ctx.quadraticCurveTo(cx, cy + h * 0.7, cx + w * 0.25, cy + h * 0.45);
      ctx.quadraticCurveTo(cx, cy + h * 0.55, cx - w * 0.3, cy + h * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Dibuja el Sol de Invierno Realista
    const drawRealisticWinterSun = () => {
      const sunX = width * 0.82;
      const sunY = 90;
      const sunRadiusX = 36;
      const sunRadiusY = 29;

      ctx.save();

      // Rayos crepusculares suaves
      const numRays = 5;
      for (let i = 0; i < numRays; i++) {
        const rayAngle = Math.PI * 0.35 + (i * 0.18) + Math.sin(clock * 0.2 + i) * 0.03;
        const rayLen = height * 0.85;
        const rayTargetX = sunX + Math.cos(rayAngle) * rayLen;
        const rayTargetY = sunY + Math.sin(rayAngle) * rayLen;

        const rayGrad = ctx.createLinearGradient(sunX, sunY, rayTargetX, rayTargetY);
        rayGrad.addColorStop(0, "rgba(254, 243, 199, 0.18)");
        rayGrad.addColorStop(0.4, "rgba(224, 242, 254, 0.08)");
        rayGrad.addColorStop(1, "transparent");

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(rayTargetX - 60, rayTargetY);
        ctx.lineTo(rayTargetX + 60, rayTargetY);
        ctx.closePath();
        ctx.fill();
      }

      // Halo óptico de 22° y parhelios
      const haloRadiusX = 92;
      const haloRadiusY = 82;
      ctx.strokeStyle = "rgba(254, 243, 199, 0.24)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(sunX, sunY, haloRadiusX, haloRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      const sundogL = ctx.createRadialGradient(sunX - haloRadiusX, sunY, 0, sunX - haloRadiusX, sunY, 18);
      sundogL.addColorStop(0, "rgba(254, 240, 138, 0.38)");
      sundogL.addColorStop(1, "transparent");
      ctx.fillStyle = sundogL;
      ctx.beginPath();
      ctx.arc(sunX - haloRadiusX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();

      const sundogR = ctx.createRadialGradient(sunX + haloRadiusX, sunY, 0, sunX + haloRadiusX, sunY, 18);
      sundogR.addColorStop(0, "rgba(254, 240, 138, 0.38)");
      sundogR.addColorStop(1, "transparent");
      ctx.fillStyle = sundogR;
      ctx.beginPath();
      ctx.arc(sunX + haloRadiusX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Resplandor difuso del sol
      const sunAtmosphere = ctx.createRadialGradient(
        sunX, sunY, sunRadiusY * 0.3,
        sunX, sunY, sunRadiusX * 3.8
      );
      sunAtmosphere.addColorStop(0, "rgba(255, 254, 240, 0.95)");
      sunAtmosphere.addColorStop(0.3, "rgba(254, 243, 199, 0.55)");
      sunAtmosphere.addColorStop(0.65, "rgba(224, 242, 254, 0.20)");
      sunAtmosphere.addColorStop(1, "transparent");

      ctx.fillStyle = sunAtmosphere;
      ctx.beginPath();
      ctx.ellipse(sunX, sunY, sunRadiusX * 3.8, sunRadiusY * 3.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Disco aplanado por refracción
      ctx.fillStyle = "rgba(255, 255, 248, 0.98)";
      ctx.beginPath();
      ctx.ellipse(sunX, sunY, sunRadiusX, sunRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Estrato cruzado
      ctx.fillStyle = "rgba(224, 242, 254, 0.35)";
      ctx.beginPath();
      ctx.moveTo(sunX - sunRadiusX * 1.5, sunY - 4);
      ctx.quadraticCurveTo(sunX, sunY - 8, sunX + sunRadiusX * 1.6, sunY - 2);
      ctx.quadraticCurveTo(sunX, sunY, sunX - sunRadiusX * 1.5, sunY - 4);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      const globalWind = Math.sin(clock * 0.5) * 0.8;
      const baseY = height + 4;

      if (isDark) {
        // ========================================================
        // 🌲 MODO OSCURO: BOSQUE VIVO
        // ========================================================
        drawAurora();
        drawRealisticMoon();

        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          const twinkle = (Math.sin(clock * st.twinkleSpeed * 10 + st.phase) + 1) / 2;
          const alpha = st.alpha * (0.35 + twinkle * 0.65);

          ctx.fillStyle = `rgba(209, 250, 229, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();

          if (st.isGlint && twinkle > 0.6) {
            const glintLen = st.radius * 3.5 * twinkle;
            ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.7).toFixed(2)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(st.x - glintLen, st.y);
            ctx.lineTo(st.x + glintLen, st.y);
            ctx.moveTo(st.x, st.y - glintLen);
            ctx.lineTo(st.x, st.y + glintLen);
            ctx.stroke();
          }
        }

        shootingStarTimer += 0.016;
        if (shootingStarTimer > 5.5 && !shootingStar.active) {
          shootingStar = {
            x: Math.random() * (width * 0.7) + width * 0.15,
            y: Math.random() * (height * 0.3) + 20,
            length: 80 + Math.random() * 50,
            speed: 12 + Math.random() * 6,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            alpha: 1,
            active: true,
          };
          shootingStarTimer = 0;
        }

        if (shootingStar.active) {
          shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
          shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
          shootingStar.alpha -= 0.022;

          if (shootingStar.alpha <= 0 || shootingStar.x > width || shootingStar.y > height) {
            shootingStar.active = false;
          } else {
            const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
            const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
            const grad = ctx.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
            grad.addColorStop(0, "transparent");
            grad.addColorStop(1, `rgba(209, 250, 229, ${shootingStar.alpha.toFixed(2)})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(shootingStar.x, shootingStar.y);
            ctx.stroke();
          }
        }

        // Pinos Lejanos
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(8, 48, 40, 0.55)", "rgba(20, 110, 92, 0.25)", false, globalWind * 0.4);
        }

        // Bruma
        const midMist = ctx.createLinearGradient(0, baseY - 120, 0, baseY);
        midMist.addColorStop(0, "transparent");
        midMist.addColorStop(0.6, "rgba(6, 38, 32, 0.40)");
        midMist.addColorStop(1, "rgba(4, 20, 16, 0.85)");
        ctx.fillStyle = midMist;
        ctx.fillRect(0, baseY - 120, width, 120);

        // Pinos Medios
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(10, 62, 52, 0.78)", "rgba(45, 212, 191, 0.30)", false, globalWind * 0.7);
        }

        // Pinos Cercanos (se dibujan antes de los faroles)
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(8, 52, 44, 0.92)", "rgba(52, 211, 153, 0.45)", false, globalWind);
        }

        // FAROLES EN PRIMER PLANO (ADELANTE DE TODOS LOS ÁRBOLES)
        for (const l of lanterns) {
          drawRusticLantern(l, false);
        }

        // Esporas
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

        // Luciérnagas
        for (let i = 0; i < fireflies.length; i++) {
          const f = fireflies[i];
          f.phase += f.pulseSpeed;
          f.x += f.vx + Math.sin(clock * 0.9 + f.phase) * 0.45;
          f.y += f.vy + Math.cos(clock * 0.7 + f.phase) * 0.35;

          if (f.x < -30) f.x = width + 30;
          if (f.x > width + 30) f.x = -30;
          if (f.y < -30) f.y = height * 0.88;
          if (f.y > height * 0.9) f.y = -10;

          const distMouse = Math.hypot(f.x - mouseX, f.y - mouseY);
          if (distMouse < 140 && distMouse > 0) {
            const push = (140 - distMouse) / 140;
            const angle = Math.atan2(f.y - mouseY, f.x - mouseX);
            f.x += Math.cos(angle) * push * 2.8;
            f.y += Math.sin(angle) * push * 2.8;
          }

          const pulse = (Math.sin(f.phase) + 1) / 2;
          const intensity = Math.max(0.12, pulse);
          const glowR = f.radius * (3.8 + intensity * 4.2);

          const aura = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowR);
          if (f.hue === 152) {
            aura.addColorStop(0, `rgba(52, 211, 153, ${(0.68 * intensity).toFixed(2)})`);
            aura.addColorStop(0.4, `rgba(16, 185, 129, ${(0.25 * intensity).toFixed(2)})`);
            aura.addColorStop(1, "transparent");
          } else {
            aura.addColorStop(0, `rgba(250, 204, 21, ${(0.72 * intensity).toFixed(2)})`);
            aura.addColorStop(0.4, `rgba(163, 230, 53, ${(0.26 * intensity).toFixed(2)})`);
            aura.addColorStop(1, "transparent");
          }

          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.arc(f.x, f.y, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = f.hue === 152
            ? `rgba(236, 253, 245, ${(0.92 * intensity + 0.08).toFixed(2)})`
            : `rgba(254, 252, 232, ${(0.92 * intensity + 0.08).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

      } else {
        // ========================================================
        // ❄️ MODO CLARO: BOSQUE EN INVIERNO (DÍA)
        // ========================================================

        // 1. Sol Realista
        drawRealisticWinterSun();

        // 2. Nubes nórdicas flotantes en gris claro suave (no circulares)
        for (const cloud of winterClouds) {
          cloud.x += cloud.speed;
          if (cloud.x > width + cloud.width) {
            cloud.x = -cloud.width;
            cloud.y = 35 + Math.random() * 90;
          }
          drawOrganicWinterCloud(cloud);
        }

        // 3. Bandada de 7 aves en formación de flecha horizontal hacia la derecha (>)
        for (const bird of winterBirds) {
          bird.x += bird.speed;
          if (bird.x > width + 100) {
            bird.x = -100;
          }

          // Aleteo de alas horizontales
          const wingFlap = Math.sin(clock * 6 + bird.wingPhase) * (bird.size * 0.85);

          ctx.strokeStyle = "rgba(71, 85, 105, 0.78)";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          // Ala superior inclinada hacia atrás
          ctx.moveTo(bird.x - bird.size * 0.9, bird.y - bird.size * 0.8 - wingFlap);
          ctx.quadraticCurveTo(bird.x - bird.size * 0.2, bird.y - bird.size * 0.15, bird.x, bird.y);
          // Ala inferior inclinada hacia atrás
          ctx.quadraticCurveTo(bird.x - bird.size * 0.2, bird.y + bird.size * 0.15, bird.x - bird.size * 0.9, bird.y + bird.size * 0.8 - wingFlap);
          ctx.stroke();
        }

        // 4. Destellos de Diamante (Diamond Dust) en azul blanquecino
        for (const crystal of iceCrystals) {
          crystal.y += crystal.vy;
          crystal.glintPhase += crystal.glintSpeed;
          if (crystal.y > height * 0.8) {
            crystal.y = 15;
            crystal.x = Math.random() * width;
          }

          const glint = (Math.sin(crystal.glintPhase) + 1) / 2;
          if (glint > 0.35) {
            const sparkSize = crystal.size * glint * 1.5;
            // Núcleo blanco-azulado
            ctx.fillStyle = `rgba(186, 230, 253, ${(glint * 0.95).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(crystal.x, crystal.y, crystal.size * 0.6, 0, Math.PI * 2);
            ctx.fill();

            // Destello en cruz en azul hielo
            ctx.strokeStyle = `rgba(56, 189, 248, ${(glint * 0.85).toFixed(2)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(crystal.x - sparkSize, crystal.y);
            ctx.lineTo(crystal.x + sparkSize, crystal.y);
            ctx.moveTo(crystal.x, crystal.y - sparkSize);
            ctx.lineTo(crystal.x + sparkSize, crystal.y);
            ctx.stroke();
          }
        }

        // 5. Esporas de escarcha / Polvo de nieve en azul blanquecino (alta visibilidad sobre fondo blanco)
        for (const mote of frostMotes) {
          mote.x += mote.vx + Math.sin(clock * mote.swirlSpeed * 10 + mote.swirlOffset) * 0.5 + globalWind * 0.4;
          mote.y += mote.vy;

          if (mote.y < 0) {
            mote.y = height + 10;
            mote.x = Math.random() * width;
          }

          // Halo azul hielo
          ctx.fillStyle = `rgba(56, 189, 248, ${(mote.alpha * 0.38).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo azul blanquecino
          ctx.fillStyle = `rgba(186, 230, 253, ${(mote.alpha * 0.9).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Pinos lejanos nevados
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(175, 210, 208, 0.45)", null, false, globalWind * 0.4);
        }

        // 7. Bruma invernal
        const winterMist = ctx.createLinearGradient(0, baseY - 110, 0, baseY);
        winterMist.addColorStop(0, "transparent");
        winterMist.addColorStop(0.6, "rgba(224, 242, 240, 0.45)");
        winterMist.addColorStop(1, "rgba(204, 233, 230, 0.85)");
        ctx.fillStyle = winterMist;
        ctx.fillRect(0, baseY - 110, width, 110);

        // 8. Pinos medios con escarcha blanca
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(135, 185, 180, 0.65)", null, true, globalWind * 0.7);
        }

        // 9. Pinos cercanos con copos de nieve en las ramas (se dibujan antes de los faroles)
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(105, 160, 155, 0.82)", null, true, globalWind);
        }

        // 10. FAROLES EN PRIMER PLANO: ADELANTE DE TODOS LOS ÁRBOLES (APAGADOS EN EL DÍA)
        for (const l of lanterns) {
          drawRusticLantern(l, true);
        }

        // 11. Nieve cayendo en AZUL BLANQUECINO (resalta claramente contra el fondo blanco)
        for (let i = 0; i < snowflakes.length; i++) {
          const s = snowflakes[i];
          s.y += s.vy;
          s.x += Math.sin(clock * s.swaySpeed * 10 + s.swayOffset) * s.swayAmp + globalWind * 0.6;

          const distMouse = Math.hypot(s.x - mouseX, s.y - mouseY);
          if (distMouse < 120 && distMouse > 0) {
            const force = (120 - distMouse) / 120;
            s.x += (s.x - mouseX > 0 ? 1 : -1) * force * 2.5;
          }

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 20) s.x = -15;
          if (s.x < -20) s.x = width + 15;

          // Halo azul hielo
          if (s.depth === 2) {
            ctx.fillStyle = `rgba(56, 189, 248, ${(s.alpha * 0.40).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 2.0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Cuerpo del copo en azul blanquecino (alta visibilidad sobre blanco)
          ctx.fillStyle = `rgba(186, 230, 253, ${s.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          // Núcleo blanco-celeste
          ctx.fillStyle = `rgba(240, 249, 255, ${(s.alpha * 0.95).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 0.55, 0, Math.PI * 2);
          ctx.fill();
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Iluminación atmosférica ambiental */}
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
