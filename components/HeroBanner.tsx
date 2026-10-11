import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Compass, ArrowRight, Sparkles, Terminal, Cpu, Database } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-slate-200/80 dark:border-blue-950/60 font-mono text-[11px]">
          <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="font-semibold text-slate-800 dark:text-cyan-400">CORE: OPERATIONAL</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden sm:inline">SYS_ID: KIRIS-v2.6</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold">
              FICCT // UAGRM
            </span>
            <span className="hidden md:inline">SANTA CRUZ, BOLIVIA</span>
          </div>
        </div>

        {/* Headline & Slogan Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-950/50 border border-blue-200 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-mono font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: "8s" }} />
            <span>KIRIS • Inteligencia Artificial para el día a día</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
            INNOVACIÓN EN RAZONAMIENTO E{" "}
            <span className="relative inline-block text-blue-600 dark:text-cyan-400">
              INTELIGENCIA DE SISTEMAS
            </span>
          </h1>

          <p className="mt-6 text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Plataforma de ingeniería y repositorio universitario de auxiliaturas, 
            material en Google Drive y recursos de IA curados por{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">Marco Alejandro Lopez Velasquez</strong>.
          </p>

          {/* Action Deck */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#auxiliaturas"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-display font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <GraduationCap className="w-5 h-5 transition-transform group-hover:-rotate-12" />
              <span>Ver Auxiliaturas Universitarias</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#recomendaciones"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-mono text-xs font-semibold bg-white dark:bg-[#0B1528] hover:bg-slate-50 dark:hover:bg-blue-950/60 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-blue-900/60 hover:border-blue-400 dark:hover:border-cyan-500/50 transition-all shadow-sm"
            >
              <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>$ explorar-recursos</span>
            </Link>
          </div>
        </div>

        {/* Chassis del Banner Oficial con Soportes Holográficos */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-blue-900/60 shadow-2xl bg-slate-900/10 dark:bg-[#08101E] group">
          {/* Micro-esquinas HUD */}
          <div className="absolute top-3 left-3 z-20 font-mono text-[9px] text-cyan-400 tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30">
            [ KIRIS // FICHA DE IDENTIDAD ]
          </div>

          <div className="relative w-full h-48 sm:h-72 md:h-96 lg:h-[420px]">
            <Image
              src="/images/banner_kiris.jpg"
              alt="KIRIS Banner Oficial - Innovación en Razonamiento e Inteligencia de Sistemas"
              fill
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              priority
            />
            {/* Gradiente cinemático de transición */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent dark:from-[#040812] dark:via-transparent opacity-80" />
          </div>

          <div className="absolute bottom-3 right-3 z-20 hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
            <span>UAGRM FICCT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>BOLIVIA</span>
          </div>
        </div>

        {/* Telemetry Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="p-5 rounded-2xl cyber-glass border border-slate-200 dark:border-blue-950/60 transition hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                01 // Auxiliaturas
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Carpetas oficiales de Google Drive clasificadas por Sigla, Materia y Grupo para el estudiante de la FICCT.
            </p>
          </div>

          <div className="p-5 rounded-2xl cyber-glass border border-slate-200 dark:border-blue-950/60 transition hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                02 // Hub de Recursos
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Herramientas, canales de YouTube de alta divulgación científica y librerías modernas de IA aplicada.
            </p>
          </div>

          <div className="p-5 rounded-2xl cyber-glass border border-slate-200 dark:border-blue-950/60 transition hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Database className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                03 // Gestión Dinámica
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Panel administrativo privado con autenticación segura en Supabase para actualizar todo sin tocar código.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
