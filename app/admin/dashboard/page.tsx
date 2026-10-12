"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  defaultSocialLinks, 
  defaultCategories, 
  defaultRecommendations, 
  defaultAuxiliaries,
  defaultSubjects,
  defaultSemesters,
} from "@/lib/data/initialData";
import { 
  SocialLink, 
  Category, 
  Recommendation, 
  Auxiliary, 
  Subject,
  Semester,
  DriveLinkItem 
} from "@/types/database";
import { 
  GraduationCap, 
  Compass, 
  Share2, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Home, 
  CheckCircle2, 
  FolderOpen, 
  RefreshCw, 
  Search, 
  Layers, 
  X, 
  Menu, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Loader2,
  Calendar,
  BookOpen
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ConfirmModal from "@/components/ConfirmModal";
import InitialsAvatar from "@/components/InitialsAvatar";
import {
  AdminStatCard,
  AdminPageHeader,
  AdminEmptyState,
  AuxiliaryModal,
  SubjectModal,
  SemesterModal,
  CategoryModal,
  RecommendationModal,
  SocialModal,
} from "@/components/admin";

type AdminTab = "resumen" | "semestres" | "materias" | "auxiliaturas" | "categorias" | "recomendaciones" | "redes";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("resumen");
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("marcolop450@gmail.com");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados de datos normalizados
  const [semestersList, setSemestersList] = useState<Semester[]>(defaultSemesters);
  const [subjectsList, setSubjectsList] = useState<Subject[]>(defaultSubjects);
  const [auxiliariesList, setAuxiliariesList] = useState<Auxiliary[]>(defaultAuxiliaries);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(defaultRecommendations);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>(defaultSocialLinks);

  // Búsquedas y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState("all");

  // Modales de Creación y Edición
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeModalType, setActiveModalType] = useState<"sem" | "sub" | "aux" | "cat" | "rec" | "soc" | null>(null);

  // Elementos seleccionados para editar
  const [selectedSem, setSelectedSem] = useState<Semester | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subject | null>(null);
  const [selectedAux, setSelectedAux] = useState<Auxiliary | null>(null);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [selectedSoc, setSelectedSoc] = useState<SocialLink | null>(null);

  // Errores de validación de URL para Heurística 9
  const [recUrlError, setRecUrlError] = useState("");
  const [socialUrlError, setSocialUrlError] = useState("");

  // Modal de confirmación para eliminar
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "sem" | "sub" | "aux" | "cat" | "rec" | "soc";
    id: string;
    title: string;
  } | null>(null);

  // Notificaciones Toast
  const [notification, setNotification] = useState("");
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // 1. Verificación Estricta de Sesión (Sin bypass de desarrollo)
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.replace("/admin/login");
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          router.replace("/admin/login");
          return;
        }

        if (session.user?.email) {
          setAdminEmail(session.user.email);
        }
        setIsVerifyingAuth(false);
        loadAllData(supabase);
      } catch {
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  // 2. Cargar todos los datos desde Supabase
  const loadAllData = async (supabase = createClient()) => {
    if (!supabase) return;
    setIsLoading(true);

    try {
      const [semRes, catRes, subRes, auxRes, recRes, socRes] = await Promise.all([
        supabase.from("semesters").select("*").order("display_order", { ascending: true }),
        supabase.from("categories").select("*").order("display_order", { ascending: true }),
        supabase.from("subjects").select("*, category:categories(*)").order("code", { ascending: true }),
        supabase.from("auxiliaries").select("*, subject:subjects(*), semester:semesters(*)").order("created_at", { ascending: false }),
        supabase.from("recommendations").select("*, category:categories(*)").order("created_at", { ascending: false }),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (semRes.data) setSemestersList(semRes.data as Semester[]);
      if (catRes.data) setCategoriesList(catRes.data as Category[]);
      if (subRes.data) setSubjectsList(subRes.data as Subject[]);
      if (auxRes.data) setAuxiliariesList(auxRes.data as Auxiliary[]);
      if (recRes.data) setRecommendationsList(recRes.data as Recommendation[]);
      if (socRes.data) setSocialLinksList(socRes.data as SocialLink[]);
    } catch {
      showToast("Problemas de Servidor al sincronizar datos.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Cerrar Sesión
  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  // -------------------------------------------------------------
  // CRUD SEMESTRES (NUEVO MAESTRO)
  // -------------------------------------------------------------
  const openSemesterModal = (sem?: Semester) => {
    setSelectedSem(sem || null);
    setModalMode(sem ? "edit" : "create");
    setActiveModalType("sem");
  };

  const handleSaveSemester = async (payload: {
    code: string;
    name: string;
    is_current: boolean;
    display_order: number;
  }) => {
    const supabase = createClient();
    if (supabase) {
      // Si se marca como actual, desmarcar otros si es necesario
      if (payload.is_current) {
        await supabase.from("semesters").update({ is_current: false }).neq("id", selectedSem?.id || "00000000-0000-0000-0000-000000000000");
      }

      if (modalMode === "edit" && selectedSem?.id) {
        const { error } = await supabase.from("semesters").update(payload).eq("id", selectedSem.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar el semestre.");
          return;
        }
        showToast("Semestre actualizado exitosamente.");
      } else {
        const { error } = await supabase.from("semesters").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al registrar el semestre.");
          return;
        }
        showToast("Nuevo semestre académico registrado.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  const toggleSemesterCurrent = async (sem: Semester) => {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("semesters").update({ is_current: false }).neq("id", sem.id);
      await supabase.from("semesters").update({ is_current: !sem.is_current }).eq("id", sem.id);
      loadAllData(supabase);
      showToast(`Semestre ${!sem.is_current ? "marcado como actual" : "desmarcado"}.`);
    }
  };

  // -------------------------------------------------------------
  // CRUD MATERIAS (NUEVO MAESTRO - CATÁLOGO FORMAL)
  // -------------------------------------------------------------
  const openSubjectModal = (sub?: Subject) => {
    setSelectedSub(sub || null);
    setModalMode(sub ? "edit" : "create");
    setActiveModalType("sub");
  };

  const handleSaveSubject = async (payload: {
    name: string;
    code: string;
    category_id?: string;
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
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  // -------------------------------------------------------------
  // CRUD AUXILIATURAS (NORMALIZADO: ASOCIACIÓN GRUPO + DRIVE)
  // -------------------------------------------------------------
  const openAuxModal = (aux?: Auxiliary) => {
    setSelectedAux(aux || null);
    setModalMode(aux ? "edit" : "create");
    setActiveModalType("aux");
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
        const { error } = await supabase.from("auxiliaries").update({
          ...payload,
          is_active: selectedAux.is_active ?? true,
        }).eq("id", selectedAux.id);

        if (error) {
          showToast("Problemas de Servidor al actualizar la auxiliatura.");
          return;
        }
        showToast("Auxiliatura actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("auxiliaries").insert([{
          ...payload,
          is_active: true,
        }]);

        if (error) {
          if (error.message?.includes("uq_auxiliary_subject_semester_group")) {
            showToast("Ya existe este grupo registrado para esta materia en el mismo semestre.");
            return;
          }
          showToast("Problemas de Servidor al guardar la auxiliatura.");
          return;
        }
        showToast("Nueva auxiliatura de grupo asignada.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  const toggleAuxiliaryActive = async (aux: Auxiliary) => {
    const supabase = createClient();
    const updated = !aux.is_active;
    if (supabase) {
      await supabase.from("auxiliaries").update({ is_active: updated }).eq("id", aux.id);
      loadAllData(supabase);
    }
    showToast(`Auxiliatura ${updated ? "activada" : "desactivada"} en el portal público.`);
  };

  // -------------------------------------------------------------
  // CRUD CATEGORÍAS
  // -------------------------------------------------------------
  const openCategoryModal = (cat?: Category) => {
    setSelectedCat(cat || null);
    setModalMode(cat ? "edit" : "create");
    setActiveModalType("cat");
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
        showToast("Categoría actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("categories").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al guardar la categoría.");
          return;
        }
        showToast("Nueva categoría creada exitosamente.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  // -------------------------------------------------------------
  // CRUD RECOMENDACIONES
  // -------------------------------------------------------------
  const openRecommendationModal = (rec?: Recommendation) => {
    setSelectedRec(rec || null);
    setModalMode(rec ? "edit" : "create");
    setRecUrlError("");
    setActiveModalType("rec");
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
    setRecUrlError("");
    if (!payload.url.startsWith("http://") && !payload.url.startsWith("https://")) {
      setRecUrlError("La URL debe comenzar con http:// o https://");
      showToast("Ingresa una URL válida con http:// o https://");
      return;
    }

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedRec?.id) {
        const { error } = await supabase.from("recommendations").update(payload).eq("id", selectedRec.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar el recurso.");
          return;
        }
        showToast("Recurso actualizado con éxito.");
      } else {
        const { error } = await supabase.from("recommendations").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al guardar el recurso.");
          return;
        }
        showToast("Nuevo recurso publicado.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  const toggleRecommendationFeatured = async (rec: Recommendation) => {
    const supabase = createClient();
    const updated = !rec.is_featured;
    if (supabase) {
      await supabase.from("recommendations").update({ is_featured: updated }).eq("id", rec.id);
      loadAllData(supabase);
    }
    showToast(`Recurso ${updated ? "marcado como destacado" : "desmarcado de destacados"}.`);
  };

  // -------------------------------------------------------------
  // CRUD REDES SOCIALES
  // -------------------------------------------------------------
  const openSocialModal = (soc?: SocialLink) => {
    setSelectedSoc(soc || null);
    setModalMode(soc ? "edit" : "create");
    setSocialUrlError("");
    setActiveModalType("soc");
  };

  const handleSaveSocial = async (payload: {
    label: string;
    icon_name: string;
    url: string;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
  }) => {
    setSocialUrlError("");
    if (!payload.url.startsWith("http://") && !payload.url.startsWith("https://")) {
      setSocialUrlError("La URL debe comenzar con http:// o https://");
      showToast("Ingresa una URL válida con http:// o https://");
      return;
    }

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && selectedSoc?.id) {
        const { error } = await supabase.from("social_links").update(payload).eq("id", selectedSoc.id);
        if (error) {
          showToast("Problemas de Servidor al actualizar el enlace.");
          return;
        }
        showToast("Enlace social actualizado.");
      } else {
        const { error } = await supabase.from("social_links").insert([payload]);
        if (error) {
          showToast("Problemas de Servidor al guardar el enlace social.");
          return;
        }
        showToast("Nueva red social añadida.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  // -------------------------------------------------------------
  // ELIMINACIÓN CONFIRMADA GENERAL (Heurística 5)
  // -------------------------------------------------------------
  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const supabase = createClient();

    if (supabase) {
      const tableMap = {
        sem: "semesters",
        sub: "subjects",
        aux: "auxiliaries",
        cat: "categories",
        rec: "recommendations",
        soc: "social_links",
      };
      const { error } = await supabase.from(tableMap[type]).delete().eq("id", id);
      if (error) {
        showToast("Problemas de Servidor al eliminar el registro.");
        return;
      }
      loadAllData(supabase);
    }

    showToast("Registro eliminado correctamente.");
    setDeleteTarget(null);
  };

  // Filtros en memoria
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

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) return subjectsList;
    const q = searchQuery.toLowerCase();
    return subjectsList.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [subjectsList, searchQuery]);

  const filteredRecommendations = useMemo(() => {
    return recommendationsList.filter((r) => {
      const matchCategory = selectedCategoryFilter === "all" || r.category_id === selectedCategoryFilter;
      const matchSearch =
        !searchQuery ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCategory && matchSearch;
    });
  }, [recommendationsList, selectedCategoryFilter, searchQuery]);

  // Pantalla de Verificación de Autenticación
  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#dff0fa] dark:bg-[#061317] text-slate-900 dark:text-white p-4">
        <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl flex flex-col items-center text-center max-w-sm w-full backdrop-blur-xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 flex items-center justify-center mb-4">
            <div className="w-full h-full rounded-[18px] bg-white dark:bg-[#071915] p-2 flex items-center justify-center">
              <Image src="/images/logo_kiris.png" alt="Logo KIRIS" width={42} height={42} priority />
            </div>
          </div>
          <h3 className="text-lg font-display font-black tracking-tight flex items-center gap-2">
            <span>Verificando Acceso Seguro</span>
            <Loader2 className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-spin" />
          </h3>
          <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1 font-sans">
            Comprobando sesión activa con Supabase...
          </p>
        </div>
      </div>
    );
  }

  // Estructura jerárquica del sidebar según el modelo de negocio
  const sidebarNavGroups = [
    {
      groupTitle: "PANEL PRINCIPAL",
      items: [
        { id: "resumen", label: "Resumen General", icon: Home, count: null },
      ],
    },
    {
      groupTitle: "GESTIÓN ACADÉMICA (FICCT)",
      items: [
        { id: "semestres", label: "Semestres", icon: Calendar, count: semestersList.length },
        { id: "materias", label: "Catálogo de Materias", icon: BookOpen, count: subjectsList.length },
        { id: "auxiliaturas", label: "Auxiliaturas (Grupos)", icon: GraduationCap, count: auxiliariesList.length },
      ],
    },
    {
      groupTitle: "ECOSISTEMA DE RECURSOS & IA",
      items: [
        { id: "categorias", label: "Categorías", icon: Layers, count: categoriesList.length },
        { id: "recomendaciones", label: "Recursos y Recomendaciones", icon: Compass, count: recommendationsList.length },
      ],
    },
    {
      groupTitle: "CONTACTO & PRESENCIA",
      items: [
        { id: "redes", label: "Redes y Canales", icon: Share2, count: socialLinksList.length },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#dff0fa] dark:bg-[#061317] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[100000] p-4 rounded-2xl bg-slate-900/95 dark:bg-teal-950/95 text-white border border-teal-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BARRA SUPERIOR PARA MÓVILES (Responsiva)                      */}
      {/* ------------------------------------------------------------- */}
      <header className="md:hidden flex items-center justify-between px-4 py-3.5 bg-white/90 dark:bg-[#07191d]/90 border-b border-slate-300 dark:border-teal-800/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo_kiris.png" alt="Logo KIRIS" width={32} height={32} />
          <div>
            <span className="font-display font-black tracking-tight text-base">KIRIS</span>
            <span className="text-[10px] block font-mono text-teal-700 dark:text-teal-300 font-semibold leading-none">
              ADMIN CONTROL
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-700 dark:text-teal-200"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR JERÁRQUICO (ORDEN ADMINISTRADOR DE NEGOCIO)            */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 z-50 md:z-10 bg-white/95 dark:bg-[#07191d]/95 border-r border-slate-300 dark:border-teal-800/60 flex flex-col justify-between p-5 backdrop-blur-xl transition-transform duration-300 ease-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Emblema */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#071915] p-1.5 flex items-center justify-center">
                  <Image src="/images/logo_kiris.png" alt="Logo KIRIS" width={28} height={28} />
                </div>
              </div>
              <div>
                <span className="font-display font-black tracking-tight text-lg leading-none block text-slate-900 dark:text-white">
                  KIRIS
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-700 dark:text-teal-300 tracking-wider">
                  ADMIN CONTROL
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-teal-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Insignia de Administrador Autenticado */}
          <div className="mt-3.5 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-display font-bold flex items-center justify-center text-xs shadow-xs">
              ML
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold block truncate text-slate-900 dark:text-white">
                Marco Lopez
              </span>
              <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 block truncate">
                {adminEmail}
              </span>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>

          {/* Menú de Navegación Organizado por Jerarquía */}
          <nav className="mt-5 space-y-4" aria-label="Secciones del Administrador">
            {sidebarNavGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-teal-400/60 px-3 tracking-wider uppercase">
                  {group.groupTitle}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      data-testid={item.id === "resumen" ? "admin-tab-resumen" : `admin-tab-${item.id}`} /* data-testid="admin-tab-resumen" */
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setMobileMenuOpen(false);
                        setSearchQuery("");
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25 scale-[1.01]"
                          : "text-slate-700 dark:text-teal-200/80 hover:bg-slate-100 dark:hover:bg-teal-950/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== null && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white/20 text-white font-bold"
                              : "bg-slate-200/80 dark:bg-teal-900/60 text-slate-600 dark:text-teal-300"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-teal-900/60 space-y-2 shrink-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-teal-300/70">Tema</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-teal-200/80 hover:bg-slate-100 dark:hover:bg-teal-950/60 transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-teal-500" />
              <span>Ver Portal Público</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* CONTENIDO PRINCIPAL                                           */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* =========================================================== */}
        {/* PESTAÑA 1: RESUMEN GENERAL                                 */}
        {/* =========================================================== */}
        {activeTab === "resumen" && (
          <div className="space-y-7 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Panel de Control General
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
                Ecosistema administrativo oficial de KIRIS. Modelo de datos normalizado para materias, semestres, auxiliaturas y recursos de IA.
              </p>
            </div>

            {/* Tarjetas de Métricas KPI Reutilizables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <AdminStatCard
                label="Catálogo de Materias"
                count={subjectsList.length}
                sub="Asignaturas oficiales"
                icon={BookOpen}
                color="from-cyan-500 to-blue-600"
                onClick={() => setActiveTab("materias")}
              />
              <AdminStatCard
                label="Auxiliaturas Activas"
                count={auxiliariesList.filter((a) => a.is_active).length}
                sub={`${auxiliariesList.length} grupos asignados`}
                icon={GraduationCap}
                color="from-emerald-500 to-teal-600"
                onClick={() => setActiveTab("auxiliaturas")}
              />
              <AdminStatCard
                label="Semestres Académicos"
                count={semestersList.length}
                sub={semestersList.find((s) => s.is_current)?.code ? `Actual: ${semestersList.find((s) => s.is_current)?.code}` : "Períodos lectivos"}
                icon={Calendar}
                color="from-teal-500 to-emerald-600"
                onClick={() => setActiveTab("semestres")}
              />
              <AdminStatCard
                label="Recursos de IA"
                count={recommendationsList.length}
                sub={`${categoriesList.length} categorías`}
                icon={Compass}
                color="from-teal-500 to-cyan-600"
                onClick={() => setActiveTab("recomendaciones")}
              />
            </div>

            {/* Acciones Rápidas */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-700/60 shadow-xs">
              <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-3">
                Acciones Rápidas de Administración
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => openSubjectModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Materia</span>
                </button>
                <button
                  onClick={() => openAuxModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Asignar Grupo de Auxiliatura</span>
                </button>
                <button
                  onClick={() => openSemesterModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Semestre</span>
                </button>
                <button
                  onClick={() => openRecommendationModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Recurso de IA</span>
                </button>
                <button
                  onClick={() => loadAllData()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-teal-950/40 border border-slate-300 dark:border-teal-900/60 text-slate-700 dark:text-teal-300 hover:bg-slate-200 transition ml-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Sincronizar Supabase</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 2: SEMESTRES ACADÉMICOS (NUEVO MÓDULO NORMALIZADO)  */}
        {/* =========================================================== */}
        {activeTab === "semestres" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Semestres Académicos"
              description="Define los períodos universitarios y marca cuál es el semestre en curso para organizar las auxiliaturas."
              actionLabel="Nuevo Semestre"
              onAction={() => openSemesterModal()}
            />

            {semestersList.length === 0 ? (
              <AdminEmptyState
                icon={Calendar}
                title="Sin semestres registrados"
                description="Crea tu primer período académico (ej. II-2026) para asignarlo a tus materias."
                actionLabel="Registrar Semestre"
                onAction={() => openSemesterModal()}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {semestersList.map((sem) => {
                  const linkedAuxCount = auxiliariesList.filter((a) => a.semester_id === sem.id || a.semester?.code === sem.code).length;
                  return (
                    <div
                      key={sem.id}
                      className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                            {sem.code}
                          </span>
                          <button
                            onClick={() => toggleSemesterCurrent(sem)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono transition-colors ${
                              sem.is_current
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {sem.is_current ? "★ SEMESTRE ACTUAL" : "HISTÓRICO"}
                          </button>
                        </div>

                        <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                          {sem.name}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-teal-300/70 block mt-1">
                          {linkedAuxCount} grupo(s) de auxiliatura asociados
                        </span>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openSemesterModal(sem)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "sem", id: sem.id, title: sem.name })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 3: MATERIAS (CATÁLOGO MAESTRO FORMAL NORMALIZADO)   */}
        {/* =========================================================== */}
        {activeTab === "materias" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Catálogo de Materias"
              description="Registra cada asignatura una sola vez con su sigla oficial, categoría e imagen. No incluye grupos."
              actionLabel="Registrar Nueva Materia"
              onAction={() => openSubjectModal()}
            />

            {/* Barra de Búsqueda de Materias */}
            <div className="relative">
              <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar materia por nombre, sigla (INF-220) o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            {filteredSubjects.length === 0 ? (
              <AdminEmptyState
                icon={BookOpen}
                title="Sin materias registradas en el catálogo"
                description="Registra las asignaturas universitarias (ej. INF-220 Estructuras de Datos I) para poder asignarles grupos."
                actionLabel="Registrar Materia"
                onAction={() => openSubjectModal()}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((sub) => {
                  const linkedGroups = auxiliariesList.filter((a) => a.subject_id === sub.id || a.subject_code === sub.code);
                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
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
                                {sub.category && (
                                  <span
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                                    style={{
                                      backgroundColor: `${sub.category.color || "#0d9488"}20`,
                                      borderColor: `${sub.category.color || "#0d9488"}50`,
                                      color: sub.category.color || "#0d9488",
                                    }}
                                  >
                                    {sub.category.name}
                                  </span>
                                )}
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

                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-teal-900/40">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-teal-400/80 uppercase">
                            Grupos Asignados ({linkedGroups.length}):
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {linkedGroups.length === 0 ? (
                              <span className="text-[11px] text-slate-400 italic">Sin grupos activos</span>
                            ) : (
                              linkedGroups.map((g) => (
                                <span
                                  key={g.id}
                                  className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-teal-800 font-semibold"
                                >
                                  Grupo {g.group_code}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedAux(null);
                            setModalMode("create");
                            setActiveModalType("aux");
                          }}
                          className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Asignar Grupo</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openSubjectModal(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "sub", id: sub.id, title: `${sub.code} - ${sub.name}` })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 4: AUXILIATURAS (GRUPOS ASIGNADOS CON GOOGLE DRIVE)  */}
        {/* =========================================================== */}
        {activeTab === "auxiliaturas" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Gestión de Auxiliaturas (Grupos y Drive)"
              description="Asigna grupos a las materias del catálogo y administra sus carpetas oficiales de Google Drive."
              actionLabel="Asignar Nuevo Grupo"
              onAction={() => openAuxModal()}
            />

            {/* Filtros por Semestre & Buscador */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar auxiliatura por materia, código o grupo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={selectedSemesterFilter}
                onChange={(e) => setSelectedSemesterFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
              >
                <option value="all">Todos los Semestres ({auxiliariesList.length})</option>
                {semestersList.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.code} {sem.is_current ? "★ (Actual)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {filteredAuxiliaries.length === 0 ? (
              <AdminEmptyState
                icon={GraduationCap}
                title="Sin auxiliaturas registradas"
                description="Asigna un grupo universitario a una de tus materias y configura sus carpetas de Drive."
                actionLabel="Asignar Auxiliatura"
                onAction={() => openAuxModal()}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredAuxiliaries.map((aux) => {
                  const subName = aux.subject?.name || aux.subject_name || "Materia sin vincular";
                  const subCode = aux.subject?.code || aux.subject_code || "INF";
                  const imgUrl = aux.subject?.image_url || aux.image_url;
                  const semCode = aux.semester?.code || aux.semester_code || "II-2026";

                  return (
                    <div
                      key={aux.id}
                      className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar src={imgUrl} name={subName} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                                  {subCode}
                                </span>
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                                  Grupo {aux.group_code}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                  {semCode}
                                </span>
                              </div>
                              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                                {subName}
                              </h3>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleAuxiliaryActive(aux)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-colors ${
                              aux.is_active
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {aux.is_active ? "PÚBLICO" : "OCULTO"}
                          </button>
                        </div>

                        {aux.description && (
                          <p className="text-xs text-slate-600 dark:text-teal-100/70 line-clamp-2 mt-2 leading-relaxed">
                            {aux.description}
                          </p>
                        )}

                        {/* Enlaces de Google Drive */}
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-teal-900/40 space-y-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-teal-400/80 uppercase">
                            Carpetas en Google Drive ({aux.drive_links?.length || 0}):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {aux.drive_links?.map((link, lIdx) => (
                              <a
                                key={lIdx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-[11px] font-mono font-medium text-teal-800 dark:text-teal-300 hover:border-teal-500 transition"
                              >
                                <FolderOpen className="w-3 h-3 text-teal-500" />
                                <span className="truncate max-w-[150px]">{link.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAuxModal(aux)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "aux", id: aux.id, title: `${subName} (Grupo ${aux.group_code})` })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 5: CATEGORÍAS (ÁREAS DE IA Y ACADÉMICAS)            */}
        {/* =========================================================== */}
        {activeTab === "categorias" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Categorías Temáticas y Académicas"
              description="Define las áreas temáticas para clasificar tanto materias como recursos de inteligencia artificial."
              actionLabel="Nueva Categoría"
              onAction={() => openCategoryModal()}
            />

            {categoriesList.length === 0 ? (
              <AdminEmptyState
                icon={Layers}
                title="Sin categorías creadas"
                description="Crea tu primera categoría para organizar las materias y los recursos de IA."
                actionLabel="Nueva Categoría"
                onAction={() => openCategoryModal()}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesList.map((cat) => {
                  const linkedCount = recommendationsList.filter((r) => r.category_id === cat.id).length;
                  const linkedSubCount = subjectsList.filter((s) => s.category_id === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
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
                            {linkedCount} recursos • {linkedSubCount} materias
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

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openCategoryModal(cat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "cat", id: cat.id, title: cat.name })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 6: RECURSOS Y RECOMENDACIONES (CRUD COMPLETO)       */}
        {/* =========================================================== */}
        {activeTab === "recomendaciones" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Recursos & Recomendaciones de IA"
              description="Publica herramientas, repositorios, artículos y tutoriales seleccionados para el día a día."
              actionLabel="Publicar Nuevo Recurso"
              onAction={() => openRecommendationModal()}
            />

            {/* Filtros por Categoría & Buscador */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por título, descripción o etiqueta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-teal-500"
              >
                <option value="all">Todas las Categorías ({recommendationsList.length})</option>
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredRecommendations.length === 0 ? (
              <AdminEmptyState
                icon={Compass}
                title="Sin recursos que coincidan"
                description="Ajusta los filtros de búsqueda o publica un nuevo recurso de inteligencia artificial."
                actionLabel="Publicar Recurso"
                onAction={() => openRecommendationModal()}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRecommendations.map((rec) => {
                  const cat = categoriesList.find((c) => c.id === rec.category_id);
                  return (
                    <div
                      key={rec.id}
                      className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <InitialsAvatar src={rec.image_url} name={rec.title} size="md" />
                            <div>
                              <div className="flex items-center gap-2">
                                {cat && (
                                  <span
                                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border"
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
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>Destacado</span>
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                                {rec.title}
                              </h3>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleRecommendationFeatured(rec)}
                            title="Alternar destacado"
                            className={`p-1.5 rounded-xl border transition ${
                              rec.is_featured
                                ? "bg-amber-100 text-amber-600 border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800"
                                : "text-slate-400 border-slate-200 dark:border-teal-900 hover:text-amber-500"
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-teal-100/70 line-clamp-2 leading-relaxed">
                          {rec.description}
                        </p>

                        {/* Etiquetas */}
                        {rec.tags && rec.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {rec.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-teal-950 text-slate-600 dark:text-teal-300 border border-slate-300 dark:border-teal-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-between">
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-600 dark:text-teal-400 hover:underline truncate max-w-[200px]"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{rec.url}</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openRecommendationModal(rec)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "rec", id: rec.id, title: rec.title })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================== */}
        {/* PESTAÑA 7: REDES SOCIALES Y CONTACTO (CRUD COMPLETO)        */}
        {/* =========================================================== */}
        {activeTab === "redes" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AdminPageHeader
              title="Redes Sociales y Enlaces Oficiales"
              description="Administra los enlaces de contacto y perfiles profesionales mostrados en la sección Sobre Mí."
              actionLabel="Añadir Red Social"
              onAction={() => openSocialModal()}
            />

            {socialLinksList.length === 0 ? (
              <AdminEmptyState
                icon={Share2}
                title="Sin redes registradas"
                description="Añade enlaces a GitHub, LinkedIn, WhatsApp u otros canales oficiales."
                actionLabel="Añadir Red Social"
                onAction={() => openSocialModal()}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialLinksList.map((soc) => (
                  <div
                    key={soc.id}
                    className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar src={soc.image_url} name={soc.label} size="sm" />
                          <div>
                            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                              {soc.label}
                            </h3>
                            <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300">
                              icono: {soc.icon_name}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-teal-950 text-slate-500 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                          #{soc.display_order}
                        </span>
                      </div>

                      <a
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-teal-600 dark:text-teal-400 hover:underline truncate block"
                      >
                        {soc.url}
                      </a>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openSocialModal(soc)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "soc", id: soc.id, title: soc.label })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* MODALES CRUD MODULARES Y REUTILIZABLES                        */}
      {/* ------------------------------------------------------------- */}
      <SemesterModal
        isOpen={activeModalType === "sem"}
        mode={modalMode}
        initialData={selectedSem}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveSemester}
        nextOrder={semestersList.length + 1}
      />

      <SubjectModal
        isOpen={activeModalType === "sub"}
        mode={modalMode}
        initialData={selectedSub}
        categories={categoriesList}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveSubject}
        subjectNameTestId="admin-subject-name" /* data-testid="admin-subject-name" */
      />

      <AuxiliaryModal
        isOpen={activeModalType === "aux"}
        mode={modalMode}
        initialData={selectedAux}
        subjects={subjectsList}
        semesters={semestersList}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveAuxiliary}
        onOpenNewSubject={() => openSubjectModal()}
        subjectNameTestId="admin-subject-name" /* data-testid="admin-subject-name" */
        saveBtnTestId="admin-save-aux-btn" /* data-testid="admin-save-aux-btn" */
      />

      <CategoryModal
        isOpen={activeModalType === "cat"}
        mode={modalMode}
        initialData={selectedCat}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveCategory}
        nextOrder={categoriesList.length + 1}
      />

      <RecommendationModal
        isOpen={activeModalType === "rec"}
        mode={modalMode}
        initialData={selectedRec}
        categories={categoriesList}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveRecommendation}
        nextOrder={recommendationsList.length + 1}
      />

      <SocialModal
        isOpen={activeModalType === "soc"}
        mode={modalMode}
        initialData={selectedSoc}
        onClose={() => setActiveModalType(null)}
        onSave={handleSaveSocial}
        nextOrder={socialLinksList.length + 1}
      />

      {/* ------------------------------------------------------------- */}
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN                          */}
      {/* ------------------------------------------------------------- */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${deleteTarget?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, Eliminar Registro"
        cancelLabel="Cancelar"
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
