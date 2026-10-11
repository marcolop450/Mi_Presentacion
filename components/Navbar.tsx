"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Shield, GraduationCap, Compass, Sparkles, Terminal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#040812]/80 border-b border-slate-200/80 dark:border-blue-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo e Identidad */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/40 flex items-center justify-center p-1 group-hover:border-cyan-400 transition shadow-sm">
            <Image
              src="/images/logo_kiris.png"
              alt="Logo KIRIS"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-wider text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition flex items-center gap-2">
              KIRIS
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
                IA
              </span>
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline -mt-0.5">
              UAGRM // FICCT
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Inicio</span>
          </Link>
          <Link href="#auxiliaturas" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-500" />
            <span>Auxiliaturas</span>
          </Link>
          <Link href="#recomendaciones" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-500" />
            <span>Recursos</span>
          </Link>
          <Link href="#sobre-mi" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Sobre Mí</span>
          </Link>
        </nav>

        {/* Botón Admin y Selector de Tema */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 text-white dark:bg-cyan-500/10 dark:text-cyan-300 dark:border dark:border-cyan-500/30 hover:bg-slate-800 dark:hover:bg-cyan-500/20 transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span>ADMIN</span>
          </Link>
        </div>

        {/* Botón Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden cyber-glass border-b border-slate-200 dark:border-blue-900/40 px-4 pt-3 pb-6 space-y-3 font-mono text-xs">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/30"
          >
            &gt; Inicio
          </Link>
          <Link
            href="#auxiliaturas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/30"
          >
            &gt; Auxiliaturas Universitarias
          </Link>
          <Link
            href="#recomendaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/30"
          >
            &gt; Recursos & Recomendaciones
          </Link>
          <Link
            href="#sobre-mi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/30"
          >
            &gt; Sobre Mí (Marco Lopez)
          </Link>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold bg-cyan-600 text-white shadow-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Acceso Administrador</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
