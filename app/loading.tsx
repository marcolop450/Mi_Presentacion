import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center backdrop-blur-md bg-slate-900/40 dark:bg-black/65 p-4 animate-in fade-in duration-200">
      <div className="relative w-[88%] max-w-sm p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/95 border border-slate-300 dark:border-teal-700/60 shadow-2xl shadow-teal-950/25 text-center flex flex-col items-center backdrop-blur-xl">
        {/* Emblema KIRIS sobrio y limpio */}
        <div className="relative mb-5">
          <div className="w-18 h-18 rounded-3xl p-1 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-400 shadow-xl shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[20px] bg-white dark:bg-[#071915] p-2.5 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Logo KIRIS"
                width={52}
                height={52}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          Cargando sección
        </h3>

        <p className="text-xs text-slate-600 dark:text-teal-200/80 mt-1 font-sans">
          Sincronizando el ecosistema KIRIS...
        </p>

        {/* ÚNICA barra de carga suave e indeterminada */}
        <div className="w-full bg-slate-200/80 dark:bg-teal-950/80 rounded-full h-1.5 mt-5 overflow-hidden border border-slate-300/80 dark:border-teal-800/80">
          <div className="bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 h-full rounded-full w-2/3 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
