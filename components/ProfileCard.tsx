"use client";

import { useState } from "react";
import Image from "next/image";
import { SocialLink } from "@/types/database";
import {
  Github,
  Mail,
  Phone,
  Cloud,
  Globe,
  MapPin,
  ExternalLink,
  GraduationCap,
  Code2,
  Sparkles,
  Copy,
  Check,
  Award,
  Terminal,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface ProfileCardProps {
  socialLinks: SocialLink[];
}

export default function ProfileCard({ socialLinks }: ProfileCardProps) {
  const [copiedMail, setCopiedMail] = useState(false);

  const renderIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes("github")) return <Github className="w-4 h-4" />;
    if (name.includes("mail") || name.includes("correo")) return <Mail className="w-4 h-4" />;
    if (name.includes("whatsapp")) return <Phone className="w-4 h-4" />;
    if (name.includes("aws") || name.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const handleCopyEmail = () => {
    // Buscar correo en redes o usar por defecto
    const emailLink = socialLinks.find(
      (l) => l.url.startsWith("mailto:") || l.label.toLowerCase().includes("correo") || l.label.toLowerCase().includes("mail")
    );
    const emailText = emailLink ? emailLink.url.replace("mailto:", "") : "contacto.kiris@uagrm.edu.bo";
    navigator.clipboard.writeText(emailText);
    setCopiedMail(true);
    setTimeout(() => setCopiedMail(false), 2000);
  };

  const activeLinks = socialLinks.filter((item) => item.is_active);

  const categorizedStack = [
    {
      category: "Lenguajes",
      items: ["Python", "C++", "Java", "C#", "Delphi", "TypeScript"],
    },
    {
      category: "Desarrollo Web & Cloud",
      items: ["Next.js", "React", "Node.js", "Tailwind CSS", "Supabase", "Git"],
    },
    {
      category: "Áreas de Razonamiento",
      items: ["Estructuras de Datos", "Inteligencia Artificial", "Clean Architecture", "Algoritmia"],
    },
  ];

  const milestones = [
    {
      role: "Fundador de la Plataforma KIRIS",
      desc: "Diseño y despliegue del ecosistema para centralizar auxiliaturas y recursos de IA en la FICCT.",
      status: "Activo",
    },
    {
      role: "Auxiliar de Cátedra Universitaria",
      desc: "Acompañamiento pedagógico y preparación de guías prácticas para asignaturas troncales.",
      status: "FICCT - UAGRM",
    },
    {
      role: "Investigación en Inteligencia de Sistemas",
      desc: "Exploración de modelos de lenguaje, automatización de flujos y razonamiento computacional.",
      status: "En desarrollo",
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Avatar Central con Emblema KIRIS y Estado */}
        <div className="relative mb-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-teal-400 via-emerald-500 to-cyan-500 shadow-xl shadow-teal-500/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#07171c] p-2.5 flex items-center justify-center">
              <Image
                src="/images/logo_kiris.png"
                alt="Marco Alejandro Lopez Velasquez - KIRIS"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
          </div>
          {/* Indicador de Disponibilidad */}
          <span
            className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-400 border-3 border-white dark:border-[#061317] shadow-sm animate-pulse"
            title="Disponible"
          />
        </div>

        {/* Nombre y Títulos */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-slate-300 dark:border-teal-800 mb-2 shadow-xs">
          <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>ESTUDIANTE &amp; AUXILIAR FICCT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          Marco Alejandro Lopez
        </h1>

        <p className="mt-2 text-base sm:text-lg font-medium text-teal-700 dark:text-teal-300">
          Estudiante de Ingeniería Informática &amp; Creador de KIRIS
        </p>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-slate-500 dark:text-teal-200/70">
          <MapPin className="w-3.5 h-3.5 text-teal-500" />
          <span>Santa Cruz de la Sierra, Bolivia • UAGRM - FICCT</span>
        </div>

        {/* Botón Rápido Copiar Correo */}
        <div className="mt-4">
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-slate-300 dark:border-teal-800/80 transition shadow-xs"
          >
            {copiedMail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>¡Correo copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-teal-500" />
                <span>Copiar correo de contacto</span>
                <Copy className="w-3 h-3 text-slate-400" />
              </>
            )}
          </button>
        </div>

        {/* Métricas y Datos Destacados */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-6">
          <div className="p-3.5 rounded-2xl border border-slate-300 dark:border-teal-800/60 bg-white/85 dark:bg-teal-950/40 backdrop-blur-xs shadow-xs">
            <span className="block font-mono text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">
              FICCT
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              UAGRM
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-300 dark:border-teal-800/60 bg-white/85 dark:bg-teal-950/40 backdrop-blur-xs shadow-xs">
            <span className="block font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
              KIRIS
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Fundador
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-300 dark:border-teal-800/60 bg-white/85 dark:bg-teal-950/40 backdrop-blur-xs shadow-xs">
            <span className="block font-mono text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">
              DRIVE
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Auxiliaturas
            </span>
          </div>
        </div>

        {/* Ficha de Presentación */}
        <div className="w-full mt-7 p-6 sm:p-8 rounded-3xl border border-slate-300 dark:border-teal-900/60 bg-white/85 dark:bg-[#081e19]/80 backdrop-blur-xs shadow-xs text-left">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Perfil Académico &amp; Visión</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">EXPEDIENTE 2026</span>
          </div>
          <p className="text-sm sm:text-base text-slate-700 dark:text-teal-100/90 leading-relaxed font-sans">
            Estudiante de Ingeniería Informática en la Universidad Autónoma Gabriel René Moreno (UAGRM - FICCT). Creador de <strong>KIRIS</strong> (<em>Innovación en Razonamiento e Inteligencia de Sistemas</em>), con el compromiso de estructurar material pedagógico de auxiliaturas clasificado en Google Drive y acercar herramientas de última generación en IA para potenciar a la comunidad universitaria.
          </p>
        </div>

        {/* Trayectoria y Roles */}
        <div className="w-full mt-6 p-6 rounded-3xl border border-slate-300 dark:border-teal-900/60 bg-white/85 dark:bg-[#081e19]/80 backdrop-blur-xs shadow-xs text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-500" />
            <span>Trayectoria e Iniciativas Clave</span>
          </h2>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-teal-950/50 border border-slate-200 dark:border-teal-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.role}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-teal-200/70 mt-0.5">
                    {m.desc}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-teal-900/70 text-teal-800 dark:text-teal-200 shrink-0 self-start sm:self-center font-bold border border-slate-200 dark:border-transparent">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack Tecnológico Organizado */}
        <div className="w-full mt-6 p-6 rounded-3xl border border-slate-300 dark:border-teal-900/60 bg-white/85 dark:bg-[#081e19]/80 backdrop-blur-xs shadow-xs text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-teal-500" />
            <span>Habilidades &amp; Stack Tecnológico</span>
          </h2>
          <div className="space-y-3">
            {categorizedStack.map((group, idx) => (
              <div key={idx}>
                <span className="text-[11px] font-mono text-slate-400 dark:text-teal-400 block mb-1.5 font-semibold">
                  {group.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-teal-950/70 border border-slate-300 dark:border-teal-800/60 text-slate-800 dark:text-teal-200 text-xs font-mono font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enlaces de Contacto y Redes Sociales */}
        <div className="w-full mt-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4">
            Canales de Contacto Directo
          </h2>

          {activeLinks.length === 0 ? (
            <p className="text-xs font-mono text-slate-400 italic">
              Enlaces configurables desde el panel de control de Supabase.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-mono font-semibold bg-white hover:bg-slate-50 dark:bg-teal-950/70 dark:hover:bg-teal-900/60 text-slate-800 dark:text-teal-200 border border-slate-300 dark:border-teal-800/80 hover:border-slate-400 transition-all hover:scale-[1.02] shadow-xs backdrop-blur-xs"
                >
                  {renderIcon(link.icon_name)}
                  <span>{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-500" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
