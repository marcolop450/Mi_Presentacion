"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

interface Pulse {
  sourceIdx: number;
  targetIdx: number;
  progress: number;
  speed: number;
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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener("resize", handleResize);

    const isDark = theme === "dark";
    const nodeCount = Math.min(55, Math.floor((width * height) / 22000));
    const maxDistance = 140;

    let nodes: Node[] = [];
    const pulses: Pulse[] = [];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1,
          baseAlpha: Math.random() * 0.4 + 0.2,
        });
      }
    };
    initNodes();

    // Mouse coordinates para interacción suave con el fondo
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Generar impulsos de datos neuronales aleatorios periódicamente
      if (Math.random() < 0.04 && pulses.length < 6) {
        const sourceIdx = Math.floor(Math.random() * nodes.length);
        // Buscar un nodo cercano conectado
        for (let j = 0; j < nodes.length; j++) {
          if (sourceIdx !== j) {
            const dist = Math.hypot(nodes[sourceIdx].x - nodes[j].x, nodes[sourceIdx].y - nodes[j].y);
            if (dist < maxDistance) {
              pulses.push({
                sourceIdx,
                targetIdx: j,
                progress: 0,
                speed: 0.8 + Math.random() * 0.6,
              });
              break;
            }
          }
        }
      }

      // 1. Actualizar posiciones de los nodos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Rebote en bordes de pantalla
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Repulsión magnética sutil del mouse
        const mDist = Math.hypot(n.x - mouseX, n.y - mouseY);
        if (mDist < 120 && mDist > 0) {
          const force = (120 - mDist) / 120;
          const angle = Math.atan2(n.y - mouseY, n.x - mouseX);
          n.x += Math.cos(angle) * force * 1.2;
          n.y += Math.sin(angle) * force * 1.2;
        }
      }

      // 2. Dibujar conexiones neuronales (sinapsis)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.14);
            ctx.strokeStyle = isDark
              ? `rgba(0, 180, 255, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Dibujar impulsos de datos neuronales en movimiento
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.progress += p.speed * dt;

        if (p.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const src = nodes[p.sourceIdx];
        const tgt = nodes[p.targetIdx];
        if (!src || !tgt) continue;

        const px = src.x + (tgt.x - src.x) * p.progress;
        const py = src.y + (tgt.y - src.y) * p.progress;

        ctx.fillStyle = isDark ? "#00F0FF" : "#2563EB";
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Resplandor del impulso
        ctx.fillStyle = isDark ? "rgba(0, 240, 255, 0.3)" : "rgba(37, 99, 235, 0.2)";
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Dibujar los nodos
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = isDark
          ? `rgba(0, 240, 255, ${n.baseAlpha})`
          : `rgba(2, 132, 199, ${n.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden" aria-hidden="true">
      {/* Canvas interactivo de constelación y pulsos neuronales */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Malla de cuadrícula geométrica en perspectiva inferior */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.16] transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(0, 240, 255, 0.3) 1px, transparent 1px)`
            : `radial-gradient(rgba(2, 132, 199, 0.25) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Auroras de iluminación ambiental profunda */}
      <div
        className={`absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-blue-600/15" : "bg-sky-400/15"
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-cyan-500/12" : "bg-indigo-400/10"
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-blue-700/12" : "bg-blue-300/15"
        }`}
      />
    </div>
  );
}
