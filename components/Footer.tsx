import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-blue-950/80 bg-slate-100 dark:bg-[#040810] text-slate-600 dark:text-slate-400 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo y Eslogan */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-600/40 p-1 flex items-center justify-center shadow-sm">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-black text-slate-900 dark:text-white text-base tracking-wider">KIRIS</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Innovación en Razonamiento e Inteligencia de Sistemas
              </p>
            </div>
          </div>

          {/* Enlaces de Pie de Página */}
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="#auxiliaturas" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Auxiliaturas Universitarias
            </Link>
            <Link href="#recomendaciones" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Recomendaciones
            </Link>
            <Link href="#sobre-mi" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Sobre Mí
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} KIRIS • Creado por{" "}
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Marco Alejandro Lopez Velasquez</span> (UAGRM - FICCT).
          </p>
          <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            Inteligencia Artificial para el día a día
          </p>
        </div>
      </div>
    </footer>
  );
}
