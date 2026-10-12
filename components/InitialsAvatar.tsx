"use client";

import { useState } from "react";

interface InitialsAvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "rounded" | "circle";
  alt?: string;
}

const GRADIENT_PALETTES = [
  "from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-teal-500/20",
  "from-teal-600 via-cyan-600 to-blue-600 text-white shadow-cyan-500/20",
  "from-cyan-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/20",
  "from-blue-600 via-teal-500 to-emerald-500 text-white shadow-teal-500/20",
  "from-emerald-600 via-teal-600 to-teal-800 text-white shadow-teal-600/20",
  "from-teal-500 via-emerald-400 to-cyan-500 text-slate-900 shadow-emerald-400/20",
];

export default function InitialsAvatar({
  src,
  name,
  size = "md",
  className = "",
  shape = "rounded",
  alt,
}: InitialsAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Extraer iniciales inteligentes (máx 2 caracteres)
  const getInitials = (text: string): string => {
    if (!text || !text.trim()) return "K";
    const cleaned = text.trim();

    // Palabras ignorables
    const stopWords = new Set(["de", "del", "la", "el", "en", "y", "a", "los", "las", "por", "para"]);
    const words = cleaned
      .split(/\s+/)
      .filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()));

    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      if (words[0].length >= 2) {
        return words[0].slice(0, 2).toUpperCase();
      }
      return words[0][0].toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase();
  };

  // Selector de gradiente determinista según el nombre
  const getGradient = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % GRADIENT_PALETTES.length;
    return GRADIENT_PALETTES[index];
  };

  const sizeClasses = {
    xs: "w-7 h-7 text-[10px]",
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-2xl",
  }[size];

  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  const initials = getInitials(name);
  const gradient = getGradient(name);

  // Si tiene imagen válida y no ha fallado, renderizar imagen
  if (src && !imageError) {
    return (
      <div
        className={`relative overflow-hidden shrink-0 border border-slate-300 dark:border-teal-700/60 shadow-xs ${sizeClasses} ${roundedClass} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: Avatar generativo con iniciales y gradiente KIRIS
  return (
    <div
      aria-label={name}
      className={`shrink-0 flex items-center justify-center font-display font-black tracking-tight select-none bg-gradient-to-tr shadow-md border border-white/20 dark:border-white/10 ${gradient} ${sizeClasses} ${roundedClass} ${className}`}
    >
      <span>{initials}</span>
    </div>
  );
}
