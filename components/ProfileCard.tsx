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
    <section id="sobre-mi" className="py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-12">
          Sobre Mí
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Columna Izquierda: Identidad y Avatar */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <Image
                src="/images/github_profile.png"
                alt="Marco Alejandro Lopez Velasquez"
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                Marco Alejandro Lopez
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-sky-400 mt-1">
                Estudiante de Ingeniería Informática & Creador de KIRIS
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Santa Cruz de la Sierra, Bolivia</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Biografía, Tecnologías y Conexiones */}
          <div className="lg:col-span-8 space-y-8">
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[65ch]">
              Estudiante de Ingeniería Informática en la UAGRM (FICCT) y fundador de KIRIS.
              Me enfoco en el desarrollo de software estructurado con altos estándares de ingeniería,
              creación de herramientas prácticas asistidas por inteligencia artificial y el soporte
              académico a través de auxiliaturas universitarias.
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Stack Tecnológico
                </h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  Áreas de Interés
                </h4>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area) => (
                    <span
                      key={area}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100/60 text-slate-600 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {activeLinks.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Enlaces y Contacto
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {activeLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-600 dark:hover:border-sky-400 hover:text-blue-600 dark:hover:text-sky-400 transition shadow-sm"
                    >
                      {renderIcon(link.icon_name)}
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
