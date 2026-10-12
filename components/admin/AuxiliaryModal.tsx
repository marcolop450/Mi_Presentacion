"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Auxiliary, DriveLinkItem } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import InitialsAvatar from "@/components/InitialsAvatar";

export interface AuxiliaryModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Auxiliary | null;
  onClose: () => void;
  onSave: (payload: {
    subject_name: string;
    subject_code: string;
    group_code: string;
    semester: string;
    image_url: string | null;
    description: string | null;
    drive_links: DriveLinkItem[];
  }) => Promise<void> | void;
  subjectNameTestId?: string;
  saveBtnTestId?: string;
}

export default function AuxiliaryModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  subjectNameTestId = "admin-subject-name",
  saveBtnTestId = "admin-save-aux-btn",
}: AuxiliaryModalProps) {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [semester, setSemester] = useState("II-2026");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [driveLinks, setDriveLinks] = useState<DriveLinkItem[]>([
    { title: "Carpeta Principal de Drive", url: "", type: "general" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setSubjectName(initialData.subject_name || "");
      setSubjectCode(initialData.subject_code || "");
      setGroupCode(initialData.group_code || "");
      setSemester(initialData.semester || "II-2026");
      setImageUrl(initialData.image_url || "");
      setDescription(initialData.description || "");
      setDriveLinks(
        initialData.drive_links?.length
          ? initialData.drive_links
          : [{ title: "Carpeta Principal de Drive", url: "", type: "general" }]
      );
    } else {
      setSubjectName("");
      setSubjectCode("");
      setGroupCode("");
      setSemester("II-2026");
      setImageUrl("");
      setDescription("");
      setDriveLinks([{ title: "Carpeta Principal de Drive", url: "", type: "general" }]);
    }
  }, [initialData, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectCode.trim() || !groupCode.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        subject_name: subjectName.trim(),
        subject_code: subjectCode.trim().toUpperCase(),
        group_code: groupCode.trim().toUpperCase(),
        semester: semester.trim(),
        image_url: imageUrl.trim() || null,
        description: description.trim() || null,
        drive_links: driveLinks.filter((l) => l.title.trim() && l.url.trim()),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={mode === "edit" ? "Editar Auxiliatura" : "Nueva Auxiliatura"}
      subtitle="Configura la materia, enlaces a carpetas de Google Drive e imagen de portada."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <AdminInput
              label="Nombre de la Materia"
              required
              data-testid={subjectNameTestId}
              placeholder="Ej. Estructuras de Datos I"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>
          <div>
            <AdminInput
              label="Sigla / Código"
              required
              isMono
              placeholder="INF-220"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <AdminInput
              label="Grupo"
              required
              isMono
              placeholder="SA o SB"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
            />
          </div>
          <div>
            <AdminInput
              label="Semestre"
              isMono
              placeholder="II-2026"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>
        </div>

        {/* URL de Imagen con Avatar de Iniciales de Respaldo */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
            URL de Imagen de Portada / Logo (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <InitialsAvatar src={imageUrl} name={subjectName || "Materia"} size="md" />
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
          label="Descripción o Indicaciones"
          rows={2}
          placeholder="Detalles sobre el avance, materiales o avisos..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Enlaces de Google Drive Dinámicos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-teal-200">
              Carpetas en Google Drive
            </label>
            <button
              type="button"
              onClick={() =>
                setDriveLinks([...driveLinks, { title: "", url: "", type: "general" }])
              }
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir enlace</span>
            </button>
          </div>
          <div className="space-y-2">
            {driveLinks.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Título (Ej. Prácticos)"
                  value={link.title}
                  onChange={(e) => {
                    const updated = [...driveLinks];
                    updated[idx].title = e.target.value;
                    setDriveLinks(updated);
                  }}
                  className="w-1/3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...driveLinks];
                    updated[idx].url = e.target.value;
                    setDriveLinks(updated);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
                {driveLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setDriveLinks(driveLinks.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Eliminar enlace"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
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
            data-testid={saveBtnTestId}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "edit"
              ? "Guardar Cambios"
              : "Crear Auxiliatura"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
