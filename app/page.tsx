import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  GraduationCap,
  Compass,
  User,
  ArrowRight,
  Cpu,
  CheckCircle2,
  FolderGit2,
} from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const sections = [
    {
      title: "Auxiliaturas Universitarias",
      badge: "FICCT - UAGRM",
      description: "Carpetas oficiales organizadas por materia y semestre curricular, con enlaces directos y visor integrado para laboratorios.",
      features: [
        "Clasificación de 1er a 10mo semestre",
        "Páginas dedicadas por asignatura",
        "Visor integrado de documentos y enlaces Drive",
      ],
      href: "/auxiliaturas",
      icon: GraduationCap,
      cta: "Explorar Auxiliaturas",
    },
    {
      title: "Recursos para el Desarrollo",
      badge: "CURADURÍA IA & DEV",
      description: "Herramientas web, canales de divulgación científica, librerías y documentación curada para estudiantes y programadores.",
      features: [
        "Herramientas y plataformas web",
        "Canales y material de autoaprendizaje",
        "Organización temática por áreas",
      ],
      href: "/recursos",
      icon: Compass,
      cta: "Ver Recursos",
    },
    {
      title: "Sobre Mí - Marco Alejandro",
      badge: "PERFIL ACADÉMICO",
      description: "Auxiliar de Cátedra y estudiante de Ingeniería Informática en la Universidad Autónoma Gabriel René Moreno (UAGRM).",
      features: [
        "Auxiliar docente universitario",
        "Enfoque en estructuras y algoritmos",
        "Desarrollo e inteligencia de sistemas",
      ],
      href: "/sobre-mi",
      icon: User,
      cta: "Conocer Más",
    },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "Razonamiento y Lógica",
      description: "Comprensión rigurosa de algoritmos, análisis asintótico y patrones de diseño de software.",
    },
    {
      icon: FolderGit2,
      title: "Acceso Universitario Abierto",
      description: "Materiales estructurados en la nube sin muros de pago, listos para consulta desde cualquier dispositivo o laboratorio.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroBanner />

        {/* Módulos de la Plataforma */}
        <section className="py-16 md:py-20 border-t border-slate-200 dark:border-teal-400/10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Módulos de la Plataforma
              </h2>
              <p className="text-sm text-slate-600 dark:text-teal-100/80 mt-2 font-sans max-w-[60ch] mx-auto">
                Acceso centralizado a las asignaturas universitarias, biblioteca de recursos y perfil institucional.
              </p>
            </div>

            {/* Cuadrícula de Módulos con Fondo Nítido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-white dark:hover:bg-[#0a2329] transition-all duration-300 backdrop-blur-xs shadow-xs hover:shadow-md hover:shadow-teal-500/10 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-teal-800/60">
                          {sec.badge}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/75 mt-2.5 leading-relaxed">
                        {sec.description}
                      </p>

                      <ul className="mt-5 space-y-2 pt-4 border-t border-slate-200 dark:border-teal-900/50">
                        {sec.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-teal-200/80">
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
        <section className="py-16 border-t border-slate-200 dark:border-teal-400/10">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Principios del Ecosistema KIRIS
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-teal-200/70 mt-1">
                Innovación fundamentada, accesibilidad libre y pensamiento computacional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 backdrop-blur-xs shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-2 leading-relaxed">
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
