import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Compass, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Emblem Badge with Official Logo (Never cuts off) */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#071915] p-2.5 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo Oficial KIRIS"
                width={90}
                height={90}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-display font-black tracking-tight text-5xl sm:text-6xl md:text-7xl text-slate-900 dark:text-white leading-none">
          KIRIS
        </h1>

        {/* Official Slogan (Pure Typography - Never Crops or Blurs) */}
        <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-display font-bold text-teal-700 dark:text-teal-300 max-w-[36ch] leading-snug">
          <strong>I</strong>nnovación en <strong>R</strong>azonamiento e <br></br><strong>I</strong>nteligencia de <strong>S</strong>istemas
        </h2>
        

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-teal-100/80 leading-relaxed max-w-[62ch]">
          Plataforma académica y repositorio universitario de auxiliaturas, carpetas organizadas en Google Drive y recursos de programacion por <br></br><strong>Marco Alejandro Lopez Velasquez</strong>.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/auxiliaturas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-700/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Explorar Auxiliaturas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/recursos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm border border-slate-300 dark:border-teal-800/80 bg-white/90 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
          >
            <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Ver Recursos &amp; Mas</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
