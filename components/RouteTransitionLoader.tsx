"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPathname = useRef(pathname);

  // Iniciar animación de carga suave y sin ruido visual
  const startLoading = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setLoading(true);
    setProgress(25);

    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 65) return prev + 12;
        if (prev < 88) return prev + 5;
        if (prev < 96) return prev + 1.2;
        return prev;
      });
    }, 110);

    // Timeout de seguridad: cerrar tras 4.5 segundos si la ruta se congela
    timerRef.current = setTimeout(() => {
      finishLoading();
    }, 4500);
  };

  const finishLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 240);
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(target.href, window.location.href);
        if (targetUrl.origin === window.location.origin) {
          const currentPath = window.location.pathname + window.location.search;
          const destinationPath = targetUrl.pathname + targetUrl.search;

          if (currentPath !== destinationPath) {
            startLoading();
          }
        }
      } catch {
        // Enlace no válido
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;
      finishLoading();
    }
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <aside
      aria-label="Cargando nueva pantalla"
      aria-live="assertive"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-300 ${
        loading
          ? "opacity-100 backdrop-blur-md bg-slate-900/40 dark:bg-black/65"
          : "opacity-0 pointer-events-none backdrop-blur-none"
      }`}
    >
      {/* Tarjeta Modal Centrada con un ÚNICO indicador de progreso tranquilo */}
      <div className="relative w-[88%] max-w-sm mx-4 p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl shadow-teal-950/25 text-center flex flex-col items-center backdrop-blur-xl animate-in zoom-in-95 duration-200">
        {/* Emblema KIRIS sobrio y limpio (sin aros que giran) */}
        <div className="relative mb-5">
          <div className="w-18 h-18 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[20px] bg-white dark:bg-[#071915] p-2.5 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Texto Informativo limpio (sin spinner giratorio al lado del título) */}
        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          Cargando sección
        </h3>

        <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1 font-sans">
          Sincronizando el ecosistema KIRIS...
        </p>

        {/* ÚNICA barra de progreso elegante en la base de la tarjeta */}
        <div className="w-full bg-slate-200/80 dark:bg-teal-950/80 rounded-full h-1.5 mt-5 overflow-hidden border border-slate-300/80 dark:border-teal-800/80">
          <div
            className="bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 h-full rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
