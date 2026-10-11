export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      {/* Radial mesh gradient 1: Top-right drifting atmospheric tone */}
      <div
        className="absolute -top-[12%] -right-[8%] w-[55vw] h-[55vw] max-w-[760px] max-h-[760px] rounded-full blur-[130px] opacity-70 dark:opacity-25 bg-blue-100/60 dark:bg-blue-950/40 animate-drift-primary"
      />

      {/* Radial mesh gradient 2: Bottom-left counter-drifting subtle slate/sky tone */}
      <div
        className="absolute -bottom-[14%] -left-[8%] w-[50vw] h-[50vw] max-w-[680px] max-h-[680px] rounded-full blur-[140px] opacity-60 dark:opacity-20 bg-sky-100/50 dark:bg-slate-800/35 animate-drift-secondary"
      />

      {/* Radial mesh gradient 3: Subtle central ambient wash */}
      <div
        className="absolute top-1/3 left-1/3 w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] rounded-full blur-[160px] opacity-40 dark:opacity-15 bg-slate-200/40 dark:bg-sky-950/20 animate-drift-ambient"
      />

      <style>{`
        @keyframes driftPrimary {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-6%, 8%, 0) scale(1.06);
          }
        }
        @keyframes driftSecondary {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(7%, -6%, 0) scale(0.94);
          }
        }
        @keyframes driftAmbient {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-4%, -5%, 0) scale(1.04);
          }
        }
        .animate-drift-primary {
          animation: driftPrimary 34s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animate-drift-secondary {
          animation: driftSecondary 40s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animate-drift-ambient {
          animation: driftAmbient 48s ease-in-out infinite alternate;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-drift-primary,
          .animate-drift-secondary,
          .animate-drift-ambient {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
