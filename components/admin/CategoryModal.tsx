"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";

export interface CategoryModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Category | null;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    slug: string;
    color: string;
    description: string | null;
    display_order: number;
  }) => Promise<void> | void;
  nextOrder?: number;
}

export default function CategoryModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  nextOrder = 1,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#0d9488");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setColor(initialData.color || "#0d9488");
      setDescription(initialData.description || "");
      setDisplayOrder(initialData.display_order ?? 1);
    } else {
      setName("");
      setSlug("");
      setColor("#0d9488");
      setDescription("");
      setDisplayOrder(nextOrder);
    }
  }, [initialData, mode, nextOrder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug =
      slug.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        slug: generatedSlug,
        color,
        description: description.trim() || null,
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
      title={mode === "edit" ? "Editar Categoría" : "Nueva Categoría de Recursos"}
      subtitle="Organiza los recursos externos, herramientas de IA y documentación por temáticas."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Nombre de la Categoría"
          required
          placeholder="Ej. Inteligencia Artificial, Frameworks, Bases de Datos..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (mode === "create") {
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")
              );
            }
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <AdminInput
            label="Slug Identificador"
            required
            isMono
            placeholder="vision-computadora"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
            Color Temático
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-teal-800 bg-transparent p-0"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <AdminTextarea
          label="Descripción (Opcional)"
          rows={2}
          placeholder="Breve reseña sobre los recursos incluidos en esta categoría..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

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
              : "Crear Categoría"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
