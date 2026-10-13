"use client";

import { useEffect, useState, useRef } from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Cloud,
  Loader2,
  Maximize2,
  Minimize2,
  GripHorizontal,
  RotateCcw,
} from "lucide-react";

interface DrivePreviewModalProps {
  isOpen: boolean;
  title: string;
  url: string;
  onClose: () => void;
}

export default function DrivePreviewModal({
  isOpen,
  title,
  url,
  onClose,
}: DrivePreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Posición para arrastre (SOLO activo en escritorio con ratón)
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  // Detección de dispositivo de escritorio vs móvil
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Resetear estados al abrir
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setIsDragging(false);

      // Temporizador de seguridad: si Google Drive no dispara onLoad por políticas de iframe,
      // el spinner se oculta automáticamente a los 2 segundos para no bloquear la vista del usuario
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, url]);

  useEffect(() => {
    if (isFullScreen) {
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isFullScreen]);

  // Tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Lógica de arrastre: EXCLUSIVAMENTE para escritorio con ratón
  const handleStartDrag = (clientX: number, clientY: number) => {
    if (isFullScreen || !isDesktop) return;
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: position.x,
      initialPosY: position.y,
    };
  };

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newX = dragRef.current.initialPosX + deltaX;
      const newY = dragRef.current.initialPosY + deltaY;

      // Límites estrictos: La cabecera NUNCA puede subir más de 30px hacia arriba
      // garantizando que los botones y la barra superior siempre queden dentro de la pantalla
      const maxX = window.innerWidth * 0.35;
      const minX = -window.innerWidth * 0.35;
      const minY = -30;
      const maxY = window.innerHeight * 0.35;

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWindowBlur = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("blur", handleWindowBlur);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isDragging, isDesktop]);

  // Convertir URL de Google Drive a URL embebible de previsualización
  const getEmbedUrl = (rawUrl: string): string => {
    try {
      const fileMatch = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileMatch && fileMatch[1]) {
        return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
      }

      const idMatch = rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }

      const folderMatch = rawUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
      if (folderMatch && folderMatch[1]) {
        return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
      }

      return rawUrl;
    } catch {
      return rawUrl;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDragging) onClose();
      }}
      className="fixed inset-0 z-[100000] flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Overlay transparente global activo solo en arrastre de escritorio */}
      {isDragging && isDesktop && (
        <div className="fixed inset-0 z-[100005] cursor-grabbing select-none" />
      )}

      <div
        style={{
          transform: isFullScreen || !isDesktop ? "none" : `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        className={`w-full bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-shadow select-none ${
          isFullScreen
            ? "fixed inset-1 sm:inset-4 w-[calc(100%-0.5rem)] sm:w-[calc(100%-2rem)] h-[calc(100%-0.5rem)] sm:h-[calc(100%-2rem)] max-w-none"
            : "max-w-5xl h-[88dvh] sm:h-[85vh] my-auto"
        } ${isDragging ? "shadow-teal-500/25 ring-2 ring-teal-500" : ""}`}
      >
        {/* Cabecera del Visor - Siempre visible en la parte superior */}
        <div
          onDoubleClick={() => isDesktop && setPosition({ x: 0, y: 0 })}
          onMouseDown={(e) => {
            if (!isDesktop) return;
            if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
            e.preventDefault();
            handleStartDrag(e.clientX, e.clientY);
          }}
          className={`px-3.5 sm:px-6 py-3 border-b border-slate-200 dark:border-teal-900/60 flex items-center justify-between gap-2.5 bg-slate-50 dark:bg-teal-950/90 shrink-0 ${
            isDesktop && !isFullScreen ? "cursor-grab active:cursor-grabbing" : ""
          }`}
          title={isDesktop && !isFullScreen ? "Haz clic y arrastra para mover (o doble clic para centrar)" : ""}
        >
          {/* Título y Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Visor KIRIS
                </span>
                {isDesktop && !isFullScreen && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-teal-300/70 px-2 py-0.2 rounded bg-slate-200/60 dark:bg-teal-900/50">
                    <GripHorizontal className="w-3 h-3" />
                    <span>Arrastrable</span>
                  </span>
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h3>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Botón Recentrar en escritorio si se ha movido */}
            {isDesktop && (position.x !== 0 || position.y !== 0) && !isFullScreen && (
              <button
                type="button"
                onClick={() => setPosition({ x: 0, y: 0 })}
                className="p-1.5 rounded-lg text-[11px] font-mono text-teal-700 dark:text-teal-300 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer flex items-center gap-1"
                title="Restablecer al centro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Centrar</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer"
              title="Copiar enlace directo"
              aria-label="Copiar enlace directo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition"
              title="Abrir en pestaña nueva de Google Drive"
              aria-label="Abrir en pestaña nueva"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:block p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer"
              title={isFullScreen ? "Restaurar tamaño" : "Pantalla completa"}
              aria-label={isFullScreen ? "Restaurar tamaño" : "Pantalla completa"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Botón de Cierre Destacado y fácil de pulsar en móvil */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition cursor-pointer ml-1"
              title="Cerrar visor"
              aria-label="Cerrar visor"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo con Iframe Embebido */}
        <div className="relative flex-1 w-full bg-slate-100 dark:bg-[#040e11] overflow-hidden select-auto">
          {/* Overlay de carga no bloqueante */}
          {isLoading && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-3 bg-white/70 dark:bg-[#07191d]/70 backdrop-blur-xs z-10 transition-opacity duration-300">
              <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
              <p className="text-xs text-slate-700 dark:text-teal-200 font-mono font-medium">
                Cargando documento en visor integrado...
              </p>
            </div>
          )}

          <iframe
            src={embedUrl}
            title={title}
            className={`w-full h-full border-0 ${isDragging ? "pointer-events-none select-none" : ""}`}
            allow="autoplay"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
