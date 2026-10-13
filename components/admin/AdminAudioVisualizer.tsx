"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminAudio } from "./AdminAudioContext";
import {
  Activity,
  BarChart3,
  Radio,
  Minimize2,
  Maximize2,
  Sparkles,
  Volume2,
} from "lucide-react";

type VisualizerMode = "wave" | "bars" | "orb";

export default function AdminAudioVisualizer() {
  const { isPlaying, currentTrack, getFrequencyData, getBassEnergy } = useAdminAudio();
  const [mode, setMode] = useState<VisualizerMode>("wave");
  const [isMinimized, setIsMinimized] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Sistema de partículas reactivas para el modo "orb" y "wave"
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[]
  >([]);

  useEffect(() => {
    // Si no está sonando, cancelar animación
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clock = 0;

    // Inicializar partículas si está vacío
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 28; i++) {
        particlesRef.current.push({
          x: Math.random() * 280,
          y: Math.random() * 80,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          size: Math.random() * 2.5 + 1.2,
          alpha: Math.random() * 0.7 + 0.3,
          hue: Math.random() > 0.5 ? 168 : 190, // Teal / Cyan
        });
      }
    }

    const render = () => {
      clock += 0.05;
      const width = (canvas.width = canvas.offsetWidth);
      const height = (canvas.height = canvas.offsetHeight);

      ctx.clearRect(0, 0, width, height);

      const freqData = getFrequencyData();
      const bass = getBassEnergy(); // 0 a 1

      // -------------------------------------------------------------
      // MODO 1: ONDA LÍQUIDA SINTÉTICA (NEON WAVE)
      // -------------------------------------------------------------
      if (mode === "wave") {
        const midY = height / 2;
        const sliceCount = 36;
        const sliceWidth = width / (sliceCount - 1);

        // Capa 1: Sombra / Reflejo difuso
        ctx.beginPath();
        ctx.moveTo(0, midY);
        for (let i = 0; i < sliceCount; i++) {
          const freqIndex = Math.floor((i / sliceCount) * (freqData.length / 2));
          const freqVal = freqData[freqIndex] || 0;
          const amp = (freqVal / 255) * (height * 0.42) * (1 + bass * 0.6);
          const wavePhase = Math.sin(clock * 3 + i * 0.35) * amp;
          const x = i * sliceWidth;
          const y = midY + wavePhase;

          if (i === 0) ctx.moveTo(x, y);
          else {
            const prevX = (i - 1) * sliceWidth;
            const cX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, midY, cX, y);
          }
        }
        ctx.strokeStyle = "rgba(45, 212, 191, 0.25)";
        ctx.lineWidth = 6;
        ctx.stroke();

        // Capa 2: Onda Primaria Brillante (Teal / Cyan)
        const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
        waveGrad.addColorStop(0, "#10b981");
        waveGrad.addColorStop(0.5, "#14b8a6");
        waveGrad.addColorStop(1, "#06b6d4");

        ctx.beginPath();
        ctx.moveTo(0, midY);
        for (let i = 0; i < sliceCount; i++) {
          const freqIndex = Math.floor((i / sliceCount) * (freqData.length / 2));
          const freqVal = freqData[freqIndex] || 0;
          const amp = (freqVal / 255) * (height * 0.38) * (1 + bass * 0.5);
          const wavePhase = Math.sin(clock * 4 + i * 0.4) * amp;
          const x = i * sliceWidth;
          const y = midY + wavePhase;

          if (i === 0) ctx.moveTo(x, y);
          else {
            const prevX = (i - 1) * sliceWidth;
            const cX = (prevX + x) / 2;
            ctx.quadraticCurveTo(prevX, midY, cX, y);
          }
        }
        ctx.strokeStyle = waveGrad;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = "#14b8a6";
        ctx.shadowBlur = 8 + bass * 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Partículas flotantes que rebotan con los graves
        const particles = particlesRef.current;
        particles.forEach((p) => {
          p.x += p.vx * (1 + bass * 1.5);
          p.y += p.vy * (1 + bass * 1.5);
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.alpha * (0.4 + bass * 0.6)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + bass * 0.8), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // -------------------------------------------------------------
      // MODO 2: BARRAS DE FRECUENCIA ECUALIZADOR (CYBER SPECTRUM)
      // -------------------------------------------------------------
      else if (mode === "bars") {
        const barCount = 28;
        const totalGap = 3;
        const barWidth = (width - (barCount - 1) * totalGap) / barCount;

        for (let i = 0; i < barCount; i++) {
          const freqIndex = Math.floor((i / barCount) * (freqData.length * 0.65));
          const freqVal = freqData[freqIndex] || 0;
          const rawHeight = (freqVal / 255) * (height * 0.85);
          const barHeight = Math.max(4, rawHeight * (0.8 + bass * 0.4));
          const x = i * (barWidth + totalGap);
          const y = height - barHeight;

          // Gradiente de barra
          const barGrad = ctx.createLinearGradient(x, height, x, y);
          barGrad.addColorStop(0, "rgba(16, 185, 129, 0.4)");
          barGrad.addColorStop(0.6, "rgba(20, 184, 166, 0.85)");
          barGrad.addColorStop(1, "rgba(6, 182, 212, 1.0)");

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          ctx.fill();

          // Cap/Punta brillante en la cima de cada barra
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(x, Math.max(0, y - 2.5), barWidth, 2, [1, 1, 1, 1]);
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // MODO 3: ORBE REACTIVO PULSANTE (AUDIO ORB REACTOR)
      // -------------------------------------------------------------
      else if (mode === "orb") {
        const cX = width / 2;
        const cY = height / 2;
        const baseR = Math.min(width, height) * 0.28;
        const orbR = baseR + bass * 18;

        // Halo de resplandor pulsante
        const glow = ctx.createRadialGradient(cX, cY, 0, cX, cY, orbR * 2.2);
        glow.addColorStop(0, "rgba(20, 184, 166, 0.55)");
        glow.addColorStop(0.5, "rgba(6, 182, 212, 0.2)");
        glow.addColorStop(1, "transparent");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cX, cY, orbR * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Anillo exterior con picos de frecuencia radial
        ctx.beginPath();
        const radialPoints = 32;
        for (let i = 0; i <= radialPoints; i++) {
          const angle = (i / radialPoints) * Math.PI * 2;
          const fIndex = Math.floor((i / radialPoints) * 20);
          const fVal = (freqData[fIndex] || 0) / 255;
          const r = orbR + fVal * 16;
          const pX = cX + Math.cos(angle) * r;
          const pY = cY + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(pX, pY);
          else ctx.lineTo(pX, pY);
        }
        ctx.closePath();
        ctx.strokeStyle = "#14b8a6";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Núcleo central brillante
        const coreGrad = ctx.createRadialGradient(cX, cY, 0, cX, cY, orbR);
        coreGrad.addColorStop(0, "#f0fdfa");
        coreGrad.addColorStop(0.6, "#2dd4bf");
        coreGrad.addColorStop(1, "#0d9488");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cX, cY, orbR * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, mode, getFrequencyData, getBassEnergy]);

  // Si no está reproduciendo, no mostrar nada en pantalla
  if (!isPlaying) return null;

  return (
    <>
      {/* 1. Resplandor Ambiental reactivo en el fondo del Panel Administrativo */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-500/10 via-teal-500/5 to-transparent z-20 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* 2. HUD Flotante del Visualizador Reactivo en vivo (exclusivo de Admin) */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in select-none"
        role="region"
        aria-label="Visualizador de audio en tiempo real"
      >
        <div className="rounded-3xl bg-slate-900/90 dark:bg-[#041519]/95 border border-teal-500/60 shadow-2xl shadow-teal-500/20 backdrop-blur-xl overflow-hidden p-3.5 sm:p-4 text-white flex flex-col gap-3 min-w-[280px] sm:min-w-[340px] max-w-sm">
          {/* Cabecera del Visualizador */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold block truncate">
                  Visualizador Reactivo KIRIS
                </span>
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentTrack.title}
                </p>
              </div>
            </div>

            {/* Selectores de Modo y Minimizar */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setMode("wave")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  mode === "wave"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title="Modo Onda Líquida"
              >
                <Activity className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMode("bars")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  mode === "bars"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title="Modo Ecualizador de Barras"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setMode("orb")}
                className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                  mode === "orb"
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
                title="Modo Reactor Radial"
              >
                <Radio className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer ml-1"
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Lienzo Canvas Reactivo (solo visible si no está minimizado) */}
          {!isMinimized && (
            <div className="relative w-full h-24 sm:h-28 rounded-2xl bg-black/40 border border-teal-500/30 overflow-hidden flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                width={320}
                height={110}
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-950/80 border border-teal-500/40 text-[9px] font-mono text-teal-300">
                <Sparkles className="w-2.5 h-2.5 text-teal-400 animate-spin-slow" />
                <span>Audio Reactivo</span>
              </div>
            </div>
          )}

          {/* Pie de estado */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-teal-300">
              <Volume2 className="w-3 h-3 text-teal-400" />
              <span>Sincronizado a frecuencias</span>
            </span>
            <span className="capitalize">{mode === "wave" ? "Onda" : mode === "bars" ? "Barras" : "Orbe"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
