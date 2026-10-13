"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Compass,
  Share2,
  LogOut,
  Home,
  ExternalLink,
  Layers,
  X,
  Menu,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  Calendar,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";
import { AdminAudioProvider } from "@/components/admin/AdminAudioContext";
import AdminAudioPlayer from "@/components/admin/AdminAudioPlayer";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isVerifyingAuth,
    adminEmail,
    handleLogout,
    notification,
    semestersList,
    subjectsList,
    auxiliariesList,
    categoriesList,
    recommendationsList,
    socialLinksList,
    isLoading,
  } = useAdmin();

  // Bloqueo de scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
  interface SidebarNavItem {
    id: string;
    href: string;
    label: string;
    icon: any;
    count: number | null;
    testId?: string;
  }

  interface SidebarNavGroup {
    groupTitle: string;
    items: SidebarNavItem[];
  }

  const sidebarNavGroups: SidebarNavGroup[] = [
    {
      groupTitle: "PANEL PRINCIPAL",
      items: [
        {
          id: "resumen",
          href: "/admin/dashboard",
          label: "Resumen General",
          icon: Home,
          count: null,
          testId: "admin-tab-resumen",
        },
      ],
    },
    {
      groupTitle: "GESTIÓN ACADÉMICA (FICCT)",
      items: [
        {
          id: "semestres",
          href: "/admin/dashboard/semestres",
          label: "Semestres",
          icon: Calendar,
          count: semestersList.length,
        },
        {
          id: "materias",
          href: "/admin/dashboard/materias",
          label: "Catálogo de Materias",
          icon: BookOpen,
          count: subjectsList.length,
        },
        {
          id: "auxiliaturas",
          href: "/admin/dashboard/auxiliaturas",
          label: "Auxiliaturas (Grupos)",
          icon: GraduationCap,
          count: auxiliariesList.length,
        },
      ],
    },
    {
      groupTitle: "ECOSISTEMA DE RECURSOS & IA",
      items: [
        {
          id: "categorias",
          href: "/admin/dashboard/categorias",
          label: "Categorías",
          icon: Layers,
          count: categoriesList.length,
        },
        {
          id: "recomendaciones",
          href: "/admin/dashboard/recomendaciones",
          label: "Recursos y Recomendaciones",
          icon: Compass,
          count: recommendationsList.length,
        },
      ],
    },
    {
      groupTitle: "CONTACTO & PRESENCIA",
      items: [
        {
          id: "redes",
          href: "/admin/dashboard/redes",
          label: "Redes y Canales",
          icon: Share2,
          count: socialLinksList.length,
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

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

      {/* Backdrop oscuro para móviles */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR JERÁRQUICO (ORDEN ADMINISTRADOR DE NEGOCIO)            */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-dvh md:h-screen w-72 shrink-0 z-50 md:z-10 bg-white/95 dark:bg-[#07191d]/95 border-r border-slate-300 dark:border-teal-800/60 flex flex-col p-4 sm:p-5 backdrop-blur-xl transition-transform duration-300 ease-out overflow-y-auto overscroll-contain pb-12 md:pb-5 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Encabezado del Logo */}
        <div className="shrink-0 pb-3 border-b border-slate-200 dark:border-teal-900/60 flex items-center justify-between">
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
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Insignia de Administrador Autenticado */}
        <div className="shrink-0 mt-3 p-2.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center gap-2.5">
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
          {isLoading ? (
            <span title="Sincronizando datos con Supabase..." className="shrink-0 flex items-center">
              <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
            </span>
          ) : (
            <span title="Conexión segura activa" className="shrink-0 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </span>
          )}
        </div>

        {/* Menú de Navegación Organizado por Jerarquía - CON SCROLL INDEPENDIENTE PARA PANTALLAS CORTAS */}
        <nav
          className="flex-1 min-h-0 overflow-y-auto my-3 pr-1 -mr-1 space-y-3.5"
          aria-label="Secciones del Administrador"
        >
          {sidebarNavGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 dark:text-teal-400/80 px-3 uppercase block mb-1">
                {group.groupTitle}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    data-testid={item.testId}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                      active
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                        : "text-slate-600 dark:text-teal-100 hover:bg-slate-100 dark:hover:bg-teal-950/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? "text-white" : "text-teal-600 dark:text-teal-400"}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          active
                            ? "bg-teal-700/80 text-white"
                            : "bg-slate-200/80 dark:bg-teal-900/60 text-slate-700 dark:text-teal-300"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Reproductor de Audio Oficial KIRIS */}
        <AdminAudioPlayer />

        {/* Footer del Sidebar con Utilidades y Cerrar Sesión */}
        <div className="shrink-0 pt-3 border-t border-slate-200 dark:border-teal-900/60 space-y-2 pb-6 md:pb-0">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs text-slate-500 dark:text-teal-300 font-medium">Tema Visual</span>
            <ThemeToggle />
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/60 transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-teal-500" />
              <span>Ver Portal Público</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* CONTENIDO PRINCIPAL                                           */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full relative">
        {children}
      </main>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminAudioProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminAudioProvider>
    </AdminProvider>
  );
}
