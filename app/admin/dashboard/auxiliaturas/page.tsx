"use client";

import { useState, useMemo } from "react";
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Search,
  FolderOpen,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Auxiliary, DriveLinkItem } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  AuxiliaryModal,
  SubjectModal,
  AdminPagination,
  AdminPageSkeleton,
} from "@/components/admin";
import InitialsAvatar from "@/components/InitialsAvatar";
import ConfirmModal from "@/components/ConfirmModal";

export default function AuxiliariesAdminPage() {
  const {
    auxiliariesList,
    subjectsList,
    semestersList,
    isLoading,
    loadAllData,
    showToast,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isAuxModalOpen, setIsAuxModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedAux, setSelectedAux] = useState<Auxiliary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Auxiliary | null>(null);

  const filteredAuxiliaries = useMemo(() => {
    return auxiliariesList.filter((a) => {
      const subjName = a.subject?.name || a.subject_name || "";
      const subjCode = a.subject?.code || a.subject_code || "";
      const group = a.group_code || "";
      const desc = a.description || "";
      const q = searchQuery.toLowerCase();

      const matchSearch =
        !searchQuery ||
        subjName.toLowerCase().includes(q) ||
        subjCode.toLowerCase().includes(q) ||
        group.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);

      const matchSemester =
        selectedSemesterFilter === "all" ||
        a.semester_id === selectedSemesterFilter ||
        a.semester?.code === selectedSemesterFilter;

      return matchSearch && matchSemester;
    });
  }, [auxiliariesList, searchQuery, selectedSemesterFilter]);

  const totalPages = Math.ceil(filteredAuxiliaries.length / ITEMS_PER_PAGE) || 1;
  const paginatedAuxiliaries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAuxiliaries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAuxiliaries, currentPage]);

  const openCreateModal = () => {
    setSelectedAux(null);
    setModalMode("create");
    setIsAuxModalOpen(true);
  };

  const openEditModal = (aux: Auxiliary) => {
    setSelectedAux(aux);
    setModalMode("edit");
    setIsAuxModalOpen(true);
  };

  const handleSaveAuxiliary = async (payload: {
    subject_id: string;
    semester_id: string;
    group_code: string;
    description: string | null;
    drive_links: DriveLinkItem[];
  }) => {
    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedAux?.id) {
        const { error } = await supabase.from("auxiliaries").update(payload).eq("id", selectedAux.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar la auxiliatura.");
          return;
        }
        showToast("Auxiliatura actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("auxiliaries").insert([
          {
            ...payload,
            is_active: true,
          },
        ]);
        if (error) {
          showToast("Problemas de Servidor al registrar la auxiliatura.");
          return;
        }
        showToast("Grupo de auxiliatura asignado correctamente.");
      }
      loadAllData();
    }
    setIsAuxModalOpen(false);
  };

  const handleToggleAuxActive = async (aux: Auxiliary) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase
        .from("auxiliaries")
        .update({ is_active: !aux.is_active })
        .eq("id", aux.id);
      if (error) {
        showToast("Problemas de Servidor al actualizar estado.");
      } else {
        showToast(aux.is_active ? "Auxiliatura desactivada." : "Auxiliatura activada.");
        loadAllData();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("auxiliaries").delete().eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar la auxiliatura.");
      } else {
        showToast("Auxiliatura eliminada.");
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
        title="Gestión de Auxiliaturas Universitarias"
        description="Asigna materias a grupos específicos y vincula sus carpetas oficiales de Google Drive."
        actionLabel="Asignar Grupo"
        onAction={openCreateModal}
      />

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por materia, código, grupo o descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          value={selectedSemesterFilter}
          onChange={(e) => {
            setSelectedSemesterFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        >
          <option value="all">Todos los Semestres</option>
          {semestersList.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.code} {sem.is_current ? "(Actual)" : ""}
            </option>
          ))}
        </select>
      </div>

      {filteredAuxiliaries.length === 0 ? (
        <AdminEmptyState
          icon={GraduationCap}
          title="Sin auxiliaturas encontradas"
          description={
            searchQuery || selectedSemesterFilter !== "all"
              ? "No se encontraron auxiliaturas con los filtros seleccionados."
              : "Asigna tu primer grupo de auxiliatura a una materia registrada."
          }
          actionLabel="Asignar Grupo"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {paginatedAuxiliaries.map((aux) => {
              const subName = aux.subject?.name || aux.subject_name || "Materia sin vincular";
              const subCode = aux.subject?.code || aux.subject_code || "INF";
              const semCode = aux.semester?.code || (typeof aux.semester === "string" ? aux.semester : "") || aux.semester_code || "";
              const imgUrl = aux.subject?.image_url || aux.image_url;

              return (
                <div
                  key={aux.id}
                  className={`p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border ${
                    aux.is_active ? "border-slate-300 dark:border-teal-800/60" : "border-slate-200 dark:border-teal-950 opacity-60"
                  } shadow-xs flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar src={imgUrl} name={subName} size="md" />
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                              {subCode}
                            </span>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                              Grupo {aux.group_code}
                            </span>
                            {semCode && (
                              <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {semCode}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                            {subName}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAuxActive(aux)}
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition cursor-pointer ${
                          aux.is_active
                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {aux.is_active ? "Público" : "Oculto"}
                      </button>
                    </div>

                    {aux.description && (
                      <p className="text-xs text-slate-600 dark:text-teal-100/70 line-clamp-2 mt-2 leading-relaxed">
                        {aux.description}
                      </p>
                    )}

                    {/* Enlaces de Drive */}
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-teal-400/80 uppercase tracking-wider block">
                        Carpetas de Drive ({aux.drive_links?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {aux.drive_links?.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition"
                          >
                            <FolderOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span className="truncate max-w-[180px]">{link.title || "Carpeta Drive"}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(aux)}
                      className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                      title="Editar auxiliatura"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(aux)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Eliminar auxiliatura"
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
            totalItems={filteredAuxiliaries.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="auxiliaturas"
          />
        </div>
      )}

      {/* Modal Crear / Editar Auxiliatura */}
      <AuxiliaryModal
        isOpen={isAuxModalOpen}
        mode={modalMode}
        initialData={selectedAux}
        subjects={subjectsList}
        semesters={semestersList}
        onClose={() => setIsAuxModalOpen(false)}
        onSave={handleSaveAuxiliary}
        onOpenNewSubject={() => setIsSubModalOpen(true)}
        subjectNameTestId="admin-subject-name"
        saveBtnTestId="admin-save-aux-btn"
      />

      {/* Modal Nueva Materia si se invoca desde el selector */}
      <SubjectModal
        isOpen={isSubModalOpen}
        mode="create"
        initialData={null}
        onClose={() => setIsSubModalOpen(false)}
        onSave={async (payload) => {
          const supabase = createClient();
          if (supabase) {
            const { error } = await supabase.from("subjects").insert([payload]);
            if (error) {
              showToast("Problemas de Servidor al registrar materia.");
            } else {
              showToast("Materia creada.");
              loadAllData();
            }
          }
          setIsSubModalOpen(false);
        }}
        subjectNameTestId="admin-subject-name"
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar registro de auxiliatura?"
        message={`Esta acción removerá la auxiliatura del Grupo "${deleteTarget?.group_code}". Los archivos en Google Drive no se verán afectados.`}
        confirmLabel="Eliminar Auxiliatura"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
