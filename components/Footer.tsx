import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#060b14]/80 text-slate-600 dark:text-slate-400 py-10 transition-colors duration-200 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5 flex items-center justify-center shadow-sm">
              <Image
                src="/images/logo_kiris.svg"
                alt="Logo KIRIS"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-black text-slate-900 dark:text-white text-base tracking-tight">
                KIRIS
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Innovación en Razonamiento e Inteligencia de Sistemas
              </p>
            </div>
          </div>

          {/* Clean Real Page Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-sky-400 transition">
              Inicio
            </Link>
            <Link href="/auxiliaturas" className="hover:text-blue-600 dark:hover:text-sky-400 transition">
              Auxiliaturas
            </Link>
            <Link href="/recursos" className="hover:text-blue-600 dark:hover:text-sky-400 transition">
              Recursos
            </Link>
            <Link href="/sobre-mi" className="hover:text-blue-600 dark:hover:text-sky-400 transition">
              Sobre Mí
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} KIRIS • Marco Alejandro Lopez Velasquez • UAGRM FICCT
          </p>
          <p className="text-slate-400 dark:text-slate-500">
            Inteligencia Artificial para el día a día
          </p>
        </div>
      </div>
    </footer>
  );
}
