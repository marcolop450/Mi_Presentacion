"use client";

import { useTheme } from "./ThemeProvider";

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      {/* Malla de cuadrícula tecnológica sutil */}
      <div
        className={`absolute inset-0 opacity-[0.25] dark:opacity-[0.18] transition-opacity duration-500`}
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(0, 163, 255, 0.4) 1px, transparent 1px)`
            : `radial-gradient(rgba(2, 132, 199, 0.35) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Orbes de luz con animación suave en CSS */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDark ? "bg-blue-600/10" : "bg-blue-400/10"
        }`}
        style={{ animationDuration: "8s" }}
      />
      <div
        className={`absolute top-1/2 -right-32 w-[450px] h-[450px] rounded-full blur-3xl animate-pulse ${
          isDark ? "bg-cyan-500/10" : "bg-cyan-400/08"
        }`}
        style={{ animationDuration: "12s" }}
      />
      <div
        className={`absolute -bottom-32 left-1/3 w-80 h-80 rounded-full blur-3xl animate-pulse ${
          isDark ? "bg-blue-700/10" : "bg-sky-300/10"
        }`}
        style={{ animationDuration: "10s" }}
      />
    </div>
  );
}
