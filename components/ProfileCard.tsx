"use client";

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
} from "lucide-react";

interface ProfileCardProps {
  socialLinks: SocialLink[];
}

export default function ProfileCard({ socialLinks }: ProfileCardProps) {
  const renderIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    if (name.includes("github")) return <Github className="w-4 h-4" />;
    if (name.includes("mail") || name.includes("correo")) return <Mail className="w-4 h-4" />;
    if (name.includes("whatsapp")) return <Phone className="w-4 h-4" />;
    if (name.includes("aws") || name.includes("cloud")) return <Cloud className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const activeLinks = socialLinks.filter((item) => item.is_active);

  const techStack = [
    "Java",
    "C++",
    "C#",
    "Python",
    "Delphi",
    "Next.js",
    "Supabase",
  ];

  const focusAreas = [
    "Inteligencia Artificial",
    "Clean Code",
    "Arquitectura de Software",
    "Desarrollo Móvil",
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Centered Circular Avatar with Status Indicator */}
        <div className="relative mb-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-teal-400 via-emerald-500 to-cyan-500 shadow-xl shadow-teal-500/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#07171c] p-2 flex items-center justify-center">
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
          {/* Active Status Badge */}
          <span
            className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-400 border-3 border-white dark:border-[#061317] shadow-sm animate-pulse"
            title="Activo"
          />
        </div>

        {/* Identity & Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          Marco Alejandro Lopez
        </h1>

        <p className="mt-2 text-base sm:text-lg font-medium text-teal-600 dark:text-teal-400">
          Estudiante de Ingeniería Informática &amp; Creador de KIRIS
        </p>

        <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-slate-500 dark:text-teal-200/70">
          <MapPin className="w-3.5 h-3.5 text-teal-500" />
          <span>Santa Cruz de la Sierra, Bolivia • UAGRM - FICCT</span>
        </div>

        {/* Highlight Metrics / Stat Badges */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mt-7">
          <div className="p-3.5 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 bg-white/80 dark:bg-teal-950/40 backdrop-blur-sm shadow-sm">
            <span className="block font-mono text-sm sm:text-base font-bold text-teal-700 dark:text-teal-300">
              FICCT
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              UAGRM
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 bg-white/80 dark:bg-teal-950/40 backdrop-blur-sm shadow-sm">
            <span className="block font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
              KIRIS
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Fundador
            </span>
          </div>

          <div className="p-3.5 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 bg-white/80 dark:bg-teal-950/40 backdrop-blur-sm shadow-sm">
            <span className="block font-mono text-sm sm:text-base font-bold text-cyan-600 dark:text-cyan-400">
              DRIVE
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Auxiliaturas
            </span>
          </div>
        </div>

        {/* Authentic Presentation Card */}
        <div className="w-full mt-7 p-6 sm:p-8 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/90 backdrop-blur-md shadow-sm text-left">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>Perfil Académico &amp; Iniciativa</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-teal-100/90 leading-relaxed font-sans">
            Estudiante de Ingeniería Informática en la Universidad Autónoma Gabriel René Moreno (UAGRM - FICCT). Fundador de la plataforma <strong>KIRIS</strong> (<em>Innovación en Razonamiento e Inteligencia de Sistemas</em>), orientada a estructurar material académico clasificado en Google Drive para auxiliaturas universitarias y compartir herramientas prácticas de ingeniería asistidas por inteligencia artificial.
          </p>
        </div>

        {/* Stack Tecnológico */}
        <div className="w-full mt-6 p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/90 backdrop-blur-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4 flex items-center justify-center gap-2">
            <Code2 className="w-4 h-4 text-teal-500" />
            <span>Stack Tecnológico</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-800/60 text-teal-800 dark:text-teal-200 text-xs font-mono font-semibold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Áreas de Interés */}
        <div className="w-full mt-6 p-6 rounded-3xl border border-teal-200/80 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/90 backdrop-blur-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Áreas de Interés</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Enlaces de Redes Sociales Centrados */}
        <div className="w-full mt-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-400/80 mb-4">
            Conexiones &amp; Contacto
          </h2>

          {activeLinks.length === 0 ? (
            <p className="text-xs font-mono text-slate-400 italic">
              Enlaces configurables desde el panel de control.
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-3">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-mono font-semibold bg-white hover:bg-teal-50 dark:bg-teal-950/70 dark:hover:bg-teal-900/60 text-slate-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800/80 hover:border-teal-400 transition-all hover:scale-[1.03] shadow-sm"
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
