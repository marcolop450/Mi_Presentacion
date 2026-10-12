"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: ReactNode;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = "lg",
  children,
}: AdminModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className={`w-full ${maxWidthMap[maxWidth]} max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/60 shadow-2xl animate-in zoom-in-95 duration-150`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60 mb-5">
          <div>
            <h3
              id="admin-modal-title"
              className="text-lg font-display font-black text-slate-900 dark:text-white"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-teal-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
