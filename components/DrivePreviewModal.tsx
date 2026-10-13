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

  // Estado para mover / arrastrar la ventana libremente
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialPosX: number; initialPosY: number }>({
    startX: 0,
    startY: 0,
    initialPosX: 0,
    initialPosY: 0,
  });

  // Resetear posición al abrir o al cambiar modo pantalla completa
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setIsDragging(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isFullScreen) {
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isFullScreen]);

  // Escuchar tecla Escape para cerrar
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

  // Lógica de arrastre con ratón o táctil
  const handleStartDrag = (clientX: number, clientY: number) => {
    if (isFullScreen) return;
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      initialPosX: position.x,
      initialPosY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      // Limitar el arrastre para que la cabecera no se pierda fuera de la pantalla
      const newX = dragRef.current.initialPosX + deltaX;
      const newY = dragRef.current.initialPosY + deltaY;

      setPosition({
        x: Math.max(-window.innerWidth / 2 + 100, Math.min(window.innerWidth / 2 - 100, newX)),
        y: Math.max(-window.innerHeight / 2 + 60, Math.min(window.innerHeight / 2 - 60, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      const deltaX = e.touches[0].clientX - dragRef.current.startX;
      const deltaY = e.touches[0].clientY - dragRef.current.startY;
      const newX = dragRef.current.initialPosX + deltaX;
      const newY = dragRef.current.initialPosY + deltaY;

      setPosition({
        x: Math.max(-window.innerWidth / 2 + 100, Math.min(window.innerWidth / 2 - 100, newX)),
        y: Math.max(-window.innerHeight / 2 + 60, Math.min(window.innerHeight / 2 - 60, newY)),
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    const handleWindowBlur = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("blur", handleWindowBlur);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isDragging]);

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
      {/* Overlay transparente global activo durante el arrastre: previene que el iframe intercepte el puntero */}
      {isDragging && (
        <div className="fixed inset-0 z-[100005] cursor-grabbing select-none" />
      )}

      <div
        style={{
          transform: isFullScreen ? "none" : `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        className={`w-full bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-shadow select-none ${
          isFullScreen
            ? "fixed inset-2 sm:inset-4 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] h-[calc(100%-1rem)] sm:h-[calc(100%-2rem)] max-w-none"
            : "max-w-5xl h-[88vh] sm:h-[85vh]"
        } ${isDragging ? "shadow-teal-500/25 ring-2 ring-teal-500" : ""}`}
      >
        {/* Cabecera del Visor - Arrastrable */}
        <div
          onDoubleClick={() => setPosition({ x: 0, y: 0 })}
          onMouseDown={(e) => {
            // Evitar que el clic en botones o enlaces dispare el arrastre
            if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
            e.preventDefault();
            handleStartDrag(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
            if (e.touches[0]) {
              handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className={`px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-teal-900/60 flex items-center justify-between gap-3 bg-slate-50/95 dark:bg-teal-950/70 shrink-0 ${
            isFullScreen ? "" : "cursor-grab active:cursor-grabbing"
          }`}
          title={isFullScreen ? "" : "Haz clic y arrastra para mover la ventana (o doble clic para centrar)"}
        >
          <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                  Visor Integrado KIRIS
                </span>
                {!isFullScreen && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-teal-300/70 px-2 py-0.2 rounded bg-slate-200/60 dark:bg-teal-900/50">
                    <GripHorizontal className="w-3 h-3" />
                    <span>Arrastrable</span>
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botón recentrar si se ha movido */}
            {(position.x !== 0 || position.y !== 0) && !isFullScreen && (
              <button
                type="button"
                onClick={() => setPosition({ x: 0, y: 0 })}
                className="px-2 py-1 rounded-xl text-[11px] font-mono text-teal-700 dark:text-teal-300 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer flex items-center gap-1"
                title="Restablecer posición al centro"
              >
                Centrar
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer"
              title="Copiar enlace directo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition"
              title="Abrir en pestaña nueva de Google Drive"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:block p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer"
              title={isFullScreen ? "Restaurar tamaño" : "Pantalla completa"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 dark:text-teal-300 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
              title="Cerrar visor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo con Iframe Embebido */}
        <div className="relative flex-1 w-full bg-slate-100 dark:bg-[#040e11] overflow-hidden select-auto">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-[#07191d]/80 backdrop-blur-xs z-10">
              <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin" />
              <p className="text-xs text-slate-600 dark:text-teal-200/80 font-mono">
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
