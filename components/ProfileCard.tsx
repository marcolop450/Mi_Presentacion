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
  ExternalLink,
  GraduationCap,
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

        

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          Marco Alejandro Lopez Velasquez
        </h1>

        <p className="mt-2 text-base sm:text-lg font-medium text-teal-700 dark:text-teal-300">
          Estudiante de Ingeniería Informática y Auxiliar de Catedra
        </p>

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

        {/* Enlaces de Contacto y Redes Sociales */}
        <div className="w-full mt-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300 mb-4">
            Canales de Contacto Directo
          </h2>

          {activeLinks.length === 0 ? (
            <p className="text-xs font-mono text-slate-400 italic">
              Por el momento no hay enlaces de contacto.
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
