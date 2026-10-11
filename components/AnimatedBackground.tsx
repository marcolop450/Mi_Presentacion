"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Pulse {
  fromIdx: number;
  toIdx: number;
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

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    const isDark = theme === "dark";

    // Tropical & Cool Palette Colors (Mint, Emerald, Teal, Aqua)
    const tropicalColors = isDark
      ? ["#2dd4bf", "#10b981", "#06b6d4", "#34d399", "#5eead4"]
      : ["#0d9488", "#059669", "#0891b2", "#10b981", "#14b8a6"];

    const particleCount = Math.min(65, Math.floor((width * height) / 20000) + 20);
    const maxConnectionDistance = 150;

    let particles: Particle[] = [];
    const pulses: Pulse[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2.2 + 1.2,
          color: tropicalColors[Math.floor(Math.random() * tropicalColors.length)],
          alpha: Math.random() * 0.45 + 0.35,
        });
      }
    };
    initParticles();

    // Mouse coordinates for gentle interactive attraction
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
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Periodically trigger a data packet pulse along a connection
      if (Math.random() < 0.06 && pulses.length < 8) {
        const fromIdx = Math.floor(Math.random() * particles.length);
        for (let j = 0; j < particles.length; j++) {
          if (fromIdx !== j) {
            const dist = Math.hypot(
              particles[fromIdx].x - particles[j].x,
              particles[fromIdx].y - particles[j].y
            );
            if (dist < maxConnectionDistance) {
              pulses.push({
                fromIdx,
                toIdx: j,
                progress: 0,
                speed: 1.0 + Math.random() * 0.8,
              });
              break;
            }
          }
        }
      }

      // 1. Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Interactive mouse repulsion/ripple
        const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (distToMouse < 120 && distToMouse > 0) {
          const force = (120 - distToMouse) / 120;
          const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        }
      }

      // 2. Draw synaptical connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDistance) {
            const strength = 1 - dist / maxConnectionDistance;
            const alpha = strength * (isDark ? 0.35 : 0.22);
            ctx.strokeStyle = isDark
              ? `rgba(45, 212, 191, ${alpha.toFixed(3)})`
              : `rgba(13, 148, 136, ${alpha.toFixed(3)})`;
            ctx.lineWidth = strength * 1.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw moving data pulses along the synapses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pulse = pulses[k];
        pulse.progress += pulse.speed * dt;

        if (pulse.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const p1 = particles[pulse.fromIdx];
        const p2 = particles[pulse.toIdx];
        if (!p1 || !p2) continue;

        const pulseX = p1.x + (p2.x - p1.x) * pulse.progress;
        const pulseY = p1.y + (p2.y - p1.y) * pulse.progress;

        // Glowing packet dot
        ctx.fillStyle = isDark ? "#5eead4" : "#0f766e";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Packet aura
        ctx.fillStyle = isDark ? "rgba(45, 212, 191, 0.45)" : "rgba(13, 148, 136, 0.35)";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

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
      {/* 60fps Tropical Synaptic Neural Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Tropical & Cool Ambient Glow Auroras (Teal, Mint, Aqua) */}
      <div
        className={`absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-teal-500/15" : "bg-emerald-300/25"
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 w-[580px] h-[580px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-emerald-500/12" : "bg-teal-300/20"
        }`}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-cyan-600/10" : "bg-teal-200/20"
        }`}
      />
    </div>
  );
}
