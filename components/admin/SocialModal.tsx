"use client";

import { useState, useEffect } from "react";
import { SocialLink } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminSelect from "./AdminSelect";
import InitialsAvatar from "@/components/InitialsAvatar";

export interface SocialModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: SocialLink | null;
  onClose: () => void;
  onSave: (payload: {
    label: string;
    icon_name: string;
    url: string;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
  }) => Promise<void> | void;
  nextOrder?: number;
}

const SOCIAL_ICONS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "twitter", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "mail", label: "Correo Electrónico" },
  { value: "globe", label: "Sitio Web Oficial" },
  { value: "aws", label: "AWS" },
];

export default function SocialModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  nextOrder = 1,
}: SocialModalProps) {
  const [label, setLabel] = useState("");
  const [iconName, setIconName] = useState("github");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [urlError, setUrlError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUrlError("");
    if (initialData && mode === "edit") {
      setLabel(initialData.label || "");
      setIconName(initialData.icon_name || "github");
      setUrl(initialData.url || "");
      setImageUrl(initialData.image_url || "");
      setDisplayOrder(initialData.display_order ?? 1);
    } else {
      setLabel("");
      setIconName("github");
      setUrl("");
      setImageUrl("");
      setDisplayOrder(nextOrder);
    }
  }, [initialData, mode, nextOrder, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");

    if (!label.trim() || !url.trim()) {
      return;
    }

    if (!url.trim().startsWith("http://") && !url.trim().startsWith("https://")) {
      setUrlError("La URL debe comenzar con http:// o https://");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        label: label.trim(),
        icon_name: iconName,
        url: url.trim(),
        image_url: imageUrl.trim() || null,
        display_order: Number(displayOrder) || 1,
        is_active: true,
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
      title={mode === "edit" ? "Editar Red Social" : "Nueva Red Social"}
      subtitle="Enlaces de contacto y presencia profesional visibles en el pie y sección Sobre Mí."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AdminInput
          label="Etiqueta / Nombre"
          required
          placeholder="GitHub, LinkedIn, WhatsApp..."
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <AdminSelect
            label="Tipo de Icono"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            options={SOCIAL_ICONS}
          />
          <AdminInput
            label="Orden"
            type="number"
            min={1}
            isMono
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>

        <AdminInput
          label="URL del Perfil o Canal"
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
            URL de Imagen / Logo Personalizado (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <InitialsAvatar src={imageUrl} name={label || "Red"} size="sm" />
            <input
              type="url"
              placeholder="https://... (Opcional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>
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
              : "Añadir Enlace"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
