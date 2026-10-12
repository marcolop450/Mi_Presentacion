"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Auxiliary, Subject, Semester, DriveLinkItem } from "@/types/database";
import AdminModal from "./AdminModal";
import AdminInput from "./AdminInput";
import AdminTextarea from "./AdminTextarea";
import AdminSelect from "./AdminSelect";
import InitialsAvatar from "@/components/InitialsAvatar";

export interface AuxiliaryModalProps {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  initialData: Auxiliary | null;
  subjects: Subject[];
  semesters: Semester[];
  onClose: () => void;
  onSave: (payload: {
    subject_id: string;
    semester_id: string;
    group_code: string;
    description: string | null;
    drive_links: DriveLinkItem[];
  }) => Promise<void> | void;
  onOpenNewSubject?: () => void;
  subjectNameTestId?: string;
  saveBtnTestId?: string;
}

export default function AuxiliaryModal({
  isOpen,
  mode,
  initialData,
  subjects,
  semesters,
  onClose,
  onSave,
  onOpenNewSubject,
  subjectNameTestId = "admin-subject-name",
  saveBtnTestId = "admin-save-aux-btn",
}: AuxiliaryModalProps) {
  const [subjectId, setSubjectId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [description, setDescription] = useState("");
  const [driveLinks, setDriveLinks] = useState<DriveLinkItem[]>([
    { title: "Carpeta Principal de Drive", url: "", type: "general" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Semestre activo por defecto
  const defaultSemester = semesters.find((s) => s.is_current) || semesters[0];

  useEffect(() => {
    if (initialData && mode === "edit") {
      setSubjectId(initialData.subject_id || (subjects[0]?.id ?? ""));
      setSemesterId(initialData.semester_id || (defaultSemester?.id ?? ""));
      setGroupCode(initialData.group_code || "");
      setDescription(initialData.description || "");
      setDriveLinks(
        initialData.drive_links?.length
          ? initialData.drive_links
          : [{ title: "Carpeta Principal de Drive", url: "", type: "general" }]
      );
    } else {
      setSubjectId(subjects[0]?.id || "");
      setSemesterId(defaultSemester?.id || "");
      setGroupCode("");
      setDescription("");
      setDriveLinks([{ title: "Carpeta Principal de Drive", url: "", type: "general" }]);
    }
  }, [initialData, mode, subjects, semesters, isOpen]);

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !semesterId || !groupCode.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        subject_id: subjectId,
        semester_id: semesterId,
        group_code: groupCode.trim().toUpperCase(),
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
      title={mode === "edit" ? "Editar Auxiliatura" : "Nueva Auxiliatura (Asignación de Grupo)"}
      subtitle="Asocia una materia existente a un grupo específico y configura sus carpetas de Google Drive."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selección de Materia existente */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-teal-200">
              Materia del Catálogo <span className="text-rose-500">*</span>
            </label>
            {onOpenNewSubject && (
              <button
                type="button"
                onClick={onOpenNewSubject}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Crear nueva materia</span>
              </button>
            )}
          </div>

          {subjects.length === 0 ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
              No tienes materias registradas en el catálogo. Por favor crea una materia primero.
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <InitialsAvatar
                src={selectedSubject?.image_url}
                name={selectedSubject?.name || "Materia"}
                size="md"
              />
              <div className="flex-1">
                <AdminSelect
                  required
                  data-testid={subjectNameTestId}
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      [{sub.code}] {sub.name}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            </div>
          )}
        </div>

        {/* Semestre y Grupo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AdminSelect
            label="Semestre Académico"
            required
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.code} {sem.is_current ? "★ (Semestre Actual)" : ""} - {sem.name}
              </option>
            ))}
          </AdminSelect>

          <AdminInput
            label="Código de Grupo"
            required
            isMono
            placeholder="Ej. SA, SB, SC"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            helperText="Identificador del grupo universitario que impartes."
          />
        </div>

        <AdminTextarea
          label="Descripción o Indicaciones del Grupo (Opcional)"
          rows={2}
          placeholder="Avisos sobre modalidad, aula, ponderación o entrega de prácticos..."
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
            disabled={isSubmitting || subjects.length === 0}
            data-testid={saveBtnTestId}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : mode === "edit"
              ? "Guardar Cambios"
              : "Asignar Auxiliatura"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
