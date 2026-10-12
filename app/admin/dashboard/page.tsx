"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  defaultSocialLinks, 
  defaultCategories, 
  defaultRecommendations, 
  defaultAuxiliaries, 
  defaultAdminTasks 
} from "@/lib/data/initialData";
import { 
  SocialLink, 
  Category, 
  Recommendation, 
  Auxiliary, 
  AdminTask, 
  DriveLinkItem 
} from "@/types/database";
import { 
  GraduationCap, 
  Compass, 
  Share2, 
  CheckSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Save, 
  Home,
  CheckCircle2,
  FolderOpen,
  Tag,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"resumen" | "auxiliaturas" | "recomendaciones" | "redes" | "tareas">("resumen");
  const [isLoading, setIsLoading] = useState(true);

  // Estados de datos sincronizados con Supabase
  const [auxiliariesList, setAuxiliariesList] = useState<Auxiliary[]>(defaultAuxiliaries);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(defaultRecommendations);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>(defaultSocialLinks);
  const [tasksList, setTasksList] = useState<AdminTask[]>(defaultAdminTasks);

  // Formulario Auxiliatura
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newGroupCode, setNewGroupCode] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newSemester, setNewSemester] = useState("II-2026");
  const [newAuxDescription, setNewAuxDescription] = useState("");
  const [driveLinks, setDriveLinks] = useState<DriveLinkItem[]>([
    { title: "Carpeta Principal en Google Drive", url: "", type: "general" }
  ]);

  // Formulario Recomendación
  const [newRecTitle, setNewRecTitle] = useState("");
  const [newRecDesc, setNewRecDesc] = useState("");
  const [newRecUrl, setNewRecUrl] = useState("");
  const [newRecCategoryId, setNewRecCategoryId] = useState("");
  const [newRecTags, setNewRecTags] = useState("");
  const [newRecFeatured, setNewRecFeatured] = useState(false);
  const [recUrlError, setRecUrlError] = useState("");

  // Formulario Tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baja" | "media" | "alta">("media");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // Formulario Red Social
  const [newSocialLabel, setNewSocialLabel] = useState("");
  const [newSocialIcon, setNewSocialIcon] = useState("github");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [socialUrlError, setSocialUrlError] = useState("");

  // Modal de confirmación
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "aux" | "rec" | "soc" | "task";
    id: string;
    title: string;
  } | null>(null);

  // Notificación
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // 1. Cargar datos reales y verificar sesión en Supabase
  const loadData = async () => {
    setIsLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      // Verificar sesión
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && process.env.NODE_ENV === "production") {
        router.push("/admin/login");
        return;
      }

      // Cargar todas las tablas en paralelo
      const [auxRes, catRes, recRes, socRes, taskRes] = await Promise.all([
        supabase.from("auxiliaries").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("display_order", { ascending: true }),
        supabase.from("recommendations").select("*").order("created_at", { ascending: false }),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
        supabase.from("admin_tasks").select("*").order("created_at", { ascending: false }),
      ]);

      if (auxRes.data && auxRes.data.length > 0) setAuxiliariesList(auxRes.data as Auxiliary[]);
      if (catRes.data && catRes.data.length > 0) {
        setCategoriesList(catRes.data as Category[]);
        if (!newRecCategoryId) setNewRecCategoryId(catRes.data[0].id);
      }
      if (recRes.data && recRes.data.length > 0) setRecommendationsList(recRes.data as Recommendation[]);
      if (socRes.data && socRes.data.length > 0) setSocialLinksList(socRes.data as SocialLink[]);
      if (taskRes.data && taskRes.data.length > 0) setTasksList(taskRes.data as AdminTask[]);
    } catch (err) {
      console.error("Error al cargar datos desde Supabase:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Manejo de Drive Links
  const addDriveLinkField = () => {
    setDriveLinks([...driveLinks, { title: "Nuevo Enlace de Drive", url: "", type: "clases" }]);
  };

  const updateDriveLink = (index: number, field: keyof DriveLinkItem, value: string) => {
    const updated = [...driveLinks];
    updated[index] = { ...updated[index], [field]: value };
    setDriveLinks(updated);
  };

  const removeDriveLink = (index: number) => {
    setDriveLinks(driveLinks.filter((_, i) => i !== index));
  };

  // 2. Guardar Auxiliatura en Supabase
  const handleSaveAuxiliary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCode.trim() || !newGroupCode.trim()) return;

    const payload = {
      subject_name: newSubjectName.trim(),
      subject_code: newSubjectCode.trim(),
      group_code: newGroupCode.trim(),
      schedule: newSchedule.trim(),
      semester: newSemester.trim(),
      description: newAuxDescription.trim(),
      drive_links: driveLinks.filter((l) => l.url.trim() !== ""),
      is_active: true,
    };

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("auxiliaries").insert(payload).select().single();
      if (error) {
        showNotification("Error al guardar en Supabase: " + error.message);
        return;
      }
      if (data) {
        setAuxiliariesList([data as Auxiliary, ...auxiliariesList]);
      }
    } else {
      const localAux: Auxiliary = {
        id: "aux-" + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      setAuxiliariesList([localAux, ...auxiliariesList]);
    }

    setNewSubjectName("");
    setNewSubjectCode("");
    setNewGroupCode("");
    setNewSchedule("");
    setNewAuxDescription("");
    setDriveLinks([{ title: "Carpeta Principal en Google Drive", url: "", type: "general" }]);
    showNotification("Auxiliatura registrada con éxito");
  };

  // 3. Guardar Recomendación en Supabase
  const handleSaveRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle.trim() || !newRecUrl.trim() || !newRecCategoryId) return;

    if (!newRecUrl.startsWith("http://") && !newRecUrl.startsWith("https://")) {
      setRecUrlError("La URL debe comenzar con http:// o https://");
      return;
    }
    setRecUrlError("");

    const tagsArray = newRecTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const payload = {
      category_id: newRecCategoryId,
      title: newRecTitle.trim(),
      description: newRecDesc.trim(),
      url: newRecUrl.trim(),
      tags: tagsArray,
      is_featured: newRecFeatured,
    };

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("recommendations").insert(payload).select().single();
      if (error) {
        showNotification("Error al guardar en Supabase: " + error.message);
        return;
      }
      if (data) {
        setRecommendationsList([data as Recommendation, ...recommendationsList]);
      }
    } else {
      const localRec: Recommendation = {
        id: "rec-" + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      setRecommendationsList([localRec, ...recommendationsList]);
    }

    setNewRecTitle("");
    setNewRecDesc("");
    setNewRecUrl("");
    setNewRecTags("");
    setNewRecFeatured(false);
    showNotification("Recomendación guardada con éxito");
  };

  // 4. Guardar Tarea en Supabase
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const payload = {
      title: newTaskTitle.trim(),
      priority: newTaskPriority,
      status: "pendiente" as const,
      due_date: newTaskDueDate || undefined,
    };

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("admin_tasks").insert(payload).select().single();
      if (error) {
        showNotification("Error al guardar tarea: " + error.message);
        return;
      }
      if (data) {
        setTasksList([data as AdminTask, ...tasksList]);
      }
    } else {
      const localTask: AdminTask = {
        id: "task-" + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      setTasksList([localTask, ...tasksList]);
    }

    setNewTaskTitle("");
    setNewTaskDueDate("");
    showNotification("Tarea agregada a tus pendientes");
  };

  // 5. Toggle estado de tarea
  const toggleTaskStatus = async (id: string) => {
    const currentTask = tasksList.find((t) => t.id === id);
    if (!currentTask) return;

    const nextStatus =
      currentTask.status === "pendiente"
        ? "en_progreso"
        : currentTask.status === "en_progreso"
        ? "completada"
        : "pendiente";

    const supabase = createClient();
    if (supabase) {
      await supabase.from("admin_tasks").update({ status: nextStatus }).eq("id", id);
    }

    setTasksList(
      tasksList.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  // 6. Guardar Enlace Social en Supabase
  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel.trim() || !newSocialUrl.trim()) return;

    if (!newSocialUrl.startsWith("http://") && !newSocialUrl.startsWith("https://") && !newSocialUrl.startsWith("mailto:")) {
      setSocialUrlError("El enlace debe ser válido (ej. https://... o mailto:...)");
      return;
    }
    setSocialUrlError("");

    const payload = {
      label: newSocialLabel.trim(),
      icon_name: newSocialIcon,
      url: newSocialUrl.trim(),
      is_active: true,
      display_order: socialLinksList.length + 1,
    };

    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.from("social_links").insert(payload).select().single();
      if (error) {
        showNotification("Error al guardar enlace: " + error.message);
        return;
      }
      if (data) {
        setSocialLinksList([...socialLinksList, data as SocialLink]);
      }
    } else {
      const localLink: SocialLink = {
        id: "soc-" + Date.now(),
        ...payload,
        created_at: new Date().toISOString(),
      };
      setSocialLinksList([...socialLinksList, localLink]);
    }

    setNewSocialLabel("");
    setNewSocialUrl("");
    showNotification("Perfil de red guardado");
  };

  // 7. Ejecutar eliminación en Supabase
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    const supabase = createClient();

    if (deleteTarget.type === "aux") {
      if (supabase) await supabase.from("auxiliaries").delete().eq("id", deleteTarget.id);
      setAuxiliariesList(auxiliariesList.filter((a) => a.id !== deleteTarget.id));
      showNotification(`Auxiliatura eliminada`);
    } else if (deleteTarget.type === "rec") {
      if (supabase) await supabase.from("recommendations").delete().eq("id", deleteTarget.id);
      setRecommendationsList(recommendationsList.filter((r) => r.id !== deleteTarget.id));
      showNotification(`Recomendación eliminada`);
    } else if (deleteTarget.type === "soc") {
      if (supabase) await supabase.from("social_links").delete().eq("id", deleteTarget.id);
      setSocialLinksList(socialLinksList.filter((s) => s.id !== deleteTarget.id));
      showNotification(`Enlace eliminado`);
    } else if (deleteTarget.type === "task") {
      if (supabase) await supabase.from("admin_tasks").delete().eq("id", deleteTarget.id);
      setTasksList(tasksList.filter((t) => t.id !== deleteTarget.id));
      showNotification(`Tarea eliminada`);
    }

    setDeleteTarget(null);
  };

  // Cerrar sesión
  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f0fdfa] dark:bg-[#061417] text-slate-800 dark:text-emerald-50 flex flex-col md:flex-row transition-colors duration-200">
      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="¿Confirmar Eliminación?"
        message={`Estás a punto de eliminar "${deleteTarget?.title}". Esta acción es irreversible.`}
        confirmLabel="Sí, Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleExecuteDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Sidebar de Navegación del Panel */}
      <aside className="w-full md:w-64 bg-white/90 dark:bg-[#081e19]/90 border-b md:border-b-0 md:border-r border-teal-200/80 dark:border-teal-900/60 p-5 flex flex-col justify-between flex-shrink-0 backdrop-blur-md shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 p-1 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-black text-slate-900 dark:text-white text-base tracking-wider">KIRIS</span>
              <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400">ADMIN CONTROL</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("resumen")}
              data-testid="admin-tab-resumen"
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "resumen"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-teal-200/70 hover:bg-teal-50 dark:hover:bg-teal-950/60"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Resumen General</span>
            </button>

            <button
              onClick={() => setActiveTab("auxiliaturas")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "auxiliaturas"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-teal-200/70 hover:bg-teal-50 dark:hover:bg-teal-950/60"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Auxiliaturas ({auxiliariesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("recomendaciones")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "recomendaciones"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-teal-200/70 hover:bg-teal-50 dark:hover:bg-teal-950/60"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Recursos ({recommendationsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("redes")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "redes"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-teal-200/70 hover:bg-teal-50 dark:hover:bg-teal-950/60"
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Redes Sociales ({socialLinksList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("tareas")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "tareas"
                  ? "bg-teal-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-teal-200/70 hover:bg-teal-50 dark:hover:bg-teal-950/60"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tareas Pendientes ({tasksList.filter(t => t.status !== "completada").length})</span>
            </button>
          </nav>
        </div>

        {/* Acciones inferiores */}
        <div className="pt-4 border-t border-teal-100 dark:border-teal-900/60 space-y-2 text-xs">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-mono text-slate-500">TEMA</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Portal Público</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal del Panel */}
      <main className="flex-1 p-6 sm:p-8 max-w-6xl mx-auto overflow-y-auto">
        {/* Notificación flotante */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-teal-600 text-white text-xs font-bold shadow-xl animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* ========================================================
            TAB: RESUMEN GENERAL
        ======================================================== */}
        {activeTab === "resumen" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-teal-200/80 dark:border-teal-900/60">
              <div>
                <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Panel de Administración</h1>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">
                  Gestiona las materias de auxiliatura, recursos de IA y configuración de Supabase.
                </p>
              </div>
              <button
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Auxiliaturas</span>
                <p className="text-3xl font-display font-black text-teal-600 dark:text-teal-300 mt-1">{auxiliariesList.length}</p>
              </div>

              <div className="p-5 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Recursos</span>
                <p className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-300 mt-1">{recommendationsList.length}</p>
              </div>

              <div className="p-5 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Redes Activas</span>
                <p className="text-3xl font-display font-black text-cyan-600 dark:text-cyan-300 mt-1">{socialLinksList.length}</p>
              </div>

              <div className="p-5 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Pendientes</span>
                <p className="text-3xl font-display font-black text-amber-500 mt-1">
                  {tasksList.filter(t => t.status !== "completada").length}
                </p>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Acciones Rápidas</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("auxiliaturas")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Nueva Auxiliatura</span>
                </button>
                <button
                  onClick={() => setActiveTab("recomendaciones")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publicar Nuevo Recurso</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: AUXILIATURAS (CRUD COMPLETO)
        ======================================================== */}
        {activeTab === "auxiliaturas" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Gestión de Auxiliaturas</h1>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">
                Registra materias, códigos de grupo y enlaces a las carpetas en Google Drive.
              </p>
            </div>

            {/* Formulario de Registro */}
            <form onSubmit={handleSaveAuxiliary} className="p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                <span>Nueva Auxiliatura</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Nombre de la Materia *</label>
                  <input
                    type="text"
                    required
                    data-testid="admin-subject-name"
                    placeholder="Ej. Estructuras de Datos I"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Sigla / Código *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. INF-220"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Grupo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. SA o SB"
                    value={newGroupCode}
                    onChange={(e) => setNewGroupCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Horario de Auxiliatura</label>
                  <input
                    type="text"
                    placeholder="Ej. Mar/Jue 14:00 - 16:00"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Semestre</label>
                  <input
                    type="text"
                    placeholder="Ej. II-2026"
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Descripción / Indicaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el avance o requisitos de la auxiliatura..."
                  value={newAuxDescription}
                  onChange={(e) => setNewAuxDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Enlaces a Drive */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-slate-500 mb-2">Enlaces a Google Drive</label>
                <div className="space-y-2">
                  {driveLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Título del enlace (Ej. Carpeta de Prácticas)"
                        value={link.title}
                        onChange={(e) => updateDriveLink(idx, "title", e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                      />
                      <input
                        type="url"
                        placeholder="URL de Google Drive (https://drive.google.com/...)"
                        value={link.url}
                        onChange={(e) => updateDriveLink(idx, "url", e.target.value)}
                        className="flex-2 px-3 py-1.5 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                      />
                      {driveLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDriveLink(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDriveLinkField}
                  className="mt-2 text-xs font-semibold text-teal-600 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar otro enlace de Drive</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  data-testid="admin-save-aux-btn"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Auxiliatura</span>
                </button>
              </div>
            </form>

            {/* Listado Actual */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Auxiliaturas Registradas ({auxiliariesList.length})</h2>
              {auxiliariesList.map((aux) => (
                <div key={aux.id} className="p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                        {aux.subject_code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">Grupo {aux.group_code}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{aux.subject_name}</h3>
                    {aux.schedule && <p className="text-xs text-slate-500 mt-0.5">{aux.schedule}</p>}
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ type: "aux", id: aux.id, title: aux.subject_name })}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: RECOMENDACIONES (CRUD COMPLETO)
        ======================================================== */}
        {activeTab === "recomendaciones" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Gestión de Recursos &amp; IA</h1>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">
                Publica herramientas web, canales y librerías recomendadas.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveRecommendation} className="p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Nuevo Recurso</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Título del Recurso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hugging Face Spaces"
                    value={newRecTitle}
                    onChange={(e) => setNewRecTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Categoría *</label>
                  <select
                    value={newRecCategoryId}
                    onChange={(e) => setNewRecCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">URL de Destino *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newRecUrl}
                  onChange={(e) => setNewRecUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                />
                {recUrlError && <p className="text-[11px] text-rose-500 mt-1">{recUrlError}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Breve reseña sobre la utilidad de este recurso..."
                  value={newRecDesc}
                  onChange={(e) => setNewRecDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    placeholder="IA, LLM, Python"
                    value={newRecTags}
                    onChange={(e) => setNewRecTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="recFeatured"
                    checked={newRecFeatured}
                    onChange={(e) => setNewRecFeatured(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="recFeatured" className="text-xs font-semibold text-slate-700 dark:text-teal-200">
                    Marcar como Destacado ⭐
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publicar Recurso</span>
                </button>
              </div>
            </form>

            {/* Listado */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recursos Publicados ({recommendationsList.length})</h2>
              {recommendationsList.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rec.description}</p>
                    <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-teal-600 hover:underline mt-1 inline-flex items-center gap-1">
                      <span>{rec.url}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ type: "rec", id: rec.id, title: rec.title })}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: REDES SOCIALES
        ======================================================== */}
        {activeTab === "redes" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Redes Sociales &amp; Contacto</h1>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">
                Gestiona los enlaces de contacto que aparecen en tu página de Sobre Mí.
              </p>
            </div>

            <form onSubmit={handleSaveSocialLink} className="p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Nombre / Etiqueta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. GitHub"
                    value={newSocialLabel}
                    onChange={(e) => setNewSocialLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">Ícono</label>
                  <select
                    value={newSocialIcon}
                    onChange={(e) => setNewSocialIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                  >
                    <option value="github">GitHub</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="mail">Correo Electrónico</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="globe">Sitio Web</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-500 mb-1">URL / Enlace *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                  />
                  {socialUrlError && <p className="text-[11px] text-rose-500 mt-1">{socialUrlError}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Perfil de Red</span>
              </button>
            </form>

            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Perfiles Configurados ({socialLinksList.length})</h2>
              {socialLinksList.map((soc) => (
                <div key={soc.id} className="p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{soc.label}</span>
                    <p className="text-xs text-slate-500">{soc.url}</p>
                  </div>
                  <button
                    onClick={() => setDeleteTarget({ type: "soc", id: soc.id, title: soc.label })}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: TAREAS PENDIENTES
        ======================================================== */}
        {activeTab === "tareas" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Lista de Tareas Administrativas</h1>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">
                Seguimiento privado de pendientes de auxiliatura y desarrollo.
              </p>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white dark:bg-[#081e19] shadow-sm flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Subir notas del 1er parcial de INF-220..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="w-full sm:w-36">
                <label className="block text-[11px] font-mono text-slate-500 mb-1">Prioridad</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-teal-50/40 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </form>

            <div className="space-y-2">
              {tasksList.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    task.status === "completada"
                      ? "bg-slate-50 dark:bg-[#071916]/50 border-slate-200 dark:border-teal-950 opacity-60"
                      : "bg-white dark:bg-[#081e19] border-teal-200/80 dark:border-teal-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                        task.status === "completada"
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-teal-400 dark:border-teal-700"
                      }`}
                    >
                      {task.status === "completada" && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className={`text-xs font-semibold ${task.status === "completada" ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => setDeleteTarget({ type: "task", id: task.id, title: task.title })}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
