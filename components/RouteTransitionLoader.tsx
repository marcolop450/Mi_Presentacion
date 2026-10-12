"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastPathname = useRef(pathname);

  // Iniciar animación de carga con modal de pantalla completa
  const startLoading = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setLoading(true);
    setProgress(20);

    // Incrementar progreso dinámicamente
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + 14;
        if (prev < 85) return prev + 6;
        if (prev < 95) return prev + 1.5;
        return prev;
      });
    }, 100);

    // Timeout de seguridad: cerrar tras 5 segundos si una ruta se congela
    timerRef.current = setTimeout(() => {
      finishLoading();
    }, 5000);
  };

  // Finalizar carga suavemente
  const finishLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 280);
  };

  // Interceptar clics en enlaces de navegación interna
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

  // Al completar la navegación de ruta
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
      {/* Barra de progreso superior ultra delgada */}
      <div className="fixed top-0 left-0 right-0 h-[4px] bg-black/10 dark:bg-white/10 z-[100000]">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-150 ease-out shadow-[0_0_15px_rgba(45,212,191,0.9)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tarjeta Modal Centrada con Desenfoque */}
      <div className="relative w-[90%] max-w-sm mx-4 p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl shadow-teal-950/30 text-center flex flex-col items-center backdrop-blur-xl animate-in zoom-in-95 duration-200">
        {/* Emblema KIRIS con anillo resplandeciente */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#071915] p-2 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-teal-400/40 border-t-transparent animate-spin" />
        </div>

        {/* Textos Informativos */}
        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Cargando sección</span>
          <Loader2 className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-spin" />
        </h3>

        <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1.5 font-sans">
          Sincronizando el ecosistema KIRIS...
        </p>

        {/* Barra de progreso interna */}
        <div className="w-full bg-slate-200/80 dark:bg-teal-950/80 rounded-full h-2 mt-5 overflow-hidden border border-slate-300/80 dark:border-teal-800/80">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
