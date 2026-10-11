import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Compass, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Links (order-2 on mobile, order-1 on desktop) */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-sky-300 text-xs font-mono font-semibold mb-4">
              <span>FICCT // UAGRM • SANTA CRUZ</span>
            </div>

            <h1 className="font-display font-black tracking-tight leading-[1.08] text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              Innovación en Razonamiento e{" "}
              <span className="text-blue-600 dark:text-sky-400">
                Inteligencia de Sistemas
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-[60ch]">
              Plataforma académica y repositorio universitario de auxiliaturas, carpetas en Google Drive y recursos de inteligencia artificial curados por <strong>Marco Alejandro Lopez Velasquez</strong>.
            </p>

            {/* Quick Action Navigation Buttons to dedicated pages */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/auxiliaturas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Ver Auxiliaturas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/recursos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Compass className="w-4 h-4" />
                <span>Explorar Recursos</span>
              </Link>
            </div>
          </div>

          {/* Right Column: High-Fidelity Responsive Vector Banner (order-1 on mobile, order-2 on desktop) */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
              <Image
                src="/images/banner_kiris.svg"
                alt="KIRIS Banner Oficial - Innovación en Razonamiento e Inteligencia de Sistemas"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain sm:object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
