"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Shield, 
  GraduationCap, 
  Compass, 
  Share2, 
  CheckSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Save, 
  Home,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"resumen" | "auxiliaturas" | "recomendaciones" | "redes" | "tareas">("resumen");

  // Estados de datos (con persistencia reactiva en memoria)
  const [auxiliariesList, setAuxiliariesList] = useState<Auxiliary[]>(defaultAuxiliaries);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(defaultRecommendations);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>(defaultSocialLinks);
  const [tasksList, setTasksList] = useState<AdminTask[]>(defaultAdminTasks);

  // Estados de formulario de nueva auxiliatura
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newGroupCode, setNewGroupCode] = useState("");
  const [newSchedule, setNewSchedule] = useState("");
  const [newSemester, setNewSemester] = useState("II-2026");
  const [newAuxDescription, setNewAuxDescription] = useState("");
  const [driveLinks, setDriveLinks] = useState<DriveLinkItem[]>([
    { title: "Carpeta Principal en Google Drive", url: "", type: "general" }
  ]);

  // Estados de formulario de recomendación
  const [newRecTitle, setNewRecTitle] = useState("");
  const [newRecDesc, setNewRecDesc] = useState("");
  const [newRecUrl, setNewRecUrl] = useState("");
  const [newRecCategoryId, setNewRecCategoryId] = useState(defaultCategories[0]?.id || "");
  const [newRecTags, setNewRecTags] = useState("");

  // Estados de formulario de tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baja" | "media" | "alta">("media");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  // Estados de formulario de enlace social
  const [newSocialLabel, setNewSocialLabel] = useState("");
  const [newSocialIcon, setNewSocialIcon] = useState("github");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Mensaje de éxito temporal
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

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

  // Guardar Auxiliatura
  const handleSaveAuxiliary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName || !newSubjectCode || !newGroupCode) return;

    const newAux: Auxiliary = {
      id: "aux-" + Date.now(),
      subject_name: newSubjectName,
      subject_code: newSubjectCode,
      group_code: newGroupCode,
      schedule: newSchedule,
      semester: newSemester,
      description: newAuxDescription,
      drive_links: driveLinks.filter((l) => l.url.trim() !== ""),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setAuxiliariesList([newAux, ...auxiliariesList]);
    setNewSubjectName("");
    setNewSubjectCode("");
    setNewGroupCode("");
    setNewSchedule("");
    setNewAuxDescription("");
    setDriveLinks([{ title: "Carpeta Principal en Google Drive", url: "", type: "general" }]);
    showNotification("Auxiliatura guardada exitosamente");
  };

  // Guardar Recomendación
  const handleSaveRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle || !newRecUrl) return;

    const newRec: Recommendation = {
      id: "rec-" + Date.now(),
      category_id: newRecCategoryId,
      title: newRecTitle,
      description: newRecDesc,
      url: newRecUrl,
      tags: newRecTags.split(",").map((t) => t.trim()).filter(Boolean),
      is_featured: false,
      created_at: new Date().toISOString(),
    };

    setRecommendationsList([newRec, ...recommendationsList]);
    setNewRecTitle("");
    setNewRecDesc("");
    setNewRecUrl("");
    setNewRecTags("");
    showNotification("Recomendación guardada con éxito");
  };

  // Guardar Tarea
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: AdminTask = {
      id: "task-" + Date.now(),
      title: newTaskTitle,
      priority: newTaskPriority,
      status: "pendiente",
      due_date: newTaskDueDate || undefined,
      created_at: new Date().toISOString(),
    };

    setTasksList([newTask, ...tasksList]);
    setNewTaskTitle("");
    setNewTaskDueDate("");
    showNotification("Tarea agregada a tu lista de pendientes");
  };

  // Toggle estado de tarea
  const toggleTaskStatus = (id: string) => {
    setTasksList(
      tasksList.map((t) => {
        if (t.id === id) {
          const nextStatus =
            t.status === "pendiente"
              ? "en_progreso"
              : t.status === "en_progreso"
              ? "completada"
              : "pendiente";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Guardar Enlace Social
  const handleSaveSocialLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel || !newSocialUrl) return;

    const newLink: SocialLink = {
      id: "soc-" + Date.now(),
      label: newSocialLabel,
      icon_name: newSocialIcon,
      url: newSocialUrl,
      is_active: true,
      display_order: socialLinksList.length + 1,
    };

    setSocialLinksList([...socialLinksList, newLink]);
    setNewSocialLabel("");
    setNewSocialUrl("");
    showNotification("Perfil de red añadido correctamente");
  };

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar de Navegación del Admin */}
      <aside className="w-full md:w-64 bg-[#091222] border-r border-blue-950/60 p-5 flex flex-col justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 p-1 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-white text-base tracking-wider">KIRIS</span>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Panel Admin</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("resumen")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "resumen"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Resumen General</span>
            </button>

            <button
              onClick={() => setActiveTab("auxiliaturas")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "auxiliaturas"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Auxiliaturas (Drive)</span>
            </button>

            <button
              onClick={() => setActiveTab("recomendaciones")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "recomendaciones"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Recomendaciones</span>
            </button>

            <button
              onClick={() => setActiveTab("redes")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "redes"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Perfiles & Redes</span>
            </button>

            <button
              onClick={() => setActiveTab("tareas")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                activeTab === "tareas"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Mis Tareas (To-Do)</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <Home className="w-4 h-4" />
            <span>Ver Sitio Web Público</span>
          </Link>
          <button
            onClick={() => router.push("/admin/login")}
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {notification && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* TAB 1: RESUMEN GENERAL */}
        {activeTab === "resumen" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Panel de Administración • KIRIS</h1>
              <p className="text-xs text-slate-400 mt-1">
                Bienvenido Marco. Aquí puedes actualizar materias, enlaces a Drive, recomendaciones y tareas sin tocar código.
              </p>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0B1528] border border-blue-900/40">
                <span className="text-xs text-slate-400">Auxiliaturas Activas</span>
                <p className="text-3xl font-black text-white mt-1">{auxiliariesList.length}</p>
                <span className="text-[10px] text-blue-400">UAGRM FICCT</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1528] border border-blue-900/40">
                <span className="text-xs text-slate-400">Recomendaciones</span>
                <p className="text-3xl font-black text-white mt-1">{recommendationsList.length}</p>
                <span className="text-[10px] text-cyan-400">{categoriesList.length} categorías</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1528] border border-blue-900/40">
                <span className="text-xs text-slate-400">Perfiles Conectados</span>
                <p className="text-3xl font-black text-white mt-1">{socialLinksList.length}</p>
                <span className="text-[10px] text-emerald-400">GitHub, AWS, etc.</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1528] border border-blue-900/40">
                <span className="text-xs text-slate-400">Tareas Pendientes</span>
                <p className="text-3xl font-black text-white mt-1">
                  {tasksList.filter((t) => t.status !== "completada").length}
                </p>
                <span className="text-[10px] text-amber-400">En seguimiento</span>
              </div>
            </div>

            {/* Accesos Directos */}
            <div className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6">
              <h2 className="text-base font-bold text-white mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab("auxiliaturas")}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 text-left transition"
                >
                  <GraduationCap className="w-5 h-5 text-blue-400 mb-2" />
                  <span className="block text-xs font-bold text-white">Nueva Auxiliatura</span>
                  <span className="text-[11px] text-slate-400">Agregar materia y links Drive</span>
                </button>
                <button
                  onClick={() => setActiveTab("recomendaciones")}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 text-left transition"
                >
                  <Compass className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="block text-xs font-bold text-white">Nueva Recomendación</span>
                  <span className="text-[11px] text-slate-400">Subir canal de YouTube o recurso</span>
                </button>
                <button
                  onClick={() => setActiveTab("tareas")}
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-blue-950/60 border border-slate-800 text-left transition"
                >
                  <CheckSquare className="w-5 h-5 text-emerald-400 mb-2" />
                  <span className="block text-xs font-bold text-white">Anotar Tarea</span>
                  <span className="text-[11px] text-slate-400">Gestionar pendientes académicos</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUXILIATURAS Y DRIVE */}
        {activeTab === "auxiliaturas" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Gestión de Auxiliaturas Universitarias</h1>
              <p className="text-xs text-slate-400 mt-1">
                Registra nuevas materias por Sigla y Grupo con enlaces configurables a Google Drive.
              </p>
            </div>

            {/* Formulario de Nueva Auxiliatura */}
            <form onSubmit={handleSaveAuxiliary} className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" />
                Registrar Nueva Auxiliatura
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Materia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Estructuras de Datos I"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sigla de Materia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. INF-220"
                    value={newSubjectCode}
                    onChange={(e) => setNewSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grupo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. SA"
                    value={newGroupCode}
                    onChange={(e) => setNewGroupCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horarios de Auxiliatura</label>
                  <input
                    type="text"
                    placeholder="Ej. Martes y Jueves 14:00 - 16:00"
                    value={newSchedule}
                    onChange={(e) => setNewSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Semestre</label>
                  <input
                    type="text"
                    placeholder="Ej. II-2026"
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Temario</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre las prácticas, temas avanzados y metodología de la auxiliatura..."
                  value={newAuxDescription}
                  onChange={(e) => setNewAuxDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Múltiples Enlaces a Drive */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-cyan-400">
                    Enlaces a Google Drive (Múltiples Enlaces)
                  </label>
                  <button
                    type="button"
                    onClick={addDriveLinkField}
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar otro enlace
                  </button>
                </div>

                <div className="space-y-2">
                  {driveLinks.map((link, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        placeholder="Título del enlace (Ej. Grabaciones)"
                        value={link.title}
                        onChange={(e) => updateDriveLink(idx, "title", e.target.value)}
                        className="w-full sm:w-1/3 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="url"
                        placeholder="URL de Google Drive (https://drive.google.com/...)"
                        value={link.url}
                        onChange={(e) => updateDriveLink(idx, "url", e.target.value)}
                        className="w-full sm:flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeDriveLink(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Auxiliatura
                </button>
              </div>
            </form>

            {/* Listado de Auxiliaturas Actuales */}
            <div className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4">Auxiliaturas Registradas ({auxiliariesList.length})</h2>
              <div className="space-y-3">
                {auxiliariesList.map((aux) => (
                  <div key={aux.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{aux.subject_name}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 text-xs font-mono">{aux.subject_code}</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-600/20 text-cyan-400 text-xs">Grupo {aux.group_code}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {aux.drive_links?.length || 0} enlace(s) a Google Drive configurado(s)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setAuxiliariesList(auxiliariesList.filter((a) => a.id !== aux.id));
                        showNotification("Auxiliatura eliminada");
                      }}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECOMENDACIONES */}
        {activeTab === "recomendaciones" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Gestión de Recomendaciones & Recursos</h1>
              <p className="text-xs text-slate-400 mt-1">
                Añade canales de YouTube, herramientas web y recursos clasificados por categorías.
              </p>
            </div>

            {/* Formulario de Recomendación */}
            <form onSubmit={handleSaveRecommendation} className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Nueva Recomendación
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Recurso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. DotCSV - Inteligencia Artificial"
                    value={newRecTitle}
                    onChange={(e) => setNewRecTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={newRecCategoryId}
                    onChange={(e) => setNewRecCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Enlace URL del Recurso *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newRecUrl}
                  onChange={(e) => setNewRecUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción Breve</label>
                <textarea
                  rows={2}
                  placeholder="Por qué lo recomiendas y qué aprenderán en este recurso..."
                  value={newRecDesc}
                  onChange={(e) => setNewRecDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="IA, Redes Neuronales, Next.js"
                  value={newRecTags}
                  onChange={(e) => setNewRecTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Recomendación
                </button>
              </div>
            </form>

            {/* Listado de Recomendaciones */}
            <div className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4">Recomendaciones Activas ({recommendationsList.length})</h2>
              <div className="space-y-3">
                {recommendationsList.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-white">{rec.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{rec.description}</p>
                      <a href={rec.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-1">
                        <span>{rec.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        setRecommendationsList(recommendationsList.filter((r) => r.id !== rec.id));
                        showNotification("Recomendación eliminada");
                      }}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REDES SOCIALES Y PERFILES */}
        {activeTab === "redes" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Gestión de Perfiles y Redes Sociales</h1>
              <p className="text-xs text-slate-400 mt-1">
                Añade o edita los botones del landing (GitHub, AWS, WhatsApp, Facebook, LinkedIn, etc.) sin tocar código.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveSocialLink} className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Agregar Nuevo Perfil
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre / Etiqueta *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. AWS Cloud o Facebook"
                    value={newSocialLabel}
                    onChange={(e) => setNewSocialLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Icono</label>
                  <select
                    value={newSocialIcon}
                    onChange={(e) => setNewSocialIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="github">GitHub</option>
                    <option value="mail">Correo / Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="aws">AWS</option>
                    <option value="globe">Enlace Web General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Enlace URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={newSocialUrl}
                    onChange={(e) => setNewSocialUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Agregar Enlace
                </button>
              </div>
            </form>

            {/* Listado */}
            <div className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4">Perfiles Configurables</h2>
              <div className="space-y-3">
                {socialLinksList.map((soc) => (
                  <div key={soc.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-sm text-white">{soc.label}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{soc.url}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSocialLinksList(socialLinksList.filter((s) => s.id !== soc.id));
                        showNotification("Enlace eliminado");
                      }}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MIS TAREAS DEL ADMINISTRADOR */}
        {activeTab === "tareas" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-black text-white">Gestor de Tareas del Administrador</h1>
              <p className="text-xs text-slate-400 mt-1">
                Organiza tus notas, pendientes y actividades de auxiliaturas de forma privada.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSaveTask} className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Nueva Tarea
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Tarea *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Calificar prácticas de INF-220 Grupo SA"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridad</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Agregar Tarea
                </button>
              </div>
            </form>

            {/* Lista de Tareas */}
            <div className="bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8">
              <h2 className="text-base font-bold text-white mb-4">Lista de Tareas ({tasksList.length})</h2>
              <div className="space-y-3">
                {tasksList.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                      task.status === "completada"
                        ? "bg-slate-950/60 border-slate-900 opacity-60"
                        : "bg-slate-900/80 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          task.status === "completada"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : task.status === "en_progreso"
                            ? "bg-amber-600/40 border-amber-500 text-amber-300"
                            : "border-slate-600 hover:border-blue-400"
                        }`}
                      >
                        {task.status === "completada" && <CheckSquare className="w-3.5 h-3.5" />}
                        {task.status === "en_progreso" && <Clock className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <span
                          className={`text-xs font-bold block ${
                            task.status === "completada" ? "line-through text-slate-500" : "text-white"
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              task.priority === "alta"
                                ? "bg-red-500/20 text-red-400"
                                : task.priority === "media"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            Prioridad {task.priority}
                          </span>
                          {task.due_date && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              {task.due_date}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            Estado: {task.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setTasksList(tasksList.filter((t) => t.id !== task.id));
                        showNotification("Tarea eliminada");
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
