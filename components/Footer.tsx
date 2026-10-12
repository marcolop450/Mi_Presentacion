import Image from "next/image";
import Link from "next/link";
import { Sparkles, Trees } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full text-slate-600 dark:text-teal-200/70 pt-12 pb-8 mt-auto relative z-10 transition-colors duration-200 bg-gradient-to-t from-teal-900/20 via-transparent to-transparent dark:from-[#03100d]/40 dark:via-transparent border-t border-slate-200 dark:border-teal-400/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-teal-400/10">
          {/* Marca, Logo y Eslogan Oficial */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/60 p-1 flex items-center justify-center shadow-xs backdrop-blur-sm">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-slate-900 dark:text-white text-base tracking-tight">
                  KIRIS
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-teal-800/60">
                  <Trees className="w-2.5 h-2.5" />
                  <span>v2.8 FICCT</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 font-sans mt-0.5">
                Innovación en Razonamiento e Inteligencia de Sistemas
              </p>
            </div>
          </div>

          {/* Enlaces de Navegación Fluidos */}
          <nav className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold">
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">
              Inicio
            </Link>
            <Link href="/auxiliaturas" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">
              Auxiliaturas
            </Link>
            <Link href="/recursos" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">
              Recursos
            </Link>
            <Link href="/sobre-mi" className="hover:text-teal-600 dark:hover:text-teal-300 transition-colors">
              Sobre Mí
            </Link>
          </nav>
        </div>

        {/* Fila Inferior con Detalles Institucionales y Créditos */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-teal-300/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p>
              © {new Date().getFullYear()} KIRIS • Marco Alejandro Lopez Velasquez • UAGRM FICCT
            </p>
          </div>
          <p className="font-mono text-[11px] text-teal-700/80 dark:text-teal-300/80">
            Inteligencia Artificial para el día a día
          </p>
        </div>
      </div>
    </footer>
  );
}
