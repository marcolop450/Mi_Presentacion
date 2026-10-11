import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-teal-200/60 dark:border-teal-900/60 bg-white/80 dark:bg-[#061317]/80 text-slate-600 dark:text-teal-200/60 py-10 transition-colors duration-200 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 p-0.5 flex items-center justify-center shadow-sm">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-black text-slate-900 dark:text-white text-base tracking-tight">
                KIRIS
              </span>
              <p className="text-xs text-slate-500 dark:text-teal-200/70 font-sans">
                Innovación en Razonamiento e Inteligencia de Sistemas
              </p>
            </div>
          </div>

          {/* Clean Real Page Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Inicio
            </Link>
            <Link href="/auxiliaturas" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Auxiliaturas
            </Link>
            <Link href="/recursos" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Recursos
            </Link>
            <Link href="/sobre-mi" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Sobre Mí
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-teal-100 dark:border-teal-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-teal-300/50">
          <p>
            © {new Date().getFullYear()} KIRIS • Marco Alejandro Lopez Velasquez • UAGRM FICCT
          </p>
          <p className="text-teal-600 dark:text-teal-400 font-medium">
            Inteligencia Artificial para el día a día
          </p>
        </div>
      </div>
    </footer>
  );
}
