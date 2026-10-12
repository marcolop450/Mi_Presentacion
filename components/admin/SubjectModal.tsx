"use client";

import { useState, useEffect } from "react";
import { Subject, Category } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import AdminSelect from "./AdminSelect";
import InitialsAvatar from "@/components/InitialsAvatar";
import { Plus } from "lucide-react";

export interface SubjectModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Subject | null;
  categories: Category[];
  onClose: () => void;
  onSave: (payload: {
    name: string;
    code: string;
    category_id?: string;
    image_url: string | null;
    description: string | null;
  }) => Promise<void> | void;
  onOpenNewCategory?: () => void;
  subjectNameTestId?: string;
}

export default function SubjectModal({
  isOpen,
  mode,
  initialData,
  categories,
  onClose,
  onSave,
  onOpenNewCategory,
  subjectNameTestId = "admin-subject-name",
}: SubjectModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setName(initialData.name || "");
      setCode(initialData.code || "");
      setCategoryId(initialData.category_id || "");
      setImageUrl(initialData.image_url || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setCode("");
      setCategoryId(categories[0]?.id || "");
      setImageUrl("");
      setDescription("");
    }
  }, [initialData, mode, categories, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category_id: categoryId || undefined,
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={mode === "edit" ? "Editar Materia" : "Nueva Materia (Catálogo Maestro)"}
      subtitle="Registra la asignatura una sola vez con su sigla oficial y categoría académica."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AdminInput
              label="Nombre de la Materia"
              required
              data-testid={subjectNameTestId}
              placeholder="Ej. Estructuras de Datos I"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <AdminInput
              label="Sigla / Código Único"
              required
              isMono
              placeholder="INF-220"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-teal-200">
              Categoría / Área Académica (Opcional)
            </label>
            {onOpenNewCategory && (
              <button
                type="button"
                onClick={onOpenNewCategory}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Crear nueva categoría</span>
              </button>
            )}
          </div>
          <AdminSelect
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Sin categoría específica</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </AdminSelect>
        </div>

        {/* URL de Imagen con Avatar de Iniciales de Respaldo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
            URL de Imagen de Portada / Logo (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <InitialsAvatar src={imageUrl} name={name || "Materia"} size="md" />
            <input
              type="url"
              placeholder="https://... (Si está vacío, se usarán las iniciales automáticas)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <AdminTextarea
          label="Descripción o Enfoque de la Materia (Opcional)"
          rows={2}
          placeholder="Conceptos cubiertos, prerrequisitos o temas principales..."
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
              : "Registrar Materia"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
