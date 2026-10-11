"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/auxiliaturas", label: "Auxiliaturas" },
  { href: "/recursos", label: "Recursos" },
  { href: "/sobre-mi", label: "Sobre Mí" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#061317]/85 border-b border-teal-200/60 dark:border-teal-900/60 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Identity with original logo_kiris.png */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-teal-200 dark:border-teal-800/80 bg-white dark:bg-teal-950/60 flex items-center justify-center p-0.5 group-hover:border-teal-400 transition shadow-sm">
            <Image
              src="/images/logo_kiris.png"
              alt="Logo KIRIS"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            KIRIS
          </span>
        </Link>

        {/* Desktop Real Page Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-teal-600 dark:text-teal-400 font-bold border-b-2 border-teal-600 dark:border-teal-400"
                    : "text-slate-600 dark:text-teal-100/70 hover:text-teal-700 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle (Right side, admin button removed for privacy) */}
        <div className="hidden md:flex items-center">
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/60 transition"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-teal-200 dark:border-teal-900/60 bg-white/95 dark:bg-[#061317]/95 backdrop-blur-lg px-4 py-4 space-y-2 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800"
                    : "text-slate-700 dark:text-teal-100/80 hover:bg-teal-50 dark:hover:bg-teal-900/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
