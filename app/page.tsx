import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import Link from "next/link";
import { GraduationCap, Compass, User, ArrowRight } from "lucide-react";

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
      description: "Perfil académico, enfoque en razonamiento de sistemas, stack tecnológico y enlaces de contacto directo de Marco Lopez.",
      href: "/sobre-mi",
      icon: User,
      badge: "Perfil",
      cta: "Ver Perfil",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner with Official Banner */}
        <HeroBanner />

        {/* Portal Hub Navigation Cards */}
        <section className="py-14 border-t border-teal-200/60 dark:border-teal-950/80">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                  Módulos de la Plataforma
                </h2>
                <p className="text-sm text-slate-600 dark:text-teal-200/70 mt-1 font-sans">
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
                    className="group flex flex-col justify-between p-7 sm:p-8 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white/80 dark:bg-[#0a2026]/80 hover:border-teal-400 dark:hover:border-teal-400 shadow-sm hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-300 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800/60 text-teal-700 dark:text-teal-300">
                          {sec.badge}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-3 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-7 pt-4 border-t border-teal-100 dark:border-teal-900/50 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-300">
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
