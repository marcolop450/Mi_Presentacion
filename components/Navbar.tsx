"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo_kiris.png"
            alt="Logo KIRIS"
            width={32}
            height={32}
            className="object-contain"
            priority
          />
          <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            KIRIS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="#auxiliaturas"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
          >
            Auxiliaturas
          </Link>
          <Link
            href="#recomendaciones"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="#sobre-mi"
            className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-sky-400 hover:underline underline-offset-4 transition-colors"
          >
            Sobre Mí
          </Link>
        </nav>

        {/* Desktop Theme Toggle */}
        <div className="hidden md:flex items-center">
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 space-y-1 text-sm font-medium">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="#auxiliaturas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Auxiliaturas
          </Link>
          <Link
            href="#recomendaciones"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="#sobre-mi"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Sobre Mí
          </Link>
        </div>
      )}
    </header>
  );
}
