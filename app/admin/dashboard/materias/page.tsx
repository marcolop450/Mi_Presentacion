"use client";

import { useState, useMemo } from "react";
import { BookOpen, Plus, Edit3, Trash2, Search } from "lucide-react";
import { Subject, getSemesterLevelLabel } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  SubjectModal,
  AdminPagination,
  AdminPageSkeleton,
} from "@/components/admin";
import InitialsAvatar from "@/components/InitialsAvatar";
import ConfirmModal from "@/components/ConfirmModal";

export default function SubjectsAdminPage() {
  const { subjectsList, auxiliariesList, isLoading, loadAllData, showToast } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

  const filteredSubjects = useMemo(() => {
    let list = subjectsList;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.description && s.description.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => {
      const semA = a.semester_level || 1;
      const semB = b.semester_level || 1;
      if (semA !== semB) return semA - semB;
      return a.code.localeCompare(b.code);
    });
  }, [subjectsList, searchQuery]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) || 1;
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  const openCreateModal = () => {
    setSelectedSub(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setSelectedSub(sub);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveSubject = async (payload: {
    name: string;
    code: string;
    semester_level: number;
    image_url: string | null;
    description: string | null;
  }) => {
    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedSub?.id) {
        const { error } = await supabase.from("subjects").update(payload).eq("id", selectedSub.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar la materia.");
          return;
        }
        showToast("Materia actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("subjects").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al registrar la materia.");
          return;
        }
        showToast("Nueva materia registrada en el catálogo.");
      }
      loadAllData();
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("subjects").delete().eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar la materia.");
      } else {
        showToast("Materia eliminada del catálogo maestro.");
        loadAllData();
      }
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return <AdminPageSkeleton cardCount={6} hasFilter={true} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        title="Catálogo Maestro de Materias"
        description="Registra cada asignatura universitaria una sola vez con su sigla oficial única (INF-XXX). Los grupos se gestionan en Auxiliaturas."
        actionLabel="Nueva Materia"
        onAction={openCreateModal}
      />

      {/* Buscador de Materias */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar materia por nombre o sigla (ej. INF-220)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <AdminEmptyState
          icon={BookOpen}
          title="Sin materias encontradas"
          description={
            searchQuery
              ? "No hay materias que coincidan con la búsqueda actual."
              : "Registra tu primera materia para empezar a asignar grupos de auxiliatura."
          }
          actionLabel="Registrar Materia"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedSubjects.map((sub) => {
              const linkedGroups = auxiliariesList.filter(
                (a) => a.subject_id === sub.id || a.subject_code === sub.code
              );
              return (
                <div
                  key={sub.id}
                  className="p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar src={sub.image_url} name={sub.name} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                              {sub.code}
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-teal-950/60 text-slate-700 dark:text-teal-200 border border-slate-200 dark:border-teal-900/60">
                              {getSemesterLevelLabel(sub.semester_level)}
                            </span>
                          </div>
                          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                            {sub.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {sub.description && (
                      <p className="text-xs text-slate-600 dark:text-teal-100/70 line-clamp-2 mt-2 leading-relaxed">
                        {sub.description}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-teal-900/40 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-teal-400">
                      <span>{linkedGroups.length} grupos asignados</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                      title="Editar materia"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(sub)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Eliminar materia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSubjects.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="materias"
          />
        </div>
      )}

      {/* Modal Crear / Editar Materia */}
      <SubjectModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedSub}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSubject}
        subjectNameTestId="admin-subject-name"
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar materia del catálogo?"
        message={`Esta acción removerá "${deleteTarget?.name}" (${deleteTarget?.code}). Si hay auxiliaturas asociadas, se eliminarán en cascada de acuerdo a las restricciones del sistema.`}
        confirmLabel="Eliminar Materia"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
