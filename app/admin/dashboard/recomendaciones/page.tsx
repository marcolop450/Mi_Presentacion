"use client";

import { useState, useMemo } from "react";
import {
  Compass,
  Plus,
  Edit3,
  Trash2,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Recommendation } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  RecommendationModal,
  CategoryModal,
  AdminPagination,
  AdminPageSkeleton,
} from "@/components/admin";
import InitialsAvatar from "@/components/InitialsAvatar";
import ConfirmModal from "@/components/ConfirmModal";

export default function RecommendationsAdminPage() {
  const {
    recommendationsList,
    categoriesList,
    isLoading,
    loadAllData,
    showToast,
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Recommendation | null>(null);

  // Errores de validación de URL para Heurística 9
  const [recUrlError, setRecUrlError] = useState("");

  const filteredRecommendations = useMemo(() => {
    return recommendationsList.filter((r) => {
      const matchCategory =
        selectedCategoryFilter === "all" || r.category_id === selectedCategoryFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)));
      return matchCategory && matchSearch;
    });
  }, [recommendationsList, selectedCategoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredRecommendations.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecommendations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecommendations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecommendations, currentPage]);

  const openCreateModal = () => {
    setSelectedRec(null);
    setModalMode("create");
    setRecUrlError("");
    setIsRecModalOpen(true);
  };

  const openEditModal = (rec: Recommendation) => {
    setSelectedRec(rec);
    setModalMode("edit");
    setRecUrlError("");
    setIsRecModalOpen(true);
  };

  const handleSaveRecommendation = async (payload: {
    title: string;
    category_id: string;
    description: string;
    url: string;
    image_url: string | null;
    tags: string[];
    is_featured: boolean;
    display_order: number;
  }) => {
    // Validación de protocolo URL (Heurística 9)
    if (!payload.url.startsWith("http://") && !payload.url.startsWith("https://")) {
      setRecUrlError("La URL debe iniciar con http:// o https://");
      showToast("URL inválida: Debe comenzar con http:// o https://");
      return;
    }
    setRecUrlError("");

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedRec?.id) {
        const { error } = await supabase
          .from("recommendations")
          .update(payload)
          .eq("id", selectedRec.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar el recurso.");
          return;
        }
        showToast("Recurso actualizado correctamente.");
      } else {
        const { error } = await supabase.from("recommendations").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al registrar el recurso.");
          return;
        }
        showToast("Nuevo recurso registrado.");
      }
      loadAllData();
    }
    setIsRecModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase
        .from("recommendations")
        .delete()
        .eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar el recurso.");
      } else {
        showToast("Recurso eliminado.");
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
        title="Recursos y Recomendaciones de IA"
        description="Publica herramientas, artículos, repositorios y tutoriales externos clasificados por categoría temática."
        actionLabel="Nuevo Recurso"
        onAction={openCreateModal}
      />

      {/* Barra de Filtros */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, contenido o etiqueta (#python, #ia)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Píldoras de Filtro por Categoría */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => {
              setSelectedCategoryFilter("all");
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategoryFilter === "all"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-white/80 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/60 text-slate-700 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/60"
            }`}
          >
            Todas ({recommendationsList.length})
          </button>
          {categoriesList.map((cat) => {
            const count = recommendationsList.filter((r) => r.category_id === cat.id).length;
            const active = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  active
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white/80 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/60 text-slate-700 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/60"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cat.color || "#0d9488" }}
                />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredRecommendations.length === 0 ? (
        <AdminEmptyState
          icon={Compass}
          title="Sin recursos encontrados"
          description={
            searchQuery || selectedCategoryFilter !== "all"
              ? "No se encontraron recursos que coincidan con la búsqueda."
              : "Registra herramientas y documentación de valor para tus alumnos."
          }
          actionLabel="Registrar Recurso"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRecommendations.map((rec) => {
              const cat = categoriesList.find((c) => c.id === rec.category_id);
              return (
                <div
                  key={rec.id}
                  className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {cat && (
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: `${cat.color || "#0d9488"}20`,
                              borderColor: `${cat.color || "#0d9488"}50`,
                              color: cat.color || "#0d9488",
                            }}
                          >
                            {cat.name}
                          </span>
                        )}
                        {rec.is_featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Destacado</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-teal-400">
                        #{rec.display_order ?? 0}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <InitialsAvatar src={rec.image_url} name={rec.title} size="md" />
                      <div>
                        <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-snug">
                          {rec.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-2 line-clamp-3 leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Etiquetas */}
                    {rec.tags && rec.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {rec.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-teal-950 text-slate-600 dark:text-teal-300 border border-slate-200 dark:border-teal-900/60"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Enlace Externo */}
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-teal-900/40">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline truncate max-w-full"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{rec.url}</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                      title="Editar recurso"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(rec)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Eliminar recurso"
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
            totalItems={filteredRecommendations.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="recursos"
          />
        </div>
      )}

      {/* Modal Crear / Editar Recurso */}
      <RecommendationModal
        isOpen={isRecModalOpen}
        mode={modalMode}
        initialData={selectedRec}
        categories={categoriesList}
        onClose={() => setIsRecModalOpen(false)}
        onSave={handleSaveRecommendation}
        nextOrder={recommendationsList.length + 1}
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar recomendación de IA?"
        message={`Esta acción removerá el recurso "${deleteTarget?.title}". La URL dejará de estar visible en el portal público.`}
        confirmLabel="Eliminar Recurso"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
