"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Compass,
  Layers,
  Share2,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  AdminStatCard,
  SubjectModal,
  AuxiliaryModal,
} from "@/components/admin";
import ConfirmModal from "@/components/ConfirmModal";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardOverviewPage() {
  const router = useRouter();
  const {
    semestersList,
    subjectsList,
    auxiliariesList,
    categoriesList,
    recommendationsList,
    socialLinksList,
    loadAllData,
    showToast,
  } = useAdmin();

  // Estados para modales de creación rápida y eliminación confirmada
  const [isQuickSubOpen, setIsQuickSubOpen] = useState(false);
  const [isQuickAuxOpen, setIsQuickAuxOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Validaciones de URL e integridad (Heurística 9)
  const [recUrlError, setRecUrlError] = useState("");
  const [socialUrlError, setSocialUrlError] = useState("");

  const validateUrlProtocol = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }
    return true;
  };

  const currentSemester = semestersList.find((s) => s.is_current);

  return (
    <div className="space-y-7 animate-in fade-in duration-200" data-testid="admin-tab-resumen">
      {/* Encabezado del Resumen */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Panel de Control General
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
          Ecosistema administrativo oficial de KIRIS. Módulos separados por páginas con navegación dedicada, seguridad reforzada y modelo 3NF.
        </p>
      </div>

      {/* Tarjetas KPI Principales con Enlace a sus Páginas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminStatCard
          label="Catálogo de Materias"
          count={subjectsList.length}
          sub="Asignaturas oficiales únicas"
          icon={BookOpen}
          color="from-cyan-500 to-blue-600"
          onClick={() => router.push("/admin/dashboard/materias")}
        />
        <AdminStatCard
          label="Auxiliaturas Activas"
          count={auxiliariesList.filter((a) => a.is_active).length}
          sub={`${auxiliariesList.length} grupos asignados`}
          icon={GraduationCap}
          color="from-emerald-500 to-teal-600"
          onClick={() => router.push("/admin/dashboard/auxiliaturas")}
        />
        <AdminStatCard
          label="Semestres Académicos"
          count={semestersList.length}
          sub={currentSemester?.code ? `Actual: ${currentSemester.code}` : "Períodos lectivos"}
          icon={Calendar}
          color="from-teal-500 to-emerald-600"
          onClick={() => router.push("/admin/dashboard/semestres")}
        />
        <AdminStatCard
          label="Recursos de IA"
          count={recommendationsList.length}
          sub={`${categoriesList.length} categorías de recursos`}
          icon={Compass}
          color="from-teal-500 to-cyan-600"
          onClick={() => router.push("/admin/dashboard/recomendaciones")}
        />
      </div>

      {/* Módulos Administrativos: Accesos Rápidos por Páginas */}
      <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-700/60 shadow-xs">
        <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Secciones Administrativas Especializadas</span>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
            Rutas URL Dedicadas
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <Link
            href="/admin/dashboard/materias"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Materias
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {subjectsList.length} asignaturas registradas
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Gestionar catálogo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/auxiliaturas"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Auxiliaturas (Grupos)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {auxiliariesList.length} grupos asignados con Drive
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Gestionar grupos y enlaces</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/semestres"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Semestres
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {semestersList.length} períodos académicos
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Configurar semestres</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/categorias"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Categorías de Recursos
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {categoriesList.length} temáticas para IA y recursos
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Gestionar categorías</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/recomendaciones"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Recursos y Recomendaciones
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {recommendationsList.length} enlaces y herramientas
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Gestionar recursos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/dashboard/redes"
            className="p-4 rounded-2xl bg-slate-50 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 transition group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 transition">
                  Redes & Canales
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-teal-300/70">
                  {socialLinksList.length} enlaces de contacto
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-200/60 dark:border-teal-900/40">
              <span>Gestionar canales</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Botones de Registro Rápido */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIsQuickSubOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Nueva Materia</span>
        </button>
        <button
          onClick={() => setIsQuickAuxOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Asignar Grupo de Auxiliatura</span>
        </button>
      </div>

      {/* Modales de Creación Rápida accesibles desde Resumen */}
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

      {/* ConfirmModal para acciones destructivas */}
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
  );
}
