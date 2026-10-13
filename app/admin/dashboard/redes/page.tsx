"use client";

import { useState, useMemo } from "react";
import { Share2, Plus, Edit3, Trash2, ExternalLink } from "lucide-react";
import { SocialLink } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useAdmin, ITEMS_PER_PAGE } from "@/components/admin/AdminContext";
import {
  AdminPageHeader,
  AdminEmptyState,
  SocialModal,
  AdminPagination,
  AdminPageSkeleton,
} from "@/components/admin";
import ConfirmModal from "@/components/ConfirmModal";

export default function SocialLinksAdminPage() {
  const { socialLinksList, isLoading, loadAllData, showToast } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSoc, setSelectedSoc] = useState<SocialLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);

  // Error de validación de URL para Heurística 9
  const [socialUrlError, setSocialUrlError] = useState("");

  const totalPages = Math.ceil(socialLinksList.length / ITEMS_PER_PAGE) || 1;
  const paginatedSocialLinks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return socialLinksList.slice(start, start + ITEMS_PER_PAGE);
  }, [socialLinksList, currentPage]);

  const openCreateModal = () => {
    setSelectedSoc(null);
    setModalMode("create");
    setSocialUrlError("");
    setIsModalOpen(true);
  };

  const openEditModal = (soc: SocialLink) => {
    setSelectedSoc(soc);
    setModalMode("edit");
    setSocialUrlError("");
    setIsModalOpen(true);
  };

  const handleSaveSocial = async (payload: {
    label: string;
    url: string;
    icon_name: string;
    display_order: number;
    is_active: boolean;
  }) => {
    // Validación de protocolo URL (Heurística 9)
    if (!payload.url.startsWith("http://") && !payload.url.startsWith("https://")) {
      setSocialUrlError("El enlace debe comenzar con http:// o https://");
      showToast("URL inválida: Debe comenzar con http:// o https://");
      return;
    }
    setSocialUrlError("");

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedSoc?.id) {
        const { error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", selectedSoc.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar enlace.");
          return;
        }
        showToast("Enlace actualizado exitosamente.");
      } else {
        const { error } = await supabase.from("social_links").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al registrar enlace.");
          return;
        }
        showToast("Nuevo canal de contacto agregado.");
      }
      loadAllData();
    }
    setIsModalOpen(false);
  };

  const handleToggleSocialActive = async (soc: SocialLink) => {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase
        .from("social_links")
        .update({ is_active: !soc.is_active })
        .eq("id", soc.id);
      if (error) {
        showToast("Problemas de Servidor al cambiar estado.");
      } else {
        showToast(soc.is_active ? "Enlace ocultado." : "Enlace activado.");
        loadAllData();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", deleteTarget.id);
      if (error) {
        showToast("Problemas de Servidor al eliminar enlace.");
      } else {
        showToast("Enlace eliminado.");
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
        title="Redes Sociales & Canales de Contacto"
        description="Gestiona los enlaces a perfiles públicos, repositorio de GitHub, LinkedIn, correo y grupos de Telegram."
        actionLabel="Nueva Red"
        onAction={openCreateModal}
      />

      {socialLinksList.length === 0 ? (
        <AdminEmptyState
          icon={Share2}
          title="Sin canales registrados"
          description="Agrega tus redes sociales o canales de comunicación para que los estudiantes se contacten contigo."
          actionLabel="Agregar Canal"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedSocialLinks.map((soc) => (
              <div
                key={soc.id}
                className={`p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border ${
                  soc.is_active
                    ? "border-slate-300 dark:border-teal-800/60"
                    : "border-slate-200 dark:border-teal-950 opacity-60"
                } shadow-xs flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                      {soc.icon_name}
                    </span>
                    <button
                      onClick={() => handleToggleSocialActive(soc)}
                      className={`text-[10px] font-mono px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        soc.is_active
                          ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {soc.is_active ? "Activo" : "Inactivo"}
                    </button>
                  </div>

                  <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                    {soc.label}
                  </h3>

                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline mt-2 truncate max-w-full"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{soc.url}</span>
                  </a>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-teal-900/40 text-[11px] font-mono text-slate-500 dark:text-teal-400">
                    Posición #{soc.display_order ?? 0}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(soc)}
                    className="p-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/80 transition"
                    title="Editar enlace"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(soc)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    title="Eliminar enlace"
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
            totalItems={socialLinksList.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            itemLabel="redes"
          />
        </div>
      )}

      {/* Modal Crear / Editar Red Social */}
      <SocialModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedSoc}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSocial}
        nextOrder={socialLinksList.length + 1}
      />

      {/* Modal Confirmar Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="¿Eliminar canal de contacto?"
        message={`Esta acción removerá el enlace a "${deleteTarget?.label}".`}
        confirmLabel="Eliminar Enlace"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
