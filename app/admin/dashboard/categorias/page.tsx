"use client";

import { useState, useMemo } from "react";
import { Layers, Plus, Edit3, Trash2 } from "lucide-react";
import { Category } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  CategoryModal,
  AdminPagination,
  AdminPageSkeleton,
} from "@/components/admin";
import ConfirmModal from "@/components/ConfirmModal";

export default function CategoriesAdminPage() {
  const { categoriesList, recommendationsList, isLoading, loadAllData, showToast } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const totalPages = Math.ceil(categoriesList.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return categoriesList.slice(start, start + ITEMS_PER_PAGE);
  }, [categoriesList, currentPage]);

  const openCreateModal = () => {
    setSelectedCat(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setSelectedCat(cat);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (payload: {
    name: string;
    slug: string;
    color: string;
    description: string | null;
    display_order: number;
  }) => {
    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedCat?.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", selectedCat.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar la categoría.");
          return;
        }
        showToast("Categoría actualizada correctamente.");
      } else {
        const { error } = await supabase.from("categories").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al registrar la categoría.");
          return;
        }
        showToast("Nueva categoría de recursos registrada.");
      }
      loadAllData();
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar la categoría.");
      } else {
        showToast("Categoría eliminada.");
        loadAllData();
      }
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return <AdminPageSkeleton cardCount={6} hasFilter={false} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AdminPageHeader
        title="Categorías de Recursos & IA"
        description="Organiza los recursos externos, herramientas de IA, frameworks y documentación por áreas temáticas."
        actionLabel="Nueva Categoría"
        onAction={openCreateModal}
      />

      {categoriesList.length === 0 ? (
        <AdminEmptyState
          icon={Layers}
          title="Sin categorías registradas"
          description="Crea categorías para clasificar tus recursos y herramientas externas recomendadas."
          actionLabel="Nueva Categoría"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedCategories.map((cat) => {
              const linkedCount = recommendationsList.filter((r) => r.category_id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs"
                          style={{ backgroundColor: cat.color || "#0d9488" }}
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-teal-400">
                          Orden #{cat.display_order ?? 0}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                        {linkedCount} {linkedCount === 1 ? "recurso" : "recursos"}
                      </span>
                    </div>

                    <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-teal-300/60 block mt-0.5">
                      slug: {cat.slug}
                    </span>

                    {cat.description && (
                      <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-2.5 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                      title="Editar categoría"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Eliminar categoría"
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
            totalItems={categoriesList.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="categorías"
          />
        </div>
      )}

      {/* Modal Crear / Editar Categoría */}
      <CategoryModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedCat}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        nextOrder={categoriesList.length + 1}
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar categoría temática?"
        message={`Esta acción removerá la categoría "${deleteTarget?.name}". Los recursos vinculados también podrían eliminarse en cascada.`}
        confirmLabel="Eliminar Categoría"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
