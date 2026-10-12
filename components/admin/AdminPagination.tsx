"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  itemLabel?: string;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  itemLabel = "registros",
}: PaginationProps) {
  if (totalItems <= 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show (with ellipsis if large)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/80 dark:border-teal-900/60 ${className}`}
      aria-label="Paginación"
    >
      {/* Texto informativo de rango */}
      <p className="text-xs text-slate-600 dark:text-teal-200/80 font-medium">
        Mostrando <span className="font-bold text-slate-900 dark:text-white">{startItem}</span> a{" "}
        <span className="font-bold text-slate-900 dark:text-white">{endItem}</span> de{" "}
        <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> {itemLabel}
      </p>

      {/* Controles de página */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 dark:border-teal-800 bg-white dark:bg-teal-950/60 text-xs font-semibold text-slate-700 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/80 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          <div className="flex items-center gap-1">
            {pages.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-400 dark:text-teal-400/60 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => onPageChange(p as number)}
                  className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    currentPage === p
                      ? "bg-teal-600 text-white shadow-xs"
                      : "border border-slate-300 dark:border-teal-800/80 bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/60"
                  }`}
                  aria-current={currentPage === p ? "page" : undefined}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-300 dark:border-teal-800 bg-white dark:bg-teal-950/60 text-xs font-semibold text-slate-700 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/80 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
