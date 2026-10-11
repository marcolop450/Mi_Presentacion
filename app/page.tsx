import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import Link from "next/link";
import { GraduationCap, Compass, User, ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const sections = [
    {
      title: "Auxiliaturas Universitarias",
      description: "Carpetas oficiales en Google Drive organizadas por Sigla, Materia y Grupo para estudiantes de la FICCT - UAGRM.",
      href: "/auxiliaturas",
      icon: GraduationCap,
      badge: "FICCT • UAGRM",
      cta: "Entrar a Auxiliaturas",
    },
    {
      title: "Recursos & Inteligencia Artificial",
      description: "Herramientas web, canales de divulgación científica, librerías de software y recursos de IA curados para el día a día.",
      href: "/recursos",
      icon: Compass,
      badge: "Nexus IA",
      cta: "Explorar Recursos",
    },
    {
      title: "Sobre Mí & Contacto",
      description: "Perfil de ingeniería, enfoque en razonamiento de sistemas, stack tecnológico y enlaces de contacto directo de Marco Lopez.",
      href: "/sobre-mi",
      icon: User,
      badge: "Dossier",
      cta: "Ver Perfil",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060B14] flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner with Vector SVG */}
        <HeroBanner />

        {/* Portal Hub Navigation Cards */}
        <section className="py-14 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  Módulos de la Plataforma
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans">
                  Selecciona una sección para acceder al material clasificado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091224] hover:border-blue-500 dark:hover:border-sky-400 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {sec.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-sky-400">
                      <span>{sec.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
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
