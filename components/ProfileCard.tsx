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
  ChevronRight
} from "lucide-react";

interface ProfileCardProps {
  socialLinks: SocialLink[];
}

export default function ProfileCard({ socialLinks }: ProfileCardProps) {
  const [showTerminal, setShowTerminal] = useState(false);

  // Helper para renderizar iconos según el icon_name
  const renderIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes("github")) return <Github className="w-4 h-4" />;
    if (name.includes("mail") || name.includes("correo")) return <Mail className="w-4 h-4" />;
    if (name.includes("whatsapp")) return <Phone className="w-4 h-4" />;
    if (name.includes("aws") || name.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <section id="sobre-mi" className="py-12 border-t border-blue-950/60 bg-[#070D18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
              Perfil Académico & Profesional
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Acerca de Mí • Marco Lopez
            </h2>
          </div>

          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 transition"
          >
            <Terminal className="w-4 h-4" />
            <span>{showTerminal ? "Ocultar Terminal" : "Ver Terminal ASCII"}</span>
          </button>
        </div>

        {/* Vista Alternativa de Terminal ASCII (Inspirada en su GitHub) */}
        {showTerminal && (
          <div className="mb-8 rounded-2xl bg-[#040811] border border-cyan-500/40 p-5 font-mono text-xs shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-2 text-cyan-400">marcolop450@github:~ (README.md)</span>
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
              <div className="lg:col-span-6 space-y-1 text-slate-300 text-xs">
                <p><span className="text-cyan-400 font-bold">OS:</span> Santa Cruz, Bolivia</p>
                <p><span className="text-cyan-400 font-bold">Role:</span> Software Engineering & AI Student</p>
                <p><span className="text-cyan-400 font-bold">Studies:</span> Informatics Engineering - UAGRM FICCT</p>
                <p><span className="text-cyan-400 font-bold">Stack:</span> Java, C++, C#, Python, Delphi, Next.js</p>
                <p><span className="text-cyan-400 font-bold">Interests:</span> Mobile Apps, Clean Code, Inteligencia Artificial</p>
                <p><span className="text-cyan-400 font-bold">Email:</span> marcolop450@gmail.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta Principal de Perfil */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B1528] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Avatar e Imagotipo */}
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-blue-600 via-cyan-400 to-blue-500 shadow-xl shadow-blue-500/20 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                <Image
                  src="/images/logo_kiris.png"
                  alt="Marco Alejandro Lopez Velasquez (KIRIS)"
                  fill
                  className="object-cover p-2"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">Marco Alejandro Lopez Velasquez</h3>
            <p className="text-xs font-semibold text-blue-400 mt-0.5">KIRIS • UAGRM - FICCT</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Santa Cruz, Bolivia</span>
            </div>
          </div>

          {/* Detalles del Perfil */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-2">
                Biografía & Enfoque
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Estudiante de Ingeniería Informática en la Universidad Autónoma Gabriel René Moreno (UAGRM - FICCT). 
                Creador de la iniciativa <strong className="text-white">KIRIS</strong> (*Innovación en Razonamiento e Inteligencia de Sistemas*), 
                enfocada en desarrollar soluciones de Inteligencia Artificial para el día a día, organizar material académico de auxiliaturas 
                y compartir recursos de programación limpia y eficiente.
              </p>
            </div>

            {/* Competencias y Tecnologías */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Stack de Tecnologías</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Java", "C++", "C#", "Python", "Delphi", "Next.js", "Supabase"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[#0F1E38] text-slate-300 text-xs border border-blue-900/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>Áreas de Interés</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Inteligencia Artificial", "Clean Code", "Mobile Apps", "Arquitectura"].map((area) => (
                    <span
                      key={area}
                      className="px-2 py-0.5 rounded-md bg-[#0F1E38] text-slate-300 text-xs border border-blue-900/30"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Botonera Dinámica de Redes Sociales (Editables sin tocar código) */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Conectar & Perfiles Profesionales
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks
                  .filter((item) => item.is_active)
                  .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-blue-950/80 text-slate-200 hover:text-white border border-slate-800 hover:border-blue-500/50 transition-all hover:scale-[1.03] shadow-sm"
                    >
                      {renderIcon(link.icon_name)}
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
