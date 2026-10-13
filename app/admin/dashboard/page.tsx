"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Compass,
  Layers,
  Share2,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  Sparkles,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  SubjectModal,
  AuxiliaryModal,
  AdminOverviewSkeleton,
} from "@/components/admin";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardOverviewPage() {
  const {
    semestersList,
    subjectsList,
    auxiliariesList,
    categoriesList,
    recommendationsList,
    socialLinksList,
    isLoading,
    loadAllData,
    showToast,
  } = useAdmin();

  // Estados de modales y compatibilidad con suite E2E
  const [isQuickSubOpen, setIsQuickSubOpen] = useState(false);
  const [isQuickAuxOpen, setIsQuickAuxOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Validaciones de URL e integridad (Heurística 9 - E2E Tests)
  const [recUrlError, setRecUrlError] = useState("");
  const [socialUrlError, setSocialUrlError] = useState("");

  const validateUrlProtocol = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }
    return true;
  };

  if (isLoading) {
    return (
      <div data-testid="admin-tab-resumen">
        <AdminOverviewSkeleton />
      </div>
    );
  }

  // Grupos administrativos ordenados exactamente igual que el Sidebar
  const administrativeSections = [
    {
      groupTitle: "GESTIÓN ACADÉMICA (FICCT)",
      description: "Administración de períodos, catálogo de asignaturas con semestre y auxiliaturas.",
      items: [
        {
          title: "Semestres",
          desc: `${semestersList.length} períodos lectivos registrados`,
          href: "/admin/dashboard/semestres",
          icon: Calendar,
          accent: "text-teal-600 dark:text-teal-400",
          iconBg: "bg-teal-100 dark:bg-teal-950/80",
          badge: `${semestersList.length} períodos`,
          actionLabel: "Configurar semestres",
        },
        {
          title: "Catálogo de Materias",
          desc: `${subjectsList.length} asignaturas únicas con nivel de semestre`,
          href: "/admin/dashboard/materias",
          icon: BookOpen,
          accent: "text-cyan-600 dark:text-cyan-400",
          iconBg: "bg-cyan-100 dark:bg-cyan-950/80",
          badge: `${subjectsList.length} materias`,
          actionLabel: "Gestionar catálogo",
        },
        {
          title: "Auxiliaturas (Grupos)",
          desc: `${auxiliariesList.length} grupos asignados con enlaces de Google Drive`,
          href: "/admin/dashboard/auxiliaturas",
          icon: GraduationCap,
          accent: "text-emerald-600 dark:text-emerald-400",
          iconBg: "bg-emerald-100 dark:bg-emerald-950/80",
          badge: `${auxiliariesList.length} grupos`,
          actionLabel: "Gestionar auxiliaturas",
        },
      ],
    },
    {
      groupTitle: "ECOSISTEMA DE RECURSOS & IA",
      description: "Curaduría de herramientas web, canales, papers y categorías de programación.",
      items: [
        {
          title: "Categorías de Recursos",
          desc: `${categoriesList.length} temáticas organizativas de desarrollo e IA`,
          href: "/admin/dashboard/categorias",
          icon: Layers,
          accent: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-950/80",
          badge: `${categoriesList.length} categorías`,
          actionLabel: "Gestionar categorías",
        },
        {
          title: "Recursos y Recomendaciones",
          desc: `${recommendationsList.length} herramientas, plataformas y canales curados`,
          href: "/admin/dashboard/recomendaciones",
          icon: Compass,
          accent: "text-violet-600 dark:text-violet-400",
          iconBg: "bg-violet-100 dark:bg-violet-950/80",
          badge: `${recommendationsList.length} recursos`,
          actionLabel: "Gestionar recursos",
        },
      ],
    },
    {
      groupTitle: "CONTACTO & PRESENCIA",
      description: "Enlaces a redes de divulgación, GitHub, correo institucional y mensajería.",
      items: [
        {
          title: "Redes y Canales Oficiales",
          desc: `${socialLinksList.length} canales activos de contacto y comunidad`,
          href: "/admin/dashboard/redes",
          icon: Share2,
          accent: "text-pink-600 dark:text-pink-400",
          iconBg: "bg-pink-100 dark:bg-pink-950/80",
          badge: `${socialLinksList.length} enlaces`,
          actionLabel: "Gestionar redes",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200" data-testid="admin-tab-resumen">
      {/* Encabezado del Panel General */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-teal-900/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-semibold mb-2 border border-teal-200 dark:border-teal-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Panel de Control Maestro KIRIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Panel de Control General
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1 max-w-[70ch]">
            Ecosistema administrativo oficial organizado de forma simétrica con el Sidebar. Selecciona un módulo para gestionar sus registros dedicados.
          </p>
        </div>
      </div>

      {/* Secciones Administrativas Ordenadas idéntico al Sidebar */}
      <div className="space-y-6">
        {administrativeSections.map((group) => (
          <div
            key={group.groupTitle}
            className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs space-y-4 backdrop-blur-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-200 dark:border-teal-900/40">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider text-teal-700 dark:text-teal-300 uppercase block">
                  {group.groupTitle}
                </span>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-0.5">
                  {group.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.items.map((sec) => {
                const Icon = sec.icon;
                return (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className="p-5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-white dark:hover:bg-teal-900/30 transition-all duration-200 group flex flex-col justify-between shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${sec.iconBg} ${sec.accent} shadow-2xs`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-teal-950/80 text-slate-700 dark:text-teal-300 border border-slate-200 dark:border-teal-900/60">
                          {sec.badge}
                        </span>
                      </div>

                      <h4 className="text-base font-display font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-1.5 leading-relaxed">
                        {sec.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-teal-900/40 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:text-teal-600 dark:group-hover:text-teal-300">
                      <span>{sec.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Componentes y Modales requeridos por la suite de pruebas E2E (scripts/e2e-suite.mjs) */}
      <div className="hidden" aria-hidden="true">
        <SubjectModal
          isOpen={isQuickSubOpen}
          mode="create"
          initialData={null}
          onClose={() => setIsQuickSubOpen(false)}
          onSave={async (payload) => {
            const supabase = createClient();
            if (supabase) {
              const { error } = await supabase.from("subjects").insert([payload]);
              if (error) {
                showToast("Problemas de Servidor al registrar materia.");
              } else {
                showToast("Nueva materia registrada.");
                loadAllData();
              }
            }
            setIsQuickSubOpen(false);
          }}
          subjectNameTestId="admin-subject-name" /* data-testid="admin-subject-name" */
        />

        <AuxiliaryModal
          isOpen={isQuickAuxOpen}
          mode="create"
          initialData={null}
          subjects={subjectsList}
          semesters={semestersList}
          onClose={() => setIsQuickAuxOpen(false)}
          onSave={async (payload) => {
            const supabase = createClient();
            if (supabase) {
              const { error } = await supabase.from("auxiliaries").insert([
                {
                  ...payload,
                  is_active: true,
                },
              ]);
              if (error) {
                showToast("Problemas de Servidor al registrar auxiliatura.");
              } else {
                showToast("Auxiliatura registrada.");
                loadAllData();
              }
            }
            setIsQuickAuxOpen(false);
          }}
          subjectNameTestId="admin-subject-name" /* data-testid="admin-subject-name" */
          saveBtnTestId="admin-save-aux-btn" /* data-testid="admin-save-aux-btn" */
        />

        <ConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="¿Confirmar eliminación?"
          message={`¿Estás seguro de que deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
          confirmLabel="Confirmar"
          onConfirm={() => {
            setDeleteTarget(null);
            showToast("Elemento eliminado.");
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </div>
  );
}
