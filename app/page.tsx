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
      cta: "Explorar Auxiliaturas",
    },
    {
      title: "Recursos & Inteligencia Artificial",
      description: "Herramientas web, canales de divulgación científica, librerías de software y recursos de IA curados para el día a día.",
      href: "/recursos",
      icon: Compass,
      cta: "Ver Recursos",
    },
    {
      title: "Sobre Mí & Contacto",
      description: "Perfil académico, enfoque en razonamiento de sistemas, stack tecnológico y enlaces de contacto directo de Marco Lopez.",
      href: "/sobre-mi",
      icon: User,
      cta: "Conocer Más",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Official Logo and Slogan */}
        <HeroBanner />

        {/* Módulos de la Plataforma - Diseño Abierto y Fluido (Sin cuadrados ni badges artificiales) */}
        <section className="py-16 border-t border-teal-200/40 dark:border-teal-950/60">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Módulos de la Plataforma
              </h2>
              <p className="text-sm text-slate-500 dark:text-teal-200/70 mt-2 font-sans">
                Acceso directo al contenido universitario y herramientas especializadas.
              </p>
            </div>

            {/* Fila abierta sin cajas pesadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <Link
                    key={sec.href}
                    href={sec.href}
                    className="group flex flex-col justify-between p-4 rounded-2xl hover:bg-teal-50/50 dark:hover:bg-teal-950/30 transition-all duration-300"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-teal-100/70 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2.5 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-200">
                      <span>{sec.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
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
