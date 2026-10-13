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
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
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

      const matchSubject =
        selectedSubjectFilter === "all" ||
        a.subject_id === selectedSubjectFilter ||
        a.subject?.id === selectedSubjectFilter ||
        a.subject?.code === selectedSubjectFilter ||
        a.subject_code === selectedSubjectFilter;

      return matchSearch && matchSemester && matchSubject;
    });
  }, [auxiliariesList, searchQuery, selectedSemesterFilter, selectedSubjectFilter]);

  interface GroupedAdminAux {
    key: string;
    subjectId: string;
    subjectName: string;
    subjectCode: string;
    imageUrl?: string;
    groupCode: string;
    items: Auxiliary[];
  }

  // Agrupar auxiliaturas por Materia + Grupo (ej. INF-220 Grupo SB, INF-220 Grupo SD)
  const groupedAdminAux = useMemo<GroupedAdminAux[]>(() => {
    const map = new Map<string, GroupedAdminAux>();

    for (const aux of filteredAuxiliaries) {
      const subId = aux.subject_id || aux.subject?.id || "no-subj";
      const subName = aux.subject?.name || aux.subject_name || "Materia sin vincular";
      const subCode = (aux.subject?.code || aux.subject_code || "INF").toUpperCase();
      const groupCode = aux.group_code || "Único";
      const imgUrl = aux.subject?.image_url || aux.image_url;
      const key = `${subId}-${groupCode}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          subjectId: subId,
          subjectName: subName,
          subjectCode: subCode,
          imageUrl: imgUrl,
          groupCode,
          items: [],
        });
      }

      map.get(key)!.items.push(aux);
    }

    return Array.from(map.values())
      .map((grp) => ({
        ...grp,
        items: grp.items.sort((a, b) => {
          const semA = a.semester?.code || (typeof a.semester === "string" ? a.semester : "") || a.semester_code || "";
          const semB = b.semester?.code || (typeof b.semester === "string" ? b.semester : "") || b.semester_code || "";
          return semB.localeCompare(semA);
        }),
      }))
      .sort((a, b) => {
        const codeCmp = a.subjectCode.localeCompare(b.subjectCode);
        if (codeCmp !== 0) return codeCmp;
        return a.groupCode.localeCompare(b.groupCode);
      });
  }, [filteredAuxiliaries]);

  const totalPages = Math.ceil(groupedAdminAux.length / ITEMS_PER_PAGE) || 1;
  const paginatedGroups = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return groupedAdminAux.slice(start, start + ITEMS_PER_PAGE);
  }, [groupedAdminAux, currentPage]);

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
      <div className="flex flex-col md:flex-row gap-3">
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

        {/* Filtro por Materia */}
        <select
          value={selectedSubjectFilter}
          onChange={(e) => {
            setSelectedSubjectFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 pr-9 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer max-w-full sm:max-w-[240px]"
        >
          <option value="all">Todas las Materias ({subjectsList.length})</option>
          {subjectsList.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.code} - {sub.name}
            </option>
          ))}
        </select>

        {/* Filtro por Semestre */}
        <select
          value={selectedSemesterFilter}
          onChange={(e) => {
            setSelectedSemesterFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 pr-9 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer max-w-full sm:max-w-[200px]"
        >
          <option value="all">Todos los Semestres</option>
          {semestersList.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.code} {sem.is_current ? "(Actual)" : ""}
            </option>
          ))}
        </select>

        {/* Botón para Limpiar Filtros activos */}
        {(searchQuery || selectedSubjectFilter !== "all" || selectedSemesterFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedSubjectFilter("all");
              setSelectedSemesterFilter("all");
              setCurrentPage(1);
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-xs font-semibold text-slate-700 dark:text-teal-200 border border-slate-300 dark:border-teal-800/60 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredAuxiliaries.length === 0 ? (
        <AdminEmptyState
          icon={GraduationCap}
          title="Sin auxiliaturas encontradas"
          description={
            searchQuery || selectedSemesterFilter !== "all" || selectedSubjectFilter !== "all"
              ? "No se encontraron auxiliaturas con los filtros seleccionados."
              : "Asigna tu primer grupo de auxiliatura a una materia registrada."
          }
          actionLabel="Asignar Grupo"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {paginatedGroups.map((grp) => (
              <div
                key={grp.key}
                className="p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Cabecera del Grupo: Avatar, Sigla, Grupo, Materia y contador */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <InitialsAvatar src={grp.imageUrl} name={grp.subjectName} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5 mb-1">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            {grp.subjectCode}
                          </span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                            Grupo {grp.groupCode}
                          </span>
                        </div>
                        <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug truncate">
                          {grp.subjectName}
                        </h3>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-medium shrink-0">
                      {grp.items.length} {grp.items.length === 1 ? "semestre" : "semestres"}
                    </span>
                  </div>

                  {/* Lista de Semestres y sus Carpetas dentro de este Grupo */}
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-teal-900/60">
                    {grp.items.map((aux) => {
                      const semCode =
                        aux.semester?.code ||
                        (typeof aux.semester === "string" ? aux.semester : "") ||
                        aux.semester_code ||
                        "Sin semestre";

                      return (
                        <div
                          key={aux.id}
                          className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                            aux.is_active
                              ? "bg-slate-50/85 dark:bg-teal-950/30 border-slate-200 dark:border-teal-900/60"
                              : "bg-slate-100/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60"
                          }`}
                        >
                          {/* Fila superior: Semestre, Toggle Público/Oculto y Acciones (Editar/Eliminar) */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                <span>{semCode}</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handleToggleAuxActive(aux)}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition cursor-pointer ${
                                  aux.is_active
                                    ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                                }`}
                              >
                                {aux.is_active ? "Público" : "Oculto"}
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditModal(aux)}
                                className="p-1.5 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-200 dark:hover:bg-teal-900/60 transition cursor-pointer"
                                title="Editar este semestre de auxiliatura"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(aux)}
                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                                title="Eliminar este semestre de auxiliatura"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Descripción del Semestre */}
                          {aux.description && (
                            <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-2 leading-relaxed">
                              {aux.description}
                            </p>
                          )}

                          {/* Enlaces de Drive del Semestre */}
                          <div className="mt-2.5 space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-teal-400/80 uppercase tracking-wider block">
                              Carpetas de Drive ({aux.drive_links?.length || 0})
                            </span>
                            {aux.drive_links && aux.drive_links.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {aux.drive_links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-teal-950 border border-slate-200 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/40 transition shadow-2xs"
                                  >
                                    <FolderOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                                    <span className="truncate max-w-[160px]">{link.title || "Carpeta Drive"}</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 dark:text-teal-300/50 italic">
                                Sin carpetas vinculadas
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={groupedAdminAux.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="grupos de auxiliatura"
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
