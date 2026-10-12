"use client";

import { useState, useEffect } from "react";
import { Recommendation, Category } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import AdminSelect from "./AdminSelect";
import InitialsAvatar from "@/components/InitialsAvatar";

export interface RecommendationModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Recommendation | null;
  categories: Category[];
  onClose: () => void;
  onSave: (payload: {
    title: string;
    category_id: string;
    description: string;
    url: string;
    image_url: string | null;
    tags: string[];
    is_featured: boolean;
    display_order: number;
  }) => Promise<void> | void;
  nextOrder?: number;
}

export default function RecommendationModal({
  isOpen,
  mode,
  initialData,
  categories,
  onClose,
  onSave,
  nextOrder = 1,
}: RecommendationModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUrlError("");
    if (initialData && mode === "edit") {
      setTitle(initialData.title || "");
      setCategoryId(initialData.category_id || (categories[0]?.id ?? ""));
      setDescription(initialData.description || "");
      setUrl(initialData.url || "");
      setImageUrl(initialData.image_url || "");
      setTags(initialData.tags ? initialData.tags.join(", ") : "");
      setIsFeatured(initialData.is_featured || false);
      setDisplayOrder(initialData.display_order ?? 1);
    } else {
      setTitle("");
      setCategoryId(categories[0]?.id || "");
      setDescription("");
      setUrl("");
      setImageUrl("");
      setTags("");
      setIsFeatured(false);
      setDisplayOrder(nextOrder);
    }
  }, [initialData, mode, categories, nextOrder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    if (!title.trim() || !url.trim() || !categoryId) {
      return;
    }

    if (!url.trim().startsWith("http://") && !url.trim().startsWith("https://")) {
      setUrlError("La URL debe comenzar con http:// o https://");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        title: title.trim(),
        category_id: categoryId,
        description: description.trim(),
        url: url.trim(),
        image_url: imageUrl.trim() || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        is_featured: isFeatured,
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
      maxWidth="lg"
      title={mode === "edit" ? "Editar Recurso de IA" : "Nuevo Recurso de IA"}
      subtitle="Publica enlaces a repositorios, papers, plataformas o modelos de inteligencia artificial."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Título del Recurso"
          required
          placeholder="Ej. PyTorch Documentation & Tutorials"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <AdminSelect
            label="Categoría"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </AdminSelect>
          <AdminInput
            label="Orden de Despliegue"
            type="number"
            min={1}
            isMono
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        <AdminInput
          label="URL del Enlace Web"
          required
          type="url"
          isMono
          placeholder="https://..."
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (urlError) setUrlError("");
          }}
          error={urlError}
        />

        {/* URL de Imagen con Avatar de Iniciales de Respaldo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
            URL de Imagen / Logo del Recurso (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <InitialsAvatar src={imageUrl} name={title || "Recurso"} size="md" />
            <input
              type="url"
              placeholder="https://... (Si está vacío, se usan las iniciales generativas)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>
        </div>

        <AdminTextarea
          label="Descripción del Recurso"
          required
          rows={2}
          placeholder="Explicación concisa de su utilidad y características clave..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <AdminInput
          label="Etiquetas (separadas por comas)"
          placeholder="Machine Learning, Python, Framework"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          helperText="Escribe etiquetas para facilitar la búsqueda en la sección pública."
        />

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="recFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label
            htmlFor="recFeatured"
            className="text-xs font-semibold text-slate-700 dark:text-teal-200 cursor-pointer select-none"
          >
            Marcar como Recurso Destacado (Insignia especial en el portal)
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
              : "Publicar Recurso"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
