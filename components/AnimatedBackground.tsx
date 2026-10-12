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

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  isGlint: boolean; // Estrella con destello de 4 puntas
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
}

interface IceCrystal {
  x: number;
  y: number;
  size: number;
  glintPhase: number;
  glintSpeed: number;
  vy: number;
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

    // Entidades
    let fireflies: Firefly[] = [];
    let spores: Spore[] = [];
    let snowflakes: Snowflake[] = [];
    let stars: Star[] = [];
    let shootingStar: ShootingStar = { x: 0, y: 0, length: 0, speed: 0, angle: 0, alpha: 0, active: false };
    let shootingStarTimer = 0;
    let winterClouds: WinterCloud[] = [];
    let iceCrystals: IceCrystal[] = [];
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
      snowflakes = [];
      stars = [];
      winterClouds = [];
      iceCrystals = [];
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

      // Faroles rústicos colocados en claros del bosque
      const lanternPositions = [0.18, 0.52, 0.84];
      for (const ratio of lanternPositions) {
        lanterns.push({
          x: width * ratio + (Math.random() - 0.5) * 40,
          baseY: height + 4,
          height: 80 + Math.random() * 15,
          glowRadius: 90 + Math.random() * 20,
          flickerOffset: Math.random() * Math.PI * 2,
        });
      }

      if (isDark) {
        // --- NOCHE / BOSQUE VIVO ---
        // Estrellas y constelaciones con destello
        const starCount = Math.min(75, Math.floor(width / 20));
        for (let i = 0; i < starCount; i++) {
          stars.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.6),
            radius: Math.random() * 1.4 + 0.4,
            alpha: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.03 + 0.015,
            phase: Math.random() * Math.PI * 2,
            isGlint: Math.random() > 0.82, // 18% son estrellas con destello de 4 puntas
          });
        }

        // Luciérnagas en 3 planos
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

        // Esporas
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
        // Nubes nórdicas flotantes en el cielo invernal
        const cloudCount = 4;
        for (let i = 0; i < cloudCount; i++) {
          winterClouds.push({
            x: (width / cloudCount) * i + Math.random() * 100,
            y: 40 + Math.random() * 90,
            width: 180 + Math.random() * 140,
            height: 45 + Math.random() * 30,
            speed: 0.12 + Math.random() * 0.1,
            alpha: 0.25 + Math.random() * 0.2,
          });
        }

        // Cristales de hielo (Diamond Dust) en el cielo
        for (let i = 0; i < 30; i++) {
          iceCrystals.push({
            x: Math.random() * width,
            y: Math.random() * (height * 0.65),
            size: Math.random() * 1.8 + 0.8,
            glintPhase: Math.random() * Math.PI * 2,
            glintSpeed: Math.random() * 0.04 + 0.02,
            vy: Math.random() * 0.3 + 0.1,
          });
        }

        // Copos de nieve con paralaje
        const snowCount = Math.min(80, Math.floor((width * height) / 15000) + 25);
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

    initEntities();

    let animId: number;
    let clock = 0;

    // Dibuja un pino orgánico con contrastes nítidos y ribetes luminosos
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

      // Lado derecho
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

      // Lado izquierdo
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

      // Ribete bioluminiscente en modo oscuro (hace que el bosque sea visible y resalte en la noche)
      if (rimColor) {
        ctx.strokeStyle = rimColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Nieve acumulada en ramas en invierno
      if (snowCover) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
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

    // Dibuja un farol rústico de madera/hierro con vela cálida y resplandor
    const drawRusticLantern = (l: Lantern, isWinter: boolean) => {
      const postX = l.x;
      const postTopY = l.baseY - l.height;
      const lanternX = postX + 14;
      const lanternY = postTopY + 12;

      ctx.save();

      // 1. Cono de luz cálida proyectada en el suelo
      const flicker = (Math.sin(clock * 10 + l.flickerOffset) + 1) * 0.08 + 0.92;
      const glowR = l.glowRadius * flicker;
      const lightPool = ctx.createRadialGradient(
        lanternX, lanternY, 0,
        lanternX, lanternY, glowR
      );
      lightPool.addColorStop(0, "rgba(251, 191, 36, 0.45)"); // Ámbar dorado cálido
      lightPool.addColorStop(0.35, "rgba(245, 158, 11, 0.18)");
      lightPool.addColorStop(0.7, "rgba(217, 119, 6, 0.06)");
      lightPool.addColorStop(1, "transparent");

      ctx.fillStyle = lightPool;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, glowR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Poste de madera/hierro
      ctx.strokeStyle = isWinter ? "#334155" : "#0f2f27";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(postX, l.baseY);
      ctx.lineTo(postX, postTopY);
      // Brazo curvo para colgar el farol
      ctx.quadraticCurveTo(postX + 4, postTopY - 6, lanternX, postTopY);
      ctx.stroke();

      // 3. Cadena o gancho
      ctx.strokeStyle = isWinter ? "#64748b" : "#134e40";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(lanternX, postTopY);
      ctx.lineTo(lanternX, lanternY - 10);
      ctx.stroke();

      // 4. Carcasa del farol
      ctx.fillStyle = isWinter ? "#1e293b" : "#06221c";
      ctx.beginPath();
      // Techo del farol (pirámide)
      ctx.moveTo(lanternX - 7, lanternY - 8);
      ctx.lineTo(lanternX, lanternY - 14);
      ctx.lineTo(lanternX + 7, lanternY - 8);
      ctx.closePath();
      ctx.fill();

      // Capa de nieve en el techo del farol en invierno
      if (isWinter) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(lanternX, lanternY - 12, 6, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vidrio con llama brillante
      ctx.fillStyle = "rgba(254, 240, 138, 0.95)"; // Núcleo de llama dorada
      ctx.beginPath();
      ctx.arc(lanternX, lanternY - 2, 3.5 * flicker, 0, Math.PI * 2);
      ctx.fill();

      // Marco de cristal del farol
      ctx.strokeStyle = isWinter ? "#475569" : "#0d3b31";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(lanternX - 6, lanternY - 8, 12, 12);

      ctx.restore();
    };

    // Dibuja la Luna mística en modo oscuro con halos etéreos
    const drawMoon = () => {
      const moonX = width * 0.84;
      const moonY = 80;
      const moonRadius = 26;

      ctx.save();

      // Aura exterior lunar
      const moonGlow = ctx.createRadialGradient(
        moonX, moonY, moonRadius * 0.5,
        moonX, moonY, moonRadius * 4.5
      );
      moonGlow.addColorStop(0, "rgba(204, 251, 241, 0.28)");
      moonGlow.addColorStop(0.4, "rgba(52, 211, 153, 0.10)");
      moonGlow.addColorStop(1, "transparent");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Disco lunar (Luna Creciente Plateada)
      ctx.fillStyle = "#f0fdfa";
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sombra para dar fase creciente elegante
      ctx.fillStyle = "#061317";
      ctx.beginPath();
      ctx.arc(moonX - 8, moonY - 3, moonRadius * 0.88, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Dibuja la Aurora Boreal en la noche
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

    // Dibuja el Sol de Invierno y nubes en modo claro
    const drawWinterSunAndClouds = () => {
      const sunX = width * 0.82;
      const sunY = 85;
      const sunRadius = 28;

      ctx.save();

      // Halo solar gélido
      const sunHalo = ctx.createRadialGradient(
        sunX, sunY, sunRadius * 0.4,
        sunX, sunY, sunRadius * 4.2
      );
      sunHalo.addColorStop(0, "rgba(254, 243, 199, 0.45)");
      sunHalo.addColorStop(0.4, "rgba(204, 251, 241, 0.18)");
      sunHalo.addColorStop(1, "transparent");

      ctx.fillStyle = sunHalo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Disco del sol
      ctx.fillStyle = "rgba(255, 253, 240, 0.95)";
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Nubes invernales flotantes
      for (const cloud of winterClouds) {
        cloud.x += cloud.speed;
        if (cloud.x > width + cloud.width) {
          cloud.x = -cloud.width;
          cloud.y = 40 + Math.random() * 90;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.width * 0.5, cloud.height * 0.4, 0, 0, Math.PI * 2);
        ctx.ellipse(cloud.x + cloud.width * 0.2, cloud.y - 8, cloud.width * 0.35, cloud.height * 0.5, 0, 0, Math.PI * 2);
        ctx.ellipse(cloud.x - cloud.width * 0.2, cloud.y + 4, cloud.width * 0.3, cloud.height * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const render = () => {
      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      const globalWind = Math.sin(clock * 0.5) * 0.8;
      const baseY = height + 4;

      if (isDark) {
        // ========================================================
        // 🌲 MODO OSCURO: BOSQUE VIVO (CIELO ESTRELLADO + LUNA + FAROLES)
        // ========================================================

        // 1. Aurora Boreal en la atmósfera superior
        drawAurora();

        // 2. Luna plateada mística
        drawMoon();

        // 3. Estrellas con destellos de 4 puntas
        for (let i = 0; i < stars.length; i++) {
          const st = stars[i];
          const twinkle = (Math.sin(clock * st.twinkleSpeed * 10 + st.phase) + 1) / 2;
          const alpha = st.alpha * (0.35 + twinkle * 0.65);

          ctx.fillStyle = `rgba(209, 250, 229, ${alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fill();

          // Destello en cruz para estrellas destacadas
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

        // 4. Estrella fugaz periódica
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

        // 5. Pinos Lejanos (con contraste visible: verde esmeralda profundo)
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(8, 48, 40, 0.55)", "rgba(20, 110, 92, 0.25)", false, globalWind * 0.4);
        }

        // 6. Bruma nocturna ambiental
        const midMist = ctx.createLinearGradient(0, baseY - 120, 0, baseY);
        midMist.addColorStop(0, "transparent");
        midMist.addColorStop(0.6, "rgba(6, 38, 32, 0.40)");
        midMist.addColorStop(1, "rgba(4, 20, 16, 0.85)");
        ctx.fillStyle = midMist;
        ctx.fillRect(0, baseY - 120, width, 120);

        // 7. Pinos Medios (con reborde verde menta luminiscente para máxima nitidez)
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(10, 62, 52, 0.78)", "rgba(45, 212, 191, 0.30)", false, globalWind * 0.7);
        }

        // 8. Faroles Rústicos encendidos entre los árboles
        for (const l of lanterns) {
          drawRusticLantern(l, false);
        }

        // 9. Pinos Cercanos (bien definidos y contrastados)
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(8, 52, 44, 0.92)", "rgba(52, 211, 153, 0.45)", false, globalWind);
        }

        // 10. Esporas ascendentes
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

        // 11. Luciérnagas vivas con física y reacción al cursor
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
        // ❄️ MODO CLARO: BOSQUE EN INVIERNO (SOL PÁLIDO + NUBES + FAROLES)
        // ========================================================

        // 1. Sol pálido de invierno y nubes flotantes
        drawWinterSunAndClouds();

        // 2. Destellos de cristales de hielo (Diamond Dust) en el cielo
        for (const crystal of iceCrystals) {
          crystal.y += crystal.vy;
          crystal.glintPhase += crystal.glintSpeed;
          if (crystal.y > height * 0.7) {
            crystal.y = 20;
            crystal.x = Math.random() * width;
          }

          const glint = (Math.sin(crystal.glintPhase) + 1) / 2;
          if (glint > 0.4) {
            ctx.fillStyle = `rgba(255, 255, 255, ${(glint * 0.85).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(crystal.x, crystal.y, crystal.size * glint, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. Pinos lejanos nevados
        for (let i = 0; i < distantTrees.length; i++) {
          drawOrganicPine(distantTrees[i], baseY, "rgba(175, 210, 208, 0.45)", null, false, globalWind * 0.4);
        }

        // 4. Bruma invernal
        const winterMist = ctx.createLinearGradient(0, baseY - 110, 0, baseY);
        winterMist.addColorStop(0, "transparent");
        winterMist.addColorStop(0.6, "rgba(224, 242, 240, 0.45)");
        winterMist.addColorStop(1, "rgba(204, 233, 230, 0.85)");
        ctx.fillStyle = winterMist;
        ctx.fillRect(0, baseY - 110, width, 110);

        // 5. Pinos medios con escarcha blanca
        for (let i = 0; i < midTrees.length; i++) {
          drawOrganicPine(midTrees[i], baseY, "rgba(135, 185, 180, 0.65)", null, true, globalWind * 0.7);
        }

        // 6. Faroles rústicos de invierno con luz cálida dorada en la nieve
        for (const l of lanterns) {
          drawRusticLantern(l, true);
        }

        // 7. Pinos cercanos con copos de nieve en las ramas
        for (let i = 0; i < nearTrees.length; i++) {
          drawOrganicPine(nearTrees[i], baseY, "rgba(105, 160, 155, 0.82)", null, true, globalWind);
        }

        // 8. Copos de nieve con paralaje
        for (let i = 0; i < snowflakes.length; i++) {
          const s = snowflakes[i];
          s.y += s.vy;
          s.x += Math.sin(clock * s.swaySpeed * 10 + s.swayOffset) * s.swayAmp + globalWind * 0.5;

          const distMouse = Math.hypot(s.x - mouseX, s.y - mouseY);
          if (distMouse < 110 && distMouse > 0) {
            const force = (110 - distMouse) / 110;
            s.x += (s.x - mouseX > 0 ? 1 : -1) * force * 2.2;
          }

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 20) s.x = -15;
          if (s.x < -20) s.x = width + 15;

          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

          if (s.depth === 2) {
            ctx.fillStyle = `rgba(204, 251, 241, ${(s.alpha * 0.35).toFixed(2)})`;
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
      {/* Canvas 60 FPS: Bosque Vivo con Faroles, Luna, Aurora, Estrellas Fugaces y Sol de Invierno */}
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
