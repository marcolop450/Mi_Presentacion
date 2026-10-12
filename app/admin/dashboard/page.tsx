"use client";

import { useState, useEffect, useMemo, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  defaultSocialLinks, 
  defaultCategories, 
  defaultRecommendations, 
  defaultAuxiliaries 
} from "@/lib/data/initialData";
import { 
  SocialLink, 
  Category, 
  Recommendation, 
  Auxiliary, 
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
  Calendar, 
  Home, 
  CheckCircle2, 
  FolderOpen, 
  Tag, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  Layers, 
  X, 
  Menu, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ConfirmModal from "@/components/ConfirmModal";
import InitialsAvatar from "@/components/InitialsAvatar";

type AdminTab = "resumen" | "auxiliaturas" | "categorias" | "recomendaciones" | "redes";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("resumen");
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("marcolop450@gmail.com");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados de datos
  const [auxiliariesList, setAuxiliariesList] = useState<Auxiliary[]>(defaultAuxiliaries);
  const [recommendationsList, setRecommendationsList] = useState<Recommendation[]>(defaultRecommendations);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [socialLinksList, setSocialLinksList] = useState<SocialLink[]>(defaultSocialLinks);

  // Búsquedas y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Modales de Creación y Edición
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeModalType, setActiveModalType] = useState<"aux" | "cat" | "rec" | "soc" | null>(null);

  // Formularios de Auxiliatura
  const [auxFormId, setAuxFormId] = useState<string | null>(null);
  const [auxSubjectName, setAuxSubjectName] = useState("");
  const [auxSubjectCode, setAuxSubjectCode] = useState("");
  const [auxGroupCode, setAuxGroupCode] = useState("");
  const [auxSemester, setAuxSemester] = useState("II-2026");
  const [auxImageUrl, setAuxImageUrl] = useState("");
  const [auxDescription, setAuxDescription] = useState("");
  const [auxDriveLinks, setAuxDriveLinks] = useState<DriveLinkItem[]>([
    { title: "Carpeta Principal de Drive", url: "", type: "general" }
  ]);

  // Formularios de Categoría
  const [catFormId, setCatFormId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catColor, setCatColor] = useState("#0d9488");
  const [catDisplayOrder, setCatDisplayOrder] = useState(1);

  // Formularios de Recomendación
  const [recFormId, setRecFormId] = useState<string | null>(null);
  const [recTitle, setRecTitle] = useState("");
  const [recCategoryId, setRecCategoryId] = useState("");
  const [recDescription, setRecDescription] = useState("");
  const [recUrl, setRecUrl] = useState("");
  const [recImageUrl, setRecImageUrl] = useState("");
  const [recTags, setRecTags] = useState("");
  const [recFeatured, setRecFeatured] = useState(false);
  const [recDisplayOrder, setRecDisplayOrder] = useState(1);

  // Formularios de Red Social
  const [socFormId, setSocFormId] = useState<string | null>(null);
  const [socLabel, setSocLabel] = useState("");
  const [socIcon, setSocIcon] = useState("github");
  const [socUrl, setSocUrl] = useState("");
  const [socImageUrl, setSocImageUrl] = useState("");
  const [socDisplayOrder, setSocDisplayOrder] = useState(1);
  const [recUrlError, setRecUrlError] = useState("");
  const [socialUrlError, setSocialUrlError] = useState("");

  // Modal de confirmación para eliminar
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "aux" | "cat" | "rec" | "soc";
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
      const [auxRes, catRes, recRes, socRes] = await Promise.all([
        supabase.from("auxiliaries").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("display_order", { ascending: true }),
        supabase.from("recommendations").select("*, category:categories(*)").order("created_at", { ascending: false }),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (auxRes.data) setAuxiliariesList(auxRes.data as Auxiliary[]);
      if (catRes.data) {
        setCategoriesList(catRes.data as Category[]);
        if (catRes.data.length > 0 && !recCategoryId) {
          setRecCategoryId(catRes.data[0].id);
        }
      }
      if (recRes.data) setRecommendationsList(recRes.data as Recommendation[]);
      if (socRes.data) setSocialLinksList(socRes.data as SocialLink[]);
    } catch (err) {
      console.error("Error al sincronizar datos:", err);
      showToast("Error de conexión al cargar datos.");
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
  // CRUD AUXILIATURAS
  // -------------------------------------------------------------
  const openAuxModal = (aux?: Auxiliary) => {
    if (aux) {
      setModalMode("edit");
      setAuxFormId(aux.id);
      setAuxSubjectName(aux.subject_name);
      setAuxSubjectCode(aux.subject_code);
      setAuxGroupCode(aux.group_code);
      setAuxSemester(aux.semester || "II-2026");
      setAuxImageUrl(aux.image_url || "");
      setAuxDescription(aux.description || "");
      setAuxDriveLinks(aux.drive_links?.length ? aux.drive_links : [{ title: "Carpeta Principal de Drive", url: "", type: "general" }]);
    } else {
      setModalMode("create");
      setAuxFormId(null);
      setAuxSubjectName("");
      setAuxSubjectCode("");
      setAuxGroupCode("");
      setAuxSemester("II-2026");
      setAuxImageUrl("");
      setAuxDescription("");
      setAuxDriveLinks([{ title: "Carpeta Principal de Drive", url: "", type: "general" }]);
    }
    setActiveModalType("aux");
  };

  const handleSaveAuxiliary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auxSubjectName.trim() || !auxSubjectCode.trim() || !auxGroupCode.trim()) {
      showToast("Completa los campos obligatorios (*)");
      return;
    }

    const payload = {
      subject_name: auxSubjectName.trim(),
      subject_code: auxSubjectCode.trim().toUpperCase(),
      group_code: auxGroupCode.trim().toUpperCase(),
      semester: auxSemester.trim(),
      image_url: auxImageUrl.trim() || null,
      description: auxDescription.trim() || null,
      drive_links: auxDriveLinks.filter((l) => l.title.trim() && l.url.trim()),
      is_active: true,
    };

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && auxFormId) {
        const { error } = await supabase.from("auxiliaries").update(payload).eq("id", auxFormId);
        if (error) {
          showToast("Error al actualizar la auxiliatura.");
          return;
        }
        showToast("Auxiliatura actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("auxiliaries").insert([payload]);
        if (error) {
          showToast("Error al guardar en Supabase.");
          return;
        }
        showToast("Nueva auxiliatura registrada.");
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
  // CRUD CATEGORÍAS (NEW)
  // -------------------------------------------------------------
  const openCategoryModal = (cat?: Category) => {
    if (cat) {
      setModalMode("edit");
      setCatFormId(cat.id);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDescription(cat.description || "");
      setCatColor(cat.color || "#0d9488");
      setCatDisplayOrder(cat.display_order ?? 1);
    } else {
      setModalMode("create");
      setCatFormId(null);
      setCatName("");
      setCatSlug("");
      setCatDescription("");
      setCatColor("#0d9488");
      setCatDisplayOrder(categoriesList.length + 1);
    }
    setActiveModalType("cat");
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      showToast("Ingresa el nombre de la categoría.");
      return;
    }

    const slug = catSlug.trim() || catName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const payload = {
      name: catName.trim(),
      slug,
      description: catDescription.trim() || null,
      color: catColor,
      display_order: Number(catDisplayOrder) || 1,
    };

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && catFormId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", catFormId);
        if (error) {
          showToast("Error al actualizar la categoría.");
          return;
        }
        showToast("Categoría actualizada exitosamente.");
      } else {
        const { error } = await supabase.from("categories").insert([payload]);
        if (error) {
          showToast("Error al guardar categoría en Supabase.");
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
    if (rec) {
      setModalMode("edit");
      setRecFormId(rec.id);
      setRecTitle(rec.title);
      setRecCategoryId(rec.category_id);
      setRecDescription(rec.description);
      setRecUrl(rec.url);
      setRecImageUrl(rec.image_url || "");
      setRecTags(rec.tags ? rec.tags.join(", ") : "");
      setRecFeatured(rec.is_featured);
      setRecDisplayOrder(rec.display_order ?? 1);
    } else {
      setModalMode("create");
      setRecFormId(null);
      setRecTitle("");
      setRecCategoryId(categoriesList[0]?.id || "");
      setRecDescription("");
      setRecUrl("");
      setRecImageUrl("");
      setRecTags("");
      setRecFeatured(false);
      setRecDisplayOrder(recommendationsList.length + 1);
    }
    setActiveModalType("rec");
  };

  const handleSaveRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecUrlError("");
    if (!recTitle.trim() || !recUrl.trim() || !recCategoryId) {
      showToast("Completa los campos obligatorios (*)");
      return;
    }

    if (!recUrl.trim().startsWith("http://") && !recUrl.trim().startsWith("https://")) {
      setRecUrlError("La URL debe comenzar con http:// o https://");
      showToast("Ingresa una URL válida con http:// o https://");
      return;
    }

    const payload = {
      title: recTitle.trim(),
      category_id: recCategoryId,
      description: recDescription.trim(),
      url: recUrl.trim(),
      image_url: recImageUrl.trim() || null,
      tags: recTags.split(",").map((t) => t.trim()).filter(Boolean),
      is_featured: recFeatured,
      display_order: Number(recDisplayOrder) || 1,
    };

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && recFormId) {
        const { error } = await supabase.from("recommendations").update(payload).eq("id", recFormId);
        if (error) {
          showToast("Error al actualizar recomendación.");
          return;
        }
        showToast("Recurso actualizado con éxito.");
      } else {
        const { error } = await supabase.from("recommendations").insert([payload]);
        if (error) {
          showToast("Error al guardar recurso.");
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
    if (soc) {
      setModalMode("edit");
      setSocFormId(soc.id);
      setSocLabel(soc.label);
      setSocIcon(soc.icon_name);
      setSocUrl(soc.url);
      setSocImageUrl(soc.image_url || "");
      setSocDisplayOrder(soc.display_order);
    } else {
      setModalMode("create");
      setSocFormId(null);
      setSocLabel("");
      setSocIcon("github");
      setSocUrl("");
      setSocImageUrl("");
      setSocDisplayOrder(socialLinksList.length + 1);
    }
    setActiveModalType("soc");
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    setSocialUrlError("");
    if (!socLabel.trim() || !socUrl.trim()) {
      showToast("Ingresa etiqueta y URL.");
      return;
    }

    if (!socUrl.trim().startsWith("http://") && !socUrl.trim().startsWith("https://")) {
      setSocialUrlError("La URL debe comenzar con http:// o https://");
      showToast("Ingresa una URL válida con http:// o https://");
      return;
    }

    const payload = {
      label: socLabel.trim(),
      icon_name: socIcon,
      url: socUrl.trim(),
      image_url: socImageUrl.trim() || null,
      display_order: Number(socDisplayOrder) || 1,
      is_active: true,
    };

    const supabase = createClient();
    if (supabase) {
      if (modalMode === "edit" && socFormId) {
        const { error } = await supabase.from("social_links").update(payload).eq("id", socFormId);
        if (error) {
          showToast("Error al actualizar enlace.");
          return;
        }
        showToast("Enlace social actualizado.");
      } else {
        const { error } = await supabase.from("social_links").insert([payload]);
        if (error) {
          showToast("Error al guardar enlace social.");
          return;
        }
        showToast("Nueva red social añadida.");
      }
      loadAllData(supabase);
    }

    setActiveModalType(null);
  };

  // -------------------------------------------------------------
  // ELIMINACIÓN CONFIRMADA
  // -------------------------------------------------------------
  const executeDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    const supabase = createClient();

    if (supabase) {
      const tableMap = {
        aux: "auxiliaries",
        cat: "categories",
        rec: "recommendations",
        soc: "social_links",
      };
      await supabase.from(tableMap[type]).delete().eq("id", id);
      loadAllData(supabase);
    }

    showToast("Registro eliminado correctamente.");
    setDeleteTarget(null);
  };

  // Filtros en memoria
  const filteredAuxiliaries = useMemo(() => {
    if (!searchQuery) return auxiliariesList;
    const q = searchQuery.toLowerCase();
    return auxiliariesList.filter(
      (a) =>
        a.subject_name.toLowerCase().includes(q) ||
        a.subject_code.toLowerCase().includes(q) ||
        a.group_code.toLowerCase().includes(q)
    );
  }, [auxiliariesList, searchQuery]);

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
          <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 flex items-center justify-center mb-4 animate-pulse">
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
      {/* SIDEBAR PARA ESCRITORIO (Y DRAWER EN MÓVIL)                   */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 shrink-0 z-50 md:z-10 bg-white/95 dark:bg-[#07191d]/95 border-r border-slate-300 dark:border-teal-800/60 flex flex-col justify-between p-5 backdrop-blur-xl transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Emblema */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-teal-900/60">
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
          <div className="mt-4 p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center gap-2.5">
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

          {/* Menú de Navegación Principal */}
          <nav className="mt-6 space-y-1.5" aria-label="Secciones del Administrador">
            {[
              { id: "resumen", label: "Resumen General", icon: Home, count: null },
              { id: "auxiliaturas", label: "Auxiliaturas", icon: GraduationCap, count: auxiliariesList.length },
              { id: "categorias", label: "Categorías de IA", icon: Layers, count: categoriesList.length },
              { id: "recomendaciones", label: "Recursos y Recomendaciones", icon: Compass, count: recommendationsList.length },
              { id: "redes", label: "Redes y Contacto", icon: Share2, count: socialLinksList.length },
            ].map((item) => {
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25 scale-[1.01]"
                      : "text-slate-700 dark:text-teal-200/80 hover:bg-slate-100 dark:hover:bg-teal-950/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
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
          </nav>
        </div>

        {/* Footer del Sidebar */}
        <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-teal-300/70">Tema</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-teal-200/80 hover:bg-slate-100 dark:hover:bg-teal-950/60 transition"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-teal-500" />
              <span>Ver Portal Público</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
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
                Ecosistema administrativo oficial de KIRIS. Administra tus materias, carpetas de Drive y herramientas curadas de IA.
              </p>
            </div>

            {/* Tarjetas de Métricas KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  label: "Auxiliaturas Activas",
                  count: auxiliariesList.filter((a) => a.is_active).length,
                  total: auxiliariesList.length,
                  tab: "auxiliaturas" as AdminTab,
                  icon: GraduationCap,
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  label: "Recursos de IA",
                  count: recommendationsList.length,
                  sub: `${recommendationsList.filter((r) => r.is_featured).length} destacados`,
                  tab: "recomendaciones" as AdminTab,
                  icon: Compass,
                  color: "from-teal-500 to-cyan-600",
                },
                {
                  label: "Categorías de IA",
                  count: categoriesList.length,
                  sub: "Orden dinámico",
                  tab: "categorias" as AdminTab,
                  icon: Layers,
                  color: "from-cyan-500 to-blue-600",
                },
                {
                  label: "Redes y Contacto",
                  count: socialLinksList.filter((s) => s.is_active).length,
                  total: socialLinksList.length,
                  tab: "redes" as AdminTab,
                  icon: Share2,
                  color: "from-blue-600 to-indigo-600",
                },
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(kpi.tab)}
                    className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-700/60 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-600 dark:text-teal-200/80">
                        {kpi.label}
                      </span>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
                        {kpi.count}
                      </div>
                      <div className="text-[11px] font-mono text-teal-700 dark:text-teal-300 mt-1 flex items-center gap-1 font-semibold">
                        <span>Gestionar sección</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Acciones Rápidas */}
            <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-700/60 shadow-xs">
              <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-3">
                Acciones Rápidas
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => openAuxModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Auxiliatura</span>
                </button>
                <button
                  onClick={() => openRecommendationModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Recurso de IA</span>
                </button>
                <button
                  onClick={() => openCategoryModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Categoría</span>
                </button>
                <button
                  onClick={() => openSocialModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Red Social</span>
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
        {/* PESTAÑA 2: AUXILIATURAS (CRUD COMPLETO - SIN HORARIOS)      */}
        {/* =========================================================== */}
        {activeTab === "auxiliaturas" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  Gestión de Auxiliaturas
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
                  Crea, edita y organiza las materias de auxiliatura con sus enlaces oficiales a Google Drive.
                </p>
              </div>
              <button
                onClick={() => openAuxModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Nueva Auxiliatura</span>
              </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre de materia, sigla o grupo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Listado de Auxiliaturas */}
            {filteredAuxiliaries.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-800/60 bg-white/80 dark:bg-[#07191d]/80">
                <GraduationCap className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sin auxiliaturas registradas</h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">Registra tu primera materia de auxiliatura con el botón superior.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredAuxiliaries.map((aux) => (
                  <div
                    key={aux.id}
                    className="p-5 rounded-3xl bg-white/90 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar src={aux.image_url} name={aux.subject_name} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border border-slate-300 dark:border-teal-800">
                                {aux.subject_code}
                              </span>
                              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                Grupo {aux.group_code}
                              </span>
                            </div>
                            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                              {aux.subject_name}
                            </h3>
                          </div>
                        </div>

                        {/* Switch Activo/Inactivo */}
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

                    {/* Botones de Acción (Editar y Eliminar) */}
                    <div className="mt-5 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openAuxModal(aux)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-slate-100 dark:hover:bg-teal-950 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "aux", id: aux.id, title: aux.subject_name })}
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

        {/* =========================================================== */}
        {/* PESTAÑA 3: CATEGORÍAS DE IA (CRUD COMPLETO)                 */}
        {/* =========================================================== */}
        {activeTab === "categorias" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  Categorías de Inteligencia Artificial
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
                  Define las categorías temáticas y su orden de despliegue en la plataforma pública de recursos.
                </p>
              </div>
              <button
                onClick={() => openCategoryModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Categoría</span>
              </button>
            </div>

            {/* Listado de Categorías */}
            {categoriesList.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-800/60 bg-white/80 dark:bg-[#07191d]/80">
                <Layers className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sin categorías creadas</h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">Crea tu primera categoría para organizar los recursos de IA.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoriesList.map((cat) => {
                  const linkedCount = recommendationsList.filter((r) => r.category_id === cat.id).length;
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
                            {linkedCount} recursos
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
        {/* PESTAÑA 4: RECURSOS Y RECOMENDACIONES (CRUD COMPLETO)       */}
        {/* =========================================================== */}
        {activeTab === "recomendaciones" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  Recursos &amp; Recomendaciones de IA
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
                  Publica herramientas, repositorios, artículos y tutoriales seleccionados para el día a día.
                </p>
              </div>
              <button
                onClick={() => openRecommendationModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Nuevo Recurso</span>
              </button>
            </div>

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

            {/* Listado de Recursos */}
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-800/60 bg-white/80 dark:bg-[#07191d]/80">
                <Compass className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sin recursos que coincidan</h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">Ajusta los filtros o publica un nuevo recurso.</p>
              </div>
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
        {/* PESTAÑA 5: REDES SOCIALES Y CONTACTO (CRUD COMPLETO)        */}
        {/* =========================================================== */}
        {activeTab === "redes" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                  Redes Sociales y Enlaces Oficiales
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-200/80 mt-1">
                  Administra los enlaces de contacto y perfiles profesionales mostrados en la sección Sobre Mí.
                </p>
              </div>
              <button
                onClick={() => openSocialModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Red Social</span>
              </button>
            </div>

            {/* Listado de Redes */}
            {socialLinksList.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-800/60 bg-white/80 dark:bg-[#07191d]/80">
                <Share2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sin redes registradas</h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-1">Añade enlaces a GitHub, LinkedIn, WhatsApp u otros canales.</p>
              </div>
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
      {/* MODAL CRUD: AUXILIATURA (Crear / Editar)                       */}
      {/* ------------------------------------------------------------- */}
      {activeModalType === "aux" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/60 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60 mb-5">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {modalMode === "edit" ? "Editar Auxiliatura" : "Nueva Auxiliatura"}
              </h3>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-teal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAuxiliary} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Nombre de la Materia *
                  </label>
                  <input
                    type="text"
                    required
                    data-testid="admin-subject-name"
                    placeholder="Ej. Estructuras de Datos I"
                    value={auxSubjectName}
                    onChange={(e) => setAuxSubjectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Sigla / Código *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="INF-220"
                    value={auxSubjectCode}
                    onChange={(e) => setAuxSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Grupo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SA o SB"
                    value={auxGroupCode}
                    onChange={(e) => setAuxGroupCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Semestre
                  </label>
                  <input
                    type="text"
                    value={auxSemester}
                    onChange={(e) => setAuxSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              {/* URL de Imagen con Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  URL de Imagen de Portada / Logo (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  <InitialsAvatar src={auxImageUrl} name={auxSubjectName || "Materia"} size="md" />
                  <input
                    type="url"
                    placeholder="https://... (Si está vacío, se usarán las iniciales automáticas)"
                    value={auxImageUrl}
                    onChange={(e) => setAuxImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Descripción o Indicaciones
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre el avance, materiales o avisos..."
                  value={auxDescription}
                  onChange={(e) => setAuxDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              {/* Enlaces de Google Drive Dinámicos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-teal-200">
                    Carpetas en Google Drive
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuxDriveLinks([...auxDriveLinks, { title: "", url: "", type: "general" }])}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir enlace</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {auxDriveLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Título (Ej. Prácticos)"
                        value={link.title}
                        onChange={(e) => {
                          const updated = [...auxDriveLinks];
                          updated[idx].title = e.target.value;
                          setAuxDriveLinks(updated);
                        }}
                        className="w-1/3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                      />
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...auxDriveLinks];
                          updated[idx].url = e.target.value;
                          setAuxDriveLinks(updated);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                      />
                      {auxDriveLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setAuxDriveLinks(auxDriveLinks.filter((_, i) => i !== idx))}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalType(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-teal-200 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  data-testid="admin-save-aux-btn"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25"
                >
                  {modalMode === "edit" ? "Guardar Cambios" : "Crear Auxiliatura"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL CRUD: CATEGORÍA (Crear / Editar)                         */}
      {/* ------------------------------------------------------------- */}
      {activeModalType === "cat" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/60 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60 mb-5">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {modalMode === "edit" ? "Editar Categoría" : "Nueva Categoría de IA"}
              </h3>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-teal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Visión por Computadora"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (modalMode === "create") {
                      setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Slug Identificador
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="vision-computadora"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={catDisplayOrder}
                    onChange={(e) => setCatDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Color Temático
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-teal-800"
                  />
                  <input
                    type="text"
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve reseña sobre los recursos incluidos..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalType(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-teal-200 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25"
                >
                  {modalMode === "edit" ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL CRUD: RECURSO / RECOMENDACIÓN (Crear / Editar)           */}
      {/* ------------------------------------------------------------- */}
      {activeModalType === "rec" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/60 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60 mb-5">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {modalMode === "edit" ? "Editar Recurso de IA" : "Nuevo Recurso de IA"}
              </h3>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-teal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecommendation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Título del Recurso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. PyTorch Documentation & Tutorials"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Categoría *
                  </label>
                  <select
                    required
                    value={recCategoryId}
                    onChange={(e) => setRecCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-semibold"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Orden de Despliegue
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={recDisplayOrder}
                    onChange={(e) => setRecDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  URL del Enlace Web *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={recUrl}
                  onChange={(e) => setRecUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                />
              </div>

              {/* URL de Imagen con Avatar de Iniciales de Respaldo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  URL de Imagen / Logo del Recurso (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  <InitialsAvatar src={recImageUrl} name={recTitle || "Recurso"} size="md" />
                  <input
                    type="url"
                    placeholder="https://... (Si está vacío, se usan las iniciales generativas)"
                    value={recImageUrl}
                    onChange={(e) => setRecImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Descripción del Recurso
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explicación concisa de su utilidad..."
                  value={recDescription}
                  onChange={(e) => setRecDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="Machine Learning, Python, Framework"
                  value={recTags}
                  onChange={(e) => setRecTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="recFeatured"
                  checked={recFeatured}
                  onChange={(e) => setRecFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="recFeatured" className="text-xs font-semibold text-slate-700 dark:text-teal-200 cursor-pointer">
                  Marcar como Recurso Destacado (Insignia especial en el portal)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalType(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-teal-200 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25"
                >
                  {modalMode === "edit" ? "Guardar Cambios" : "Publicar Recurso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL CRUD: RED SOCIAL (Crear / Editar)                        */}
      {/* ------------------------------------------------------------- */}
      {activeModalType === "soc" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#07191d] border border-slate-300 dark:border-teal-700/60 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-teal-900/60 mb-5">
              <h3 className="text-lg font-display font-black text-slate-900 dark:text-white">
                {modalMode === "edit" ? "Editar Red Social" : "Nueva Red Social"}
              </h3>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-teal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  Etiqueta / Nombre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="GitHub, LinkedIn, WhatsApp..."
                  value={socLabel}
                  onChange={(e) => setSocLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Tipo de Icono
                  </label>
                  <select
                    value={socIcon}
                    onChange={(e) => setSocIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs"
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="youtube">YouTube</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="facebook">Facebook</option>
                    <option value="mail">Correo / Mail</option>
                    <option value="globe">Sitio Web / Web</option>
                    <option value="aws">AWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={socDisplayOrder}
                    onChange={(e) => setSocDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  URL del Perfil o Canal *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={socUrl}
                  onChange={(e) => setSocUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-teal-200 mb-1">
                  URL de Imagen / Logo Personalizado (Opcional)
                </label>
                <div className="flex items-center gap-3">
                  <InitialsAvatar src={socImageUrl} name={socLabel || "Red"} size="sm" />
                  <input
                    type="url"
                    placeholder="https://... (Opcional)"
                    value={socImageUrl}
                    onChange={(e) => setSocImageUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-teal-900/60 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveModalType(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-teal-200 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25"
                >
                  {modalMode === "edit" ? "Guardar Cambios" : "Añadir Enlace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
