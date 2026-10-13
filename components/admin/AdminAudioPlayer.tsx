"use client";

import { useAdminAudio, ADMIN_PLAYLIST } from "./AdminAudioContext";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Activity,
} from "lucide-react";

export default function AdminAudioPlayer() {
  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    handleNext,
    handlePrev,
    toggleMute,
    getBassEnergy,
  } = useAdminAudio();

  const bass = getBassEnergy();

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="shrink-0 pt-2 pb-1 border-t border-slate-200 dark:border-teal-900/60">
      {/* Mini reproductor de audio integrado para el administrador */}
      <div className="p-3 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-200 dark:border-teal-800/60 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                isPlaying
                  ? "bg-teal-600 text-white shadow-xs"
                  : "bg-teal-100 text-teal-800 dark:bg-teal-900/70 dark:text-teal-300"
              }`}
            >
              <Disc3 className={`w-4 h-4 ${isPlaying ? "animate-spin" : ""}`} />
            </div>

            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white block truncate leading-tight">
                {currentTrack.title}
              </span>
              <span className="text-[9px] font-mono text-teal-700 dark:text-teal-300/80 block truncate">
                {currentTrack.artist} ({currentTrackIndex + 1}/{ADMIN_PLAYLIST.length})
              </span>
            </div>
          </div>

          {/* Animación de barras reactivas que crecen con la música */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 shrink-0 px-1" title="Ecualizador activo">
              <span
                className="w-1 bg-teal-500 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, 4 + bass * 10)}px` }}
              />
              <span
                className="w-1 bg-teal-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(3, 3 + bass * 14)}px` }}
              />
              <span
                className="w-1 bg-teal-300 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(5, 5 + bass * 12)}px` }}
              />
              <span
                className="w-1 bg-emerald-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(2, 2 + bass * 9)}px` }}
              />
            </div>
          )}
        </div>

        {/* Barra de progreso de tiempo */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 dark:bg-teal-900/40 h-1 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-200"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-teal-400/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controles de reproducción */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-700 dark:text-teal-300/70 dark:hover:text-teal-200 transition cursor-pointer"
            title={isMuted ? "Activar audio" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 dark:text-teal-200/80 dark:hover:text-white transition cursor-pointer"
              title="Pista anterior"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95 cursor-pointer"
              title={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 dark:text-teal-200/80 dark:hover:text-white transition cursor-pointer"
              title="Siguiente pista"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400 dark:text-teal-300/60 font-semibold">
            Track {currentTrackIndex + 1}
          </span>
        </div>
      </div>
    </div>
  );
}
