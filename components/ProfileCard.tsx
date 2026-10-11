"use client";

import Image from "next/image";
import { useState } from "react";
import { SocialLink } from "@/types/database";
import { 
  Github, 
  Mail, 
  Phone, 
  Cloud, 
  Globe, 
  Terminal, 
  MapPin, 
  BookOpen, 
  Code2, 
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface ProfileCardProps {
  socialLinks: SocialLink[];
}

export default function ProfileCard({ socialLinks }: ProfileCardProps) {
  const [showTerminal, setShowTerminal] = useState(false);

  const renderIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes("github")) return <Github className="w-4 h-4" />;
    if (name.includes("mail") || name.includes("correo")) return <Mail className="w-4 h-4" />;
    if (name.includes("whatsapp")) return <Phone className="w-4 h-4" />;
    if (name.includes("aws") || name.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const activeLinks = socialLinks.filter((item) => item.is_active);

  return (
    <section id="sobre-mi" className="py-20 relative border-t border-slate-200/80 dark:border-blue-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-blue-950/60">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>EXPEDIENTE TÉCNICO // DOSSIER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Marco Alejandro Lopez Velasquez
            </h2>
          </div>

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono bg-white dark:bg-[#0B1528] border border-slate-300 dark:border-blue-900/60 hover:border-cyan-500 text-slate-800 dark:text-cyan-400 transition shadow-sm"
          >
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span>{showTerminal ? "$ cerrar-terminal" : "$ abrir-consola-ascii"}</span>
          </button>
        </div>

        {/* Consola Terminal CRT (Inspirada en su perfil de GitHub) */}
        {showTerminal && (
          <div className="mb-10 rounded-3xl bg-[#030611] border border-cyan-500/40 p-6 font-mono text-xs shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-cyan-400 font-semibold">marcolop450@kiris-core:~ (README.md)</span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">TTY: /dev/pts/1</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 text-cyan-400 select-none text-[10px] sm:text-[11px] leading-tight overflow-x-auto">
<pre className="p-2">
{`   ██╗  ██╗██╗██████╗ ██╗███████╗
   ██║ ██╔╝██║██╔══██╗██║██╔════╝
   █████╔╝ ██║██████╔╝██║███████╗
   ██╔═██╗ ██║██╔══██╗██║╚════██║
   ██║  ██╗██║██║  ██║██║███████║
   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝╚══════╝`}
</pre>
              </div>
              <div className="lg:col-span-6 space-y-1.5 text-slate-300 text-xs">
                <p><span className="text-cyan-400 font-bold">ENTORNO:</span> Santa Cruz de la Sierra, Bolivia</p>
                <p><span className="text-cyan-400 font-bold">ROL:</span> Creador de KIRIS • Estudiante de Ingeniería Informática</p>
                <p><span className="text-cyan-400 font-bold">FACULTAD:</span> UAGRM - FICCT</p>
                <p><span className="text-cyan-400 font-bold">STACK:</span> Java, C++, C#, Python, Delphi, Next.js, Supabase</p>
                <p><span className="text-cyan-400 font-bold">ENFOQUE:</span> Razonamiento e Inteligencia de Sistemas, Clean Code</p>
                <p><span className="text-cyan-400 font-bold">EMAIL:</span> marcolop450@gmail.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta Principal de Perfil */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cyber-glass rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-blue-900/40">
          {/* Avatar e Imagotipo Oficial */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20 mb-5">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-950 relative">
                <Image
                  src="/images/logo_kiris.png"
                  alt="Marco Alejandro Lopez Velasquez (KIRIS)"
                  fill
                  className="object-cover p-3"
                />
              </div>
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white">
              Marco Alejandro Lopez
            </h3>
            <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 font-mono text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              <span>KIRIS • FICCT UAGRM</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 mt-2.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Santa Cruz, Bolivia</span>
            </div>
          </div>

          {/* Detalles del Perfil & Biografía */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold mb-2">
                // SÍNTESIS PROFESIONAL & INVESTIGACIÓN
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
                Estudiante de Ingeniería Informática en la Universidad Autónoma Gabriel René Moreno (UAGRM - FICCT). 
                Fundador de la iniciativa <strong className="text-slate-900 dark:text-white font-semibold">KIRIS</strong> (*Innovación en Razonamiento e Inteligencia de Sistemas*), 
                creada para democratizar soluciones de Inteligencia Artificial para el día a día, estructurar material de auxiliaturas 
                y compartir herramientas de software con estándares de ingeniería de alto impacto.
              </p>
            </div>

            {/* Competencias y Tecnologías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                  <Code2 className="w-4 h-4 text-cyan-500" />
                  <span>STACK TECNOLÓGICO</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Java", "C++", "C#", "Python", "Delphi", "Next.js", "Supabase"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 text-xs font-mono dark:border-blue-900/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-white mb-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>ÁREAS DE ENFOQUE</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Inteligencia Artificial", "Clean Code", "Mobile Apps", "Arquitectura"].map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-950 dark:text-slate-300 text-xs font-mono dark:border-blue-900/40"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Botonera Dinámica de Redes Sociales */}
            <div>
              <h4 className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                [ CONEXIONES & PERFILES PROFESIONALES ]
              </h4>
              {activeLinks.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 italic">
                  // Enlaces configurables desde el panel de administración
                </p>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {activeLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-mono font-semibold bg-white hover:bg-cyan-50 dark:bg-slate-900 dark:hover:bg-blue-950/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 transition-all hover:scale-[1.02] shadow-sm"
                    >
                      {renderIcon(link.icon_name)}
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-cyan-500 ml-0.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
