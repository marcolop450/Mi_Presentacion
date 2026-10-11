import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Compass, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Links */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FICCT // UAGRM • SANTA CRUZ</span>
            </div>

            <h1 className="font-display font-black tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              Innovación en Razonamiento e{" "}
              <span className="text-teal-600 dark:text-teal-400">
                Inteligencia de Sistemas
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-teal-100/80 leading-relaxed max-w-[60ch]">
              Plataforma universitaria y repositorio oficial de auxiliaturas de la FICCT, material en Google Drive y recursos seleccionados de inteligencia artificial por <strong>Marco Alejandro Lopez Velasquez</strong>.
            </p>

            {/* Quick Action Navigation Buttons in Tropical Teal/Mint */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/auxiliaturas"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Ver Auxiliaturas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/recursos"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border border-teal-200 dark:border-teal-800/80 bg-white/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Explorar Recursos</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Original Official JPG Banner */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-teal-200/80 dark:border-teal-900/60 shadow-xl bg-slate-950 group">
              <Image
                src="/images/banner_kiris.jpg"
                alt="KIRIS Banner Oficial - Innovación en Razonamiento e Inteligencia de Sistemas"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              />
              {/* Subtle ambient edge gradient */}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
