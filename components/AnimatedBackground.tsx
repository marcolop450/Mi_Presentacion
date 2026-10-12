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

interface CloudPuff {
  dx: number;
  dy: number;
  rx: number;
  ry: number;
}

interface WinterCloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
  puffs: CloudPuff[];
}

interface IceCrystal {
  x: number;
  y: number;
  size: number;
  glintPhase: number;
  glintSpeed: number;
  vy: number;
}

interface BirdInFlock {
  dx: number;
  dy: number;
  size: number;
  wingPhase: number;
}

interface Flock {
  x: number;
  y: number;
  speed: number;
  birds: BirdInFlock[];
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

// Generador pseudo-aleatorio determinista para que árboles y faroles NUNCA salten al cambiar de tema
function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Referencias para que el paisaje sea 100% estable entre cambios de tema
  const persistentTreesRef = useRef<{
    distant: PineTree[];
    mid: PineTree[];
    near: PineTree[];
    lanterns: Lantern[];
    lastWidth: number;
    lastHeight: number;
  }>({
    distant: [],
    mid: [],
    near: [],
    lanterns: [],
    lastWidth: 0,
    lastHeight: 0,
  });

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isDark = theme === "dark";

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Entidades dinámicas
    let fireflies: Firefly[] = [];
    let spores: Spore[] = [];
    let frostMotes: FrostMote[] = [];
    let snowflakes: Snowflake[] = [];
    let stars: Star[] = [];
    let shootingStar: ShootingStar = { x: 0, y: 0, length: 0, speed: 0, angle: 0, alpha: 0, active: false };
    let shootingStarTimer = 0;
    let winterClouds: WinterCloud[] = [];
    let iceCrystals: IceCrystal[] = [];
    let flock: Flock = { x: -120, y: 200, speed: 0.5, birds: [] };

    // Generador de nubes nórdicas volumétricas con lóbulos orgánicos aleatorios
    const createRandomCloud = (startX: number, screenWidth: number): WinterCloud => {
      const w = 240 + Math.random() * 200;
      const h = 34 + Math.random() * 22;
      const y = 85 + Math.random() * 115; // 85px a 200px (Cómodamente DEBAJO del Navbar de 64px)
      const speed = 0.08 + Math.random() * 0.14;
      const alpha = 0.35 + Math.random() * 0.22;

      // 4 lóbulos orgánicos aleatorios
      const puffs: CloudPuff[] = [
        { dx: -w * 0.28, dy: h * 0.12, rx: w * 0.26, ry: h * 0.55 },
        { dx: -w * 0.06, dy: -h * 0.22, rx: w * 0.32, ry: h * 0.70 },
        { dx: w * 0.18, dy: -h * 0.08, rx: w * 0.28, ry: h * 0.62 },
        { dx: w * 0.34, dy: h * 0.18, rx: w * 0.22, ry: h * 0.48 },
      ];

      return { x: startX, y, width: w, height: h, speed, alpha, puffs };
    };

    // Generador de bandada de aves / patos en formación horizontal (>) con altitud y velocidad randómicas
    const createRandomFlock = (startX: number, screenWidth: number): Flock => {
      const flockY = 180 + Math.random() * 75; // 180px a 255px (DEBAJO del Navbar de 64px, distancia segura >110px)
      const speed = 0.48 + Math.random() * 0.32;
      const leadSize = 4.8 + Math.random() * 0.8;

      const birds: BirdInFlock[] = [
        { dx: 0, dy: 0, size: leadSize, wingPhase: 0 },
        { dx: -28, dy: -14, size: leadSize * 0.9, wingPhase: 0.5 },
        { dx: -56, dy: -28, size: leadSize * 0.82, wingPhase: 1.0 },
        { dx: -84, dy: -42, size: leadSize * 0.74, wingPhase: 1.5 },
        { dx: -28, dy: 14, size: leadSize * 0.9, wingPhase: 0.7 },
        { dx: -56, dy: 28, size: leadSize * 0.82, wingPhase: 1.2 },
        { dx: -84, dy: 42, size: leadSize * 0.74, wingPhase: 1.7 },
      ];

      return { x: startX, y: flockY, speed, birds };
    };

    // Generar o recuperar el paisaje fijo (árboles y faroles NO se regeneran al cambiar de tema)
    const setupLandscape = () => {
      const p = persistentTreesRef.current;
      // Solo regenerar si el tamaño de pantalla cambió significativamente
      if (Math.abs(p.lastWidth - width) < 20 && Math.abs(p.lastHeight - height) < 20 && p.distant.length > 0) {
        return;
      }

      p.lastWidth = width;
      p.lastHeight = height;
      p.distant = [];
      p.mid = [];
      p.near = [];
      p.lanterns = [];

      const forestBaseHeight = Math.min(145, height * 0.18);

      // Pinos lejanos (deterministas con seed)
      const distCount = Math.ceil(width / 42) + 4;
      for (let i = -1; i < distCount; i++) {
        const seed = i * 13.37;
        const h = forestBaseHeight * 0.7 * (0.85 + pseudoRandom(seed) * 0.35);
        p.distant.push({
          x: i * 42 + (pseudoRandom(seed + 1) - 0.5) * 15,
          height: h,
          width: h * 0.45 * (0.85 + pseudoRandom(seed + 2) * 0.3),
          tiers: Math.floor(pseudoRandom(seed + 3) * 2) + 3,
          swaySpeed: 0.6 + pseudoRandom(seed + 4) * 0.8,
          swayOffset: pseudoRandom(seed + 5) * Math.PI * 2,
        });
      }

      // Pinos medios
      const midCount = Math.ceil(width / 60) + 4;
      for (let i = -1; i < midCount; i++) {
        const seed = i * 47.19;
        const h = forestBaseHeight * 0.88 * (0.85 + pseudoRandom(seed) * 0.35);
        p.mid.push({
          x: i * 60 + (pseudoRandom(seed + 1) - 0.5) * 20,
          height: h,
          width: h * 0.52 * (0.85 + pseudoRandom(seed + 2) * 0.3),
          tiers: Math.floor(pseudoRandom(seed + 3) * 2) + 3,
          swaySpeed: 0.6 + pseudoRandom(seed + 4) * 0.8,
          swayOffset: pseudoRandom(seed + 5) * Math.PI * 2,
        });
      }

      // Pinos cercanos
      const nearCount = Math.ceil(width / 88) + 4;
      for (let i = -1; i < nearCount; i++) {
        const seed = i * 83.91;
        const h = forestBaseHeight * (0.85 + pseudoRandom(seed) * 0.35);
        p.near.push({
          x: i * 88 + (pseudoRandom(seed + 1) - 0.5) * 30,
          height: h,
          width: h * 0.58 * (0.85 + pseudoRandom(seed + 2) * 0.3),
          tiers: Math.floor(pseudoRandom(seed + 3) * 2) + 3,
          swaySpeed: 0.6 + pseudoRandom(seed + 4) * 0.8,
          swayOffset: pseudoRandom(seed + 5) * Math.PI * 2,
        });
      }

      // Faroles rústicos estables
      const lanternRatios = [0.18, 0.52, 0.84];
      lanternRatios.forEach((ratio, idx) => {
        const seed = idx * 91.2;
        p.lanterns.push({
          x: width * ratio + (pseudoRandom(seed) - 0.5) * 25,
          baseY: height + 4,
          height: 82 + pseudoRandom(seed + 1) * 12,
          glowRadius: 95 + pseudoRandom(seed + 2) * 15,
          flickerOffset: pseudoRandom(seed + 3) * Math.PI * 2,
        });
      });
    };

    setupLandscape();

    const initAtmosphere = () => {
      fireflies = [];
      spores = [];
      frostMotes = [];
      snowflakes = [];
      stars = [];
      winterClouds = [];
      iceCrystals = [];
      winterBirds = [];

      if (isDark) {
        // Estrellas
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

        // Luciérnagas
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
        // Nubes nórdicas mejoradas y orgánicas (4 nubes distribuidas)
        const cloudCount = 4;
        for (let i = 0; i < cloudCount; i++) {
          const initX = (width / cloudCount) * i + Math.random() * 60;
          winterClouds.push(createRandomCloud(initX, width));
        }

        // Cristales de hielo (azul blanquecino)
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

        // Esporas de escarcha (azul blanquecino)
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

        // Copos de nieve (azul blanquecino para resaltar en fondo blanco)
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

        // Bandada de aves / patos silvestres en formación horizontal (>)
        flock = createRandomFlock(width * 0.12, width);
      }
    };

    initAtmosphere();

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        setupLandscape();
        initAtmosphere();
      }, 120);
    };
    let resizeTimer: NodeJS.Timeout;
    window.addEventListener("resize", handleResize);

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

    // Dibuja la Luna Realista con cálculo astronómico de fase lunar en tiempo real y posicionamiento seguro (y = 165)
    const drawRealisticMoon = () => {
      const moonX = width * 0.88;
      const moonY = 165; // Posicionada cómodamente DEBAJO del Navbar de 64px (101px de separación)
      const radiusX = 26;
      const radiusY = 25;

      // Cálculo astronómico del ciclo sinódico (29.53 días)
      const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57)).getTime();
      const synodicMonth = 29.53058867 * 24 * 60 * 60 * 1000;
      const diff = Date.now() - refNewMoon;
      const cycle = ((diff % synodicMonth) + synodicMonth) % synodicMonth;
      const phase = cycle / synodicMonth; // 0 = Nueva, 0.25 = Cuarto Creciente, 0.5 = Llena, 0.75 = Cuarto Menguante

      // Iluminación según fase lunar (0 = oscuridad total, 1 = plenilunio)
      const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

      ctx.save();

      // 1. Halo celestial nocturno acotado (radio máx 62px, NUNCA llega al Navbar: 165 - 62 = 103px > 64px)
      const haloRadius = radiusX * 2.4;
      const moonGlow = ctx.createRadialGradient(
        moonX, moonY, radiusX * 0.5,
        moonX, moonY, haloRadius
      );
      moonGlow.addColorStop(0, `rgba(204, 251, 241, ${(0.14 + illumination * 0.24).toFixed(2)})`);
      moonGlow.addColorStop(0.45, `rgba(52, 211, 153, ${(0.03 + illumination * 0.09).toFixed(2)})`);
      moonGlow.addColorStop(1, "transparent");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Disco base de la luna (Luz cenicienta / Earthshine)
      ctx.fillStyle = "rgba(10, 36, 32, 0.65)";
      ctx.beginPath();
      ctx.arc(moonX, moonY, radiusX, 0, Math.PI * 2);
      ctx.fill();

      // 3. Porción iluminada dinámica según la fase astronómica de hoy
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, radiusX, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = "#f0fdfa";

      if (illumination > 0.88) {
        // Luna Llena (disco completo resplandeciente)
        ctx.beginPath();
        ctx.arc(moonX, moonY, radiusX, 0, Math.PI * 2);
        ctx.fill();
      } else if (phase < 0.5) {
        // Fase Creciente (luz en el flanco derecho)
        const terminatorOffset = (phase / 0.25 - 1) * radiusX;
        ctx.beginPath();
        ctx.arc(moonX, moonY, radiusX, -Math.PI / 2, Math.PI / 2, false);
        ctx.ellipse(moonX, moonY, Math.max(1, Math.abs(terminatorOffset)), radiusY, 0, Math.PI / 2, -Math.PI / 2, terminatorOffset < 0);
        ctx.fill();
      } else {
        // Fase Menguante (luz en el flanco izquierdo)
        const terminatorOffset = ((phase - 0.5) / 0.25 - 1) * radiusX;
        ctx.beginPath();
        ctx.arc(moonX, moonY, radiusX, Math.PI / 2, -Math.PI / 2, false);
        ctx.ellipse(moonX, moonY, Math.max(1, Math.abs(terminatorOffset)), radiusY, 0, -Math.PI / 2, Math.PI / 2, terminatorOffset > 0);
        ctx.fill();
      }

      // 4. Mares y cráteres lunares sutiles
      ctx.fillStyle = "rgba(153, 246, 228, 0.22)";
      ctx.beginPath();
      ctx.ellipse(moonX + 6, moonY - 5, 4, 3, 0.3, 0, Math.PI * 2);
      ctx.ellipse(moonX + 10, moonY + 6, 5, 3.5, -0.2, 0, Math.PI * 2);
      ctx.ellipse(moonX - 4, moonY + 4, 3.5, 2.5, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // Fin del clip
      ctx.restore();
    };

    // Dibuja una nube nórdica realista con múltiples lóbulos orgánicos y sombreado invernal
    const drawOrganicWinterCloud = (cloud: WinterCloud) => {
      const cx = cloud.x;
      const cy = cloud.y;
      const w = cloud.width;

      ctx.save();

      // 1. Sombra inferior en gris pizarra frío suave
      ctx.fillStyle = `rgba(148, 163, 184, ${(cloud.alpha * 0.35).toFixed(2)})`;
      for (const puff of cloud.puffs) {
        ctx.beginPath();
        ctx.ellipse(cx + puff.dx, cy + puff.dy + 6, puff.rx * 0.95, puff.ry * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Masa principal de la nube en blanco invernal suave
      const cloudGrad = ctx.createLinearGradient(cx - w * 0.5, cy, cx + w * 0.5, cy);
      cloudGrad.addColorStop(0, "transparent");
      cloudGrad.addColorStop(0.2, `rgba(241, 245, 249, ${(cloud.alpha * 0.85).toFixed(2)})`);
      cloudGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(cloud.alpha * 0.95).toFixed(2)})`);
      cloudGrad.addColorStop(0.8, `rgba(241, 245, 249, ${(cloud.alpha * 0.85).toFixed(2)})`);
      cloudGrad.addColorStop(1, "transparent");

      ctx.fillStyle = cloudGrad;
      for (const puff of cloud.puffs) {
        ctx.beginPath();
        ctx.ellipse(cx + puff.dx, cy + puff.dy, puff.rx, puff.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Realce superior iluminado por el sol nórdico
      ctx.fillStyle = `rgba(255, 255, 255, ${(cloud.alpha * 0.55).toFixed(2)})`;
      for (const puff of cloud.puffs) {
        ctx.beginPath();
        ctx.ellipse(cx + puff.dx, cy + puff.dy - puff.ry * 0.35, puff.rx * 0.75, puff.ry * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Dibuja el Sol de Invierno (Posición segura y rayos estrictamente descendentes hacia el bosque)
    const drawImprovedWinterSun = () => {
      const sunX = width * 0.84;
      const sunY = 165; // Cómodamente abajo del Navbar de 64px (101px de distancia)
      const sunRadius = 32;

      ctx.save();

      // 1. Rayos crepusculares suaves que descienden HACIA EL BOSQUE (NUNCA hacia el navbar)
      const numRays = 5;
      for (let i = 0; i < numRays; i++) {
        // Ángulos descendentes entre 0.45*PI (abajo) y 0.85*PI (abajo-izquierda hacia el valle)
        const rayAngle = Math.PI * 0.45 + (i * 0.09) + Math.sin(clock * 0.2 + i) * 0.02;
        const rayLen = height * 0.75;
        const rayTargetX = sunX + Math.cos(rayAngle) * rayLen;
        const rayTargetY = sunY + Math.sin(rayAngle) * rayLen;

        const rayGrad = ctx.createLinearGradient(sunX, sunY + 10, rayTargetX, rayTargetY);
        rayGrad.addColorStop(0, "rgba(254, 243, 199, 0.18)");
        rayGrad.addColorStop(0.35, "rgba(224, 242, 254, 0.08)");
        rayGrad.addColorStop(1, "transparent");

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY + 10);
        ctx.lineTo(rayTargetX - 35, rayTargetY);
        ctx.lineTo(rayTargetX + 35, rayTargetY);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Halo solar difuso acotado (radio máx 68px, 165 - 68 = 97px > 64px navbar, NUNCA cortado)
      const sunAtmosphere = ctx.createRadialGradient(
        sunX, sunY, sunRadius * 0.5,
        sunX, sunY, sunRadius * 2.1
      );
      sunAtmosphere.addColorStop(0, "rgba(255, 254, 240, 0.95)");
      sunAtmosphere.addColorStop(0.30, "rgba(254, 243, 199, 0.45)");
      sunAtmosphere.addColorStop(0.65, "rgba(253, 230, 138, 0.15)");
      sunAtmosphere.addColorStop(1, "transparent");

      ctx.fillStyle = sunAtmosphere;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // 3. Disco del sol nítido y radiante
      ctx.fillStyle = "rgba(255, 255, 250, 0.99)";
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Dibuja un ave / pato silvestre en vuelo horizontal aerodinámico (>)
    const drawWildBird = (bx: number, by: number, size: number, wingPhase: number) => {
      const flap = Math.sin(clock * 6.5 + wingPhase) * (size * 0.95);
      ctx.save();
      ctx.strokeStyle = "rgba(51, 65, 85, 0.85)";
      ctx.fillStyle = "rgba(71, 85, 105, 0.90)";
      ctx.lineWidth = 1.4;

      // Cuerpo horizontal del ave en vuelo hacia la derecha
      ctx.beginPath();
      ctx.moveTo(bx + size * 1.2, by); // Pico
      ctx.quadraticCurveTo(bx + size * 0.4, by + size * 0.35, bx - size * 0.6, by + size * 0.2); // Pecho
      ctx.lineTo(bx - size * 1.1, by); // Cola
      ctx.quadraticCurveTo(bx + size * 0.4, by - size * 0.35, bx + size * 1.2, by); // Lomo
      ctx.fill();

      // Alas horizontales con aleteo suave
      ctx.beginPath();
      ctx.moveTo(bx - size * 0.3, by - size * 0.2);
      ctx.quadraticCurveTo(bx - size * 0.1, by - size * 0.9 - flap, bx - size * 0.8, by - size * 1.3 - flap);
      ctx.moveTo(bx - size * 0.3, by + size * 0.2);
      ctx.quadraticCurveTo(bx - size * 0.1, by + size * 0.9 + flap, bx - size * 0.8, by + size * 1.3 + flap);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      clock += 0.016;
      ctx.clearRect(0, 0, width, height);

      const globalWind = Math.sin(clock * 0.5) * 0.8;
      const baseY = height + 4;
      const p = persistentTreesRef.current;

      if (isDark) {
        // Fondo nocturno cósmico
        const nightSky = ctx.createLinearGradient(0, 0, 0, height);
        nightSky.addColorStop(0, "#020b12");
        nightSky.addColorStop(0.45, "#05181f");
        nightSky.addColorStop(1, "#092426");
        ctx.fillStyle = nightSky;
        ctx.fillRect(0, 0, width, height);

        // ========================================================
        // 🌲 MODO OSCURO: BOSQUE VIVO (Sin aurora, luna limpia)
        // ========================================================
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

        // Pinos Lejanos (Fijos, no saltan de posición)
        for (let i = 0; i < p.distant.length; i++) {
          drawOrganicPine(p.distant[i], baseY, "rgba(8, 48, 40, 0.55)", "rgba(20, 110, 92, 0.25)", false, globalWind * 0.4);
        }

        // Bruma
        const midMist = ctx.createLinearGradient(0, baseY - 120, 0, baseY);
        midMist.addColorStop(0, "transparent");
        midMist.addColorStop(0.6, "rgba(6, 38, 32, 0.40)");
        midMist.addColorStop(1, "rgba(4, 20, 16, 0.85)");
        ctx.fillStyle = midMist;
        ctx.fillRect(0, baseY - 120, width, 120);

        // Pinos Medios
        for (let i = 0; i < p.mid.length; i++) {
          drawOrganicPine(p.mid[i], baseY, "rgba(10, 62, 52, 0.78)", "rgba(45, 212, 191, 0.30)", false, globalWind * 0.7);
        }

        // Pinos Cercanos (dibujados antes de los faroles)
        for (let i = 0; i < p.near.length; i++) {
          drawOrganicPine(p.near[i], baseY, "rgba(8, 52, 44, 0.92)", "rgba(52, 211, 153, 0.45)", false, globalWind);
        }

        // FAROLES EN PRIMER PLANO (ADELANTE DE TODOS LOS ÁRBOLES - ENCENDIDOS)
        for (const l of p.lanterns) {
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

        // Fondo invernal azul frío nórdico (da contraste a la nieve y respeta el clima)
        const winterSky = ctx.createLinearGradient(0, 0, 0, height);
        winterSky.addColorStop(0, "#bfe2f7");    // Azul nórdico frío superior
        winterSky.addColorStop(0.35, "#dff0fa");  // Azul hielo diurno suave
        winterSky.addColorStop(0.70, "#f0f8fd");  // Bruma fría clara
        winterSky.addColorStop(1, "#f8fafc");     // Nieve en el horizonte
        ctx.fillStyle = winterSky;
        ctx.fillRect(0, 0, width, height);

        // 1. Sol Mejorado y Nubes en Gris Claro
        drawImprovedWinterSun();

        for (const cloud of winterClouds) {
          cloud.x += cloud.speed;
          if (cloud.x > width + cloud.width * 0.6) {
            // Reaparece de forma randómica con nueva altitud, tamaño y velocidad
            Object.assign(cloud, createRandomCloud(-cloud.width * 0.6, width));
          }
          drawOrganicWinterCloud(cloud);
        }

        // 2. Bandada de aves / patos silvestres en formación horizontal (>)
        flock.x += flock.speed;
        if (flock.x > width + 150) {
          // Reaparece de forma randómica con nueva altitud y velocidad (siempre debajo del Navbar)
          flock = createRandomFlock(-130, width);
        }

        for (const b of flock.birds) {
          drawWildBird(flock.x + b.dx, flock.y + b.dy, b.size, b.wingPhase);
        }

        // 3. Destellos de Diamante en azul blanquecino
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
            ctx.fillStyle = `rgba(186, 230, 253, ${(glint * 0.95).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(crystal.x, crystal.y, crystal.size * 0.6, 0, Math.PI * 2);
            ctx.fill();

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

        // 4. Esporas de escarcha en azul blanquecino
        for (const mote of frostMotes) {
          mote.x += mote.vx + Math.sin(clock * mote.swirlSpeed * 10 + mote.swirlOffset) * 0.5 + globalWind * 0.4;
          mote.y += mote.vy;

          if (mote.y < 0) {
            mote.y = height + 10;
            mote.x = Math.random() * width;
          }

          ctx.fillStyle = `rgba(56, 189, 248, ${(mote.alpha * 0.38).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius * 1.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(186, 230, 253, ${(mote.alpha * 0.9).toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(mote.x, mote.y, mote.radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Pinos Lejanos (Fijos, no saltan de posición)
        for (let i = 0; i < p.distant.length; i++) {
          drawOrganicPine(p.distant[i], baseY, "rgba(175, 210, 208, 0.45)", null, false, globalWind * 0.4);
        }

        // 6. Bruma invernal
        const winterMist = ctx.createLinearGradient(0, baseY - 110, 0, baseY);
        winterMist.addColorStop(0, "transparent");
        winterMist.addColorStop(0.6, "rgba(224, 242, 240, 0.45)");
        winterMist.addColorStop(1, "rgba(204, 233, 230, 0.85)");
        ctx.fillStyle = winterMist;
        ctx.fillRect(0, baseY - 110, width, 110);

        // 7. Pinos Medios
        for (let i = 0; i < p.mid.length; i++) {
          drawOrganicPine(p.mid[i], baseY, "rgba(135, 185, 180, 0.65)", null, true, globalWind * 0.7);
        }

        // 8. Pinos Cercanos (dibujados antes de los faroles)
        for (let i = 0; i < p.near.length; i++) {
          drawOrganicPine(p.near[i], baseY, "rgba(105, 160, 155, 0.82)", null, true, globalWind);
        }

        // 9. FAROLES EN PRIMER PLANO (ADELANTE DE TODOS LOS ÁRBOLES - APAGADOS)
        for (const l of p.lanterns) {
          drawRusticLantern(l, true);
        }

        // 10. Nieve en AZUL BLANQUECINO (alta visibilidad)
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

          if (s.depth === 2) {
            ctx.fillStyle = `rgba(56, 189, 248, ${(s.alpha * 0.40).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius * 2.0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = `rgba(186, 230, 253, ${s.alpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();

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
