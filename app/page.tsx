import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  GraduationCap,
  Compass,
  User,
  ArrowRight,
  Database,
  Cloud,
  Cpu,
  BookOpen,
  Sparkles,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const telemetryStats = [
    {
      value: "100%",
      label: "Acceso Libre y Gratuito",
      detail: "Google Drive oficial sin muros",
      icon: Cloud,
    },
    {
      value: "FICCT",
      label: "Comunidad Universitaria",
      detail: "Sistemas, Redes e Informática",
      icon: GraduationCap,
    },
    {
      value: "24/7",
      label: "Disponibilidad Cloud",
      detail: "Materiales y guías siempre en línea",
      icon: Database,
    },
    {
      value: "IA & Dev",
      label: "Curaduría Especializada",
      detail: "Herramientas verificadas para el día a día",
      icon: Cpu,
    },
  ];

  const sections = [
    {
      title: "Auxiliaturas Universitarias",
      badge: "DRIVE NEXUS",
      description: "Carpetas oficiales en Google Drive organizadas por Sigla, Materia y Grupo para estudiantes de la FICCT - UAGRM.",
      features: ["Carpetas oficiales de Drive", "Horarios y códigos de aula", "Enlace directo sin publicidad"],
      href: "/auxiliaturas",
      icon: GraduationCap,
      cta: "Explorar Auxiliaturas",
    },
    {
      title: "Recursos & Inteligencia Artificial",
      badge: "HUB CURADO",
      description: "Herramientas web, canales de divulgación científica, librerías de software y recursos de IA curados para el día a día.",
      features: ["Frameworks y librerías modernas", "Canales de YouTube recomendados", "Filtro dinámico por categoría"],
      href: "/recursos",
      icon: Compass,
      cta: "Ver Recursos",
    },
    {
      title: "Sobre Mí & Contacto",
      badge: "DOSSIER",
      description: "Perfil académico, enfoque en razonamiento de sistemas, stack tecnológico y canales de contacto directo de Marco Lopez.",
      features: ["Trayectoria y roles en la FICCT", "Stack tecnológico completo", "Canales de contacto verificados"],
      href: "/sobre-mi",
      icon: User,
      cta: "Conocer Más",
    },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "Razonamiento de Sistemas",
      description: "Comprensión profunda de estructuras algorítmicas, arquitectura de código limpio y resolución lógica.",
    },
    {
      icon: FolderGit2,
      title: "Material Centralizado",
      description: "Acceso transparente y estructurado a los apuntes, guías y soluciones de auxiliaturas en Google Drive.",
    },
    {
      icon: Sparkles,
      title: "Inteligencia Artificial Práctica",
      description: "Herramientas de última generación seleccionadas para multiplicar la productividad en el estudio e investigación.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroBanner />

        {/* Telemetría y Métricas Académicas */}
        <section className="py-6 border-y border-teal-500/10 dark:border-teal-400/10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {telemetryStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-800/40 backdrop-blur-xs flex flex-col items-center text-center"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-100/60 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-display font-black text-xl sm:text-2xl text-teal-800 dark:text-teal-200 tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                      {stat.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-teal-200/60 mt-0.5">
                      {stat.detail}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Módulos de la Plataforma - Abierto y Fluido con Detalles Enriquecidos */}
        <section className="py-16 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>ECOSISTEMA KIRIS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Módulos de la Plataforma
              </h2>
              <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 font-sans max-w-[60ch] mx-auto">
                Acceso directo a las áreas de trabajo, bibliotecas cloud y dossier institucional.
              </p>
            </div>

            {/* Cuadrícula Abierta con Detalles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-white/80 dark:hover:bg-teal-950/40 transition-all duration-300 backdrop-blur-xs shadow-xs hover:shadow-md hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100/70 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-teal-100/50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                          {sec.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/70 mt-2.5 leading-relaxed">
                        {sec.description}
                      </p>

                      {/* Lista de características micro-detalladas */}
                      <ul className="mt-5 space-y-1.5 pt-4 border-t border-teal-200/40 dark:border-teal-900/40">
                        {sec.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-teal-200/70">
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-3 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-300 group-hover:text-teal-600 dark:group-hover:text-teal-200">
                      <span>{sec.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pilares Fundamentales de KIRIS */}
        <section className="py-16 border-t border-teal-500/10 dark:border-teal-400/10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Principios del Ecosistema KIRIS
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-teal-200/70 mt-1">
                Innovación fundamentada en rigor técnico, accesibilidad libre y pensamiento computacional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white/30 dark:bg-teal-950/15 border border-teal-200/40 dark:border-teal-800/30 backdrop-blur-xs"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100/60 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-teal-200/70 mt-1.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
