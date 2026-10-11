"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
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
    const particleCount = Math.min(60, Math.floor((width * height) / 24000) + 15);
    const maxConnectionDistance = 140;

    let particles: Particle[] = [];
    const pulses: Pulse[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.25,
        });
      }
    };
    initParticles();

    // Mouse tracking for subtle attraction
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

      // Periodically trigger a data pulse along a connection
      if (Math.random() < 0.05 && pulses.length < 8) {
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
                speed: 0.9 + Math.random() * 0.8,
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

        // Bounce on boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle interactive mouse push
        const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (distToMouse < 110 && distToMouse > 0) {
          const force = (110 - distToMouse) / 110;
          const angle = Math.atan2(p.y - mouseY, p.x - mouseX);
          p.x += Math.cos(angle) * force * 1.2;
          p.y += Math.sin(angle) * force * 1.2;
        }
      }

      // 2. Draw connections (synapses)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectionDistance) {
            const strength = 1 - dist / maxConnectionDistance;
            const alpha = strength * (isDark ? 0.28 : 0.18);
            ctx.strokeStyle = isDark
              ? `rgba(0, 240, 255, ${alpha.toFixed(3)})`
              : `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.lineWidth = strength * 1.2;
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

        ctx.fillStyle = isDark ? "#00f0ff" : "#2563eb";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow aura around pulse
        ctx.fillStyle = isDark ? "rgba(0, 240, 255, 0.3)" : "rgba(37, 99, 235, 0.25)";
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = isDark
          ? `rgba(56, 189, 248, ${p.alpha.toFixed(2)})`
          : `rgba(2, 132, 199, ${p.alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
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
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* 60fps Interactive Neural/Synaptic Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Ambient Glow Blobs */}
      <div
        className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-blue-600/12" : "bg-sky-400/15"
        }`}
      />
      <div
        className={`absolute top-1/2 -right-32 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
          isDark ? "bg-cyan-500/10" : "bg-blue-500/10"
        }`}
      />
    </div>
  );
}
