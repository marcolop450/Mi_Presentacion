"use client";

import { useState, useMemo } from "react";
import { Calendar, Plus, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { Semester } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  SemesterModal,
  AdminPagination,
} from "@/components/admin";
import ConfirmModal from "@/components/ConfirmModal";

export default function SemestersAdminPage() {
  const { semestersList, loadAllData, showToast } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Semester | null>(null);

  const totalPages = Math.ceil(semestersList.length / ITEMS_PER_PAGE) || 1;
  const paginatedSemesters = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return semestersList.slice(start, start + ITEMS_PER_PAGE);
  }, [semestersList, currentPage]);

  const openCreateModal = () => {
    setSelectedSem(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (sem: Semester) => {
    setSelectedSem(sem);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveSemester = async (payload: {
    code: string;
    name: string;
    is_current: boolean;
    display_order: number;
  }) => {
    const supabase = createClient();
    if (supabase) {
      if (payload.is_current) {
        await supabase
          .from("semesters")
          .update({ is_current: false })
          .neq("id", selectedSem?.id || "00000000-0000-0000-0000-000000000000");
      }

      if (modalMode === "edit" && selectedSem?.id) {
        const { error } = await supabase.from("semesters").update(payload).eq("id", selectedSem.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar semestre.");
          return;
        }
        showToast("Semestre actualizado correctamente.");
      } else {
        const { error } = await supabase.from("semesters").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al crear semestre.");
          return;
        }
        showToast("Nuevo semestre académico registrado.");
      }
      loadAllData();
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("semesters").delete().eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar semestre. Podría tener auxiliaturas vinculadas.");
      } else {
        showToast("Semestre eliminado.");
        loadAllData();
      }
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        title="Semestres Académicos"
        description="Define los períodos universitarios y marca cuál es el semestre en curso para organizar las auxiliaturas."
        actionLabel="Nuevo Semestre"
        onAction={openCreateModal}
      />

      {semestersList.length === 0 ? (
        <AdminEmptyState
          icon={Calendar}
          title="Sin semestres registrados"
          description="Crea tu primer período académico (ej. II-2026) para asignarlo a tus materias."
          actionLabel="Crear Semestre"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSemesters.map((sem) => (
              <div
                key={sem.id}
                className={`p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border ${
                  sem.is_current
                    ? "border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/20"
                    : "border-slate-300 dark:border-teal-800/60 shadow-xs"
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                      {sem.code}
                    </span>
                    {sem.is_current ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-300 dark:border-teal-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Actual en Curso</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-teal-400">
                        Orden #{sem.display_order ?? 0}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                    {sem.name}
                  </h3>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(sem)}
                    className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                    title="Editar semestre"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(sem)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Eliminar semestre"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={semestersList.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="semestres"
          />
        </div>
      )}

      {/* Modal Crear / Editar Semestre */}
      <SemesterModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedSem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSemester}
        nextOrder={semestersList.length + 1}
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar período semestral?"
        message={`Esta acción removerá el semestre "${deleteTarget?.name}" (${deleteTarget?.code}). Si hay auxiliaturas vinculadas, Supabase rechazará la operación para proteger la integridad.`}
        confirmLabel="Eliminar Semestre"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
