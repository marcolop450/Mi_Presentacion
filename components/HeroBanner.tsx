import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Compass, ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 md:py-16">
      {/* Fondo de resplandor sutil */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Oficial de KIRIS */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-blue-900/50 shadow-2xl bg-[#091222] mb-10 group">
          <div className="relative w-full h-44 sm:h-64 md:h-80 lg:h-96">
            <Image
              src="/images/banner_kiris.jpg"
              alt="KIRIS Banner Oficial - Innovación en Razonamiento e Inteligencia de Sistemas"
              fill
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
              priority
            />
            {/* Gradiente de overlay inferior para transición suave */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {/* Textos y Eslogan Principal */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>KIRIS • Inteligencia Artificial para el día a día</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            INNOVACIÓN EN RAZONAMIENTO E{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              INTELIGENCIA DE SISTEMAS
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Plataforma universitaria y centro de recursos de auxiliaturas de la UAGRM-FICCT, 
            material educativo en Google Drive y recomendaciones de IA curadas por Marco Alejandro Lopez.
          </p>

          {/* Botones de Acción Rápida */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#auxiliaturas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Ver Auxiliaturas Universitarias</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#recomendaciones"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-all"
            >
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Explorar Recomendaciones</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
