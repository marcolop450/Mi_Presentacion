import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/40 dark:bg-black/65 p-4 animate-in fade-in duration-200">
      <div className="relative w-[90%] max-w-sm p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl shadow-teal-950/30 text-center flex flex-col items-center backdrop-blur-xl">
        {/* Emblema KIRIS */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 flex items-center justify-center animate-pulse">
            <div className="w-full h-full rounded-[22px] bg-white dark:bg-[#071915] p-2 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-teal-400/40 border-t-transparent animate-spin" />
        </div>

        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Cargando sección</span>
          <Loader2 className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-spin" />
        </h3>

        <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1.5 font-sans">
          Sincronizando el ecosistema KIRIS...
        </p>
      </div>
    </div>
  );
}
