import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & Actions (order-2 on mobile, order-1 on desktop) */}
          <div className="order-2 lg:order-1 flex flex-col items-start">
            <h1 className="font-display font-black tracking-tighter leading-tight lg:leading-none text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
              Innovación en Razonamiento e Inteligencia de Sistemas
            </h1>

            <p className="mt-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[65ch]">
              Repositorio universitario de auxiliaturas de la FICCT, material de estudio y recursos de inteligencia artificial orientados a ingeniería de sistemas.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="#auxiliaturas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Ver Auxiliaturas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#recomendaciones"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>Explorar Recursos</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image (order-1 on mobile, order-2 on desktop) */}
          <div className="order-1 lg:order-2 w-full">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
              <Image
                src="/images/banner_kiris.jpg"
                alt="KIRIS - Innovación en Razonamiento e Inteligencia de Sistemas"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
