"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Shield, ExternalLink, GraduationCap, Compass, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#060B14]/85 border-b border-blue-950/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo e Identidad */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-blue-500/40 bg-blue-950/40 flex items-center justify-center p-1 group-hover:border-blue-400 transition">
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
            <span className="font-black text-lg tracking-wider text-white group-hover:text-blue-400 transition flex items-center gap-1.5">
              KIRIS
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                IA
              </span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono hidden sm:inline -mt-0.5">
              UAGRM • FICCT
            </span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-blue-400 transition flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Inicio
          </Link>
          <Link href="#auxiliaturas" className="hover:text-blue-400 transition flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            Auxiliaturas
          </Link>
          <Link href="#recomendaciones" className="hover:text-blue-400 transition flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            Recomendaciones
          </Link>
          <Link href="#sobre-mi" className="hover:text-blue-400 transition">
            Sobre Mí
          </Link>
        </nav>

        {/* Botón Admin */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 hover:border-blue-500/50 transition shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            Admin
          </Link>
        </div>

        {/* Botón Mobile Menu */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1528] border-b border-blue-900/40 px-4 pt-2 pb-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-blue-900/30"
          >
            Inicio
          </Link>
          <Link
            href="#auxiliaturas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-blue-900/30"
          >
            Auxiliaturas Universitarias
          </Link>
          <Link
            href="#recomendaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-blue-900/30"
          >
            Recomendaciones & Recursos
          </Link>
          <Link
            href="#sobre-mi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-blue-900/30"
          >
            Sobre Mí (Marco Lopez)
          </Link>
          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white"
            >
              <Shield className="w-4 h-4" />
              Acceso Administrador
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
