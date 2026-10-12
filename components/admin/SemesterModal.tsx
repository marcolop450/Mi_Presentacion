"use client";

import { useState, useEffect } from "react";
import { Semester } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";

export interface SemesterModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Semester | null;
  onClose: () => void;
  onSave: (payload: {
    code: string;
    name: string;
    is_current: boolean;
    display_order: number;
  }) => Promise<void> | void;
  nextOrder?: number;
}

export default function SemesterModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  nextOrder = 1,
}: SemesterModalProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setCode(initialData.code || "");
      setName(initialData.name || "");
      setIsCurrent(initialData.is_current ?? false);
      setDisplayOrder(initialData.display_order ?? 1);
    } else {
      setCode("");
      setName("");
      setIsCurrent(false);
      setDisplayOrder(nextOrder);
    }
  }, [initialData, mode, nextOrder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        is_current: isCurrent,
        display_order: Number(displayOrder) || 1,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={mode === "edit" ? "Editar Semestre Académico" : "Nuevo Semestre Académico"}
      subtitle="Define el código del período lectivo y marca si es el semestre en curso actual."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <AdminInput
            label="Código / Sigla"
            required
            isMono
            placeholder="Ej. II-2026"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <AdminInput
            label="Orden de Visualización"
            type="number"
            min={1}
            isMono
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        <AdminInput
          label="Nombre Descriptivo"
          required
          placeholder="Ej. Segundo Semestre 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex items-center gap-2.5 pt-2 pb-1">
          <input
            type="checkbox"
            id="semesterIsCurrent"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label
            htmlFor="semesterIsCurrent"
            className="text-xs font-semibold text-slate-700 dark:text-teal-200 cursor-pointer select-none"
          >
            Marcar como Semestre Actual en Curso (prioritario en la plataforma)
          </label>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/60 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "edit"
              ? "Guardar Cambios"
              : "Registrar Semestre"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
