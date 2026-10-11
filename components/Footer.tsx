import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-8 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo_kiris.png"
              alt="Logo KIRIS"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-display font-bold text-slate-900 dark:text-white text-base tracking-tight">
              KIRIS
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Marco Alejandro Lopez Velasquez. UAGRM - FICCT.
            </p>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="#auxiliaturas"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
            >
              Auxiliaturas
            </Link>
            <Link
              href="#recomendaciones"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
            >
              Recursos
            </Link>
            <Link
              href="#sobre-mi"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
            >
              Sobre Mí
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
