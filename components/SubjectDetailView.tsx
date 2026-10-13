"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DriveLinkItem, getSemesterLevelLabel } from "@/types/database";
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  Cloud,
  CheckCircle2,
  FolderOpen,
  Video,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Users,
  BookOpen,
  Search,
  Filter,
  Layers,
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";
import DrivePreviewModal from "@/components/DrivePreviewModal";

interface SubjectDetailViewProps {
  subjectName: string;
  subjectCode: string;
  semesterLevel: number;
  imageUrl?: string;
  description?: string;
  groups: {
    id: string;
    group_code: string;
    semester_code?: string;
    description?: string;
    drive_links: DriveLinkItem[];
  }[];
}

export default function SubjectDetailView({
  subjectName,
  subjectCode,
  semesterLevel,
  imageUrl,
  description,
  groups,
}: SubjectDetailViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string } | null>(null);

  // Estados de Filtros locales en la página de la materia
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const semesterLabel = getSemesterLevelLabel(semesterLevel);

  // Grupos disponibles
  const availableGroups = useMemo(() => {
    return Array.from(new Set(groups.map((g) => g.group_code))).sort();
  }, [groups]);

  // Filtrado reactivo de grupos y sus enlaces
  const filteredGroups = useMemo(() => {
    return groups
      .filter((grp) => {
        if (selectedGroup !== "all" && grp.group_code !== selectedGroup) {
          return false;
        }
        return true;
      })
      .map((grp) => {
        let links = grp.drive_links || [];

        // Filtro por tipo de enlace
        if (selectedType !== "all") {
          links = links.filter((l) => {
            const t = (l.type || "general").toLowerCase();
            if (selectedType === "video") return t === "clases" || t === "video";
            if (selectedType === "practicas") return t === "practicas" || t === "guias";
            return t === selectedType;
          });
        }

        // Filtro por buscador
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          links = links.filter(
            (l) =>
              l.title.toLowerCase().includes(q) ||
              (grp.description && grp.description.toLowerCase().includes(q))
          );
        }

        return {
          ...grp,
          drive_links: links,
        };
      })
      .filter((grp) => {
        // Si hay búsqueda o filtro de tipo activo, solo mostrar grupos que contengan enlaces coincidentes
        if (searchTerm.trim() || selectedType !== "all") {
          return grp.drive_links.length > 0;
        }
        return true;
      });
  }, [groups, selectedGroup, selectedType, searchTerm]);

  // Contar enlaces totales mostrados
  const totalShownLinks = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.drive_links.length, 0);
  }, [filteredGroups]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderLinkIcon = (type?: string) => {
    if (type === "clases" || type === "video")
      return <Video className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />;
    if (type === "practicas" || type === "guias")
      return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    return <FolderOpen className="w-4 h-4 text-teal-500 dark:text-teal-400 shrink-0" />;
  };

  return (
    <section className="pt-4 sm:pt-6 pb-10 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navegación y Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-teal-900/50">
          <Link
            href="/auxiliaturas"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-200 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a todas las materias</span>
          </Link>

          <nav aria-label="Miga de pan" className="text-xs text-slate-500 dark:text-teal-300/70 font-mono flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-teal-500 transition">Inicio</Link>
            <span>/</span>
            <Link href="/auxiliaturas" className="hover:text-teal-500 transition">Auxiliaturas</Link>
            <span>/</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">{subjectCode}</span>
          </nav>
        </div>

        {/* Ficha Principal de la Materia */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <InitialsAvatar src={imageUrl} name={subjectName} size="lg" />
            <div className="flex-1 min-w-0">
              {/* Badges de Semestre y Sigla */}
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-teal-100 text-teal-900 dark:bg-teal-950/90 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{semesterLabel}</span>
                </span>

                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700">
                  {subjectCode}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-teal-950/60 text-slate-700 dark:text-teal-300 border border-slate-200 dark:border-teal-900/60">
                  <Users className="w-3.5 h-3.5 text-teal-500" />
                  <span>{groups.length} {groups.length === 1 ? "grupo registrado" : "grupos registrados"}</span>
                </span>
              </div>

              {/* Título Oficial */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  {semesterLabel} /{" "}
                </span>
                {subjectName}
              </h1>

              {/* Descripción de la Materia (solo si existe a nivel materia) */}
              {description ? (
                <p className="text-sm text-slate-600 dark:text-teal-100/80 mt-3 leading-relaxed max-w-[75ch]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sección de Filtros Locales de la Materia */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs space-y-4 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-teal-900/40">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Filtros de Grupos y Materiales
              </span>
            </div>

            <span className="text-xs text-slate-500 dark:text-teal-300/70 font-mono">
              Mostrando {totalShownLinks} enlaces en {filteredGroups.length} grupos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Buscador de Enlaces y Materiales */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar material (ej. Grabaciones, Modelos, Bitwise, Libro)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            {/* Pills de Grupos */}
            <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedGroup("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                  selectedGroup === "all"
                    ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                    : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                }`}
              >
                Todos los grupos ({groups.length})
              </button>

              {availableGroups.map((grpCode) => (
                <button
                  key={grpCode}
                  type="button"
                  onClick={() => setSelectedGroup(grpCode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                    selectedGroup === grpCode
                      ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                      : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                  }`}
                >
                  Grupo {grpCode}
                </button>
              ))}
            </div>
          </div>

          {/* Botón de limpiar filtros si están activos */}
          {(searchTerm || selectedGroup !== "all" || selectedType !== "all") && (
            <div className="pt-2 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-teal-300/70">
                Filtros activos aplicados
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGroup("all");
                  setSelectedType("all");
                }}
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>

        {/* Sección de Grupos de Auxiliatura */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-500" />
              <span>Grupos de Auxiliatura y Carpetas de Google Drive</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-teal-300/70 font-mono">
              Acceso libre y visor en línea
            </span>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-900/60 text-center space-y-3 shadow-xs">
              <Layers className="w-8 h-8 text-teal-400 mx-auto" />
              <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                No se encontraron materiales con los filtros aplicados
              </h3>
              <p className="text-xs text-slate-500 dark:text-teal-200/70">
                Prueba buscando otro término o seleccionando &quot;Todos los grupos&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGroup("all");
                  setSelectedType("all");
                }}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="rounded-3xl p-6 bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs flex flex-col justify-between space-y-5"
                >
                  <div>
                    {/* Cabecera del Grupo */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-teal-900/50">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-teal-600 text-white shadow-2xs">
                          Grupo {grp.group_code}
                        </span>
                        {grp.semester_code && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-600 dark:text-teal-300/80 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-teal-950 border border-slate-200 dark:border-teal-900/60">
                            <Calendar className="w-3.5 h-3.5 text-teal-500" />
                            <span>{grp.semester_code}</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Drive Activo</span>
                      </span>
                    </div>

                    {/* Descripción EXCLUSIVA del grupo (ej: Materia encargada por el Ing. Campos) */}
                    {grp.description && (
                      <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-3 leading-relaxed">
                        {grp.description}
                      </p>
                    )}

                    {/* Lista de Carpetas y Enlaces */}
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-teal-300/60 flex items-center gap-1.5 mb-2">
                        <Cloud className="w-3 h-3 text-teal-500" />
                        <span>Carpetas Oficiales de Google Drive ({grp.drive_links.length})</span>
                      </span>

                      {grp.drive_links && grp.drive_links.length > 0 ? (
                        grp.drive_links.map((link, idx) => {
                          const linkKey = `${grp.id}-${idx}`;
                          const isCopied = copiedId === linkKey;

                          return (
                            <div
                              key={idx}
                              className="p-3 rounded-2xl bg-slate-50/90 dark:bg-teal-950/40 hover:bg-slate-100/90 dark:hover:bg-teal-900/50 border border-slate-200 dark:border-teal-900/60 transition group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                {renderLinkIcon(link.type)}
                                <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                                  {link.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                                {/* Botón Vista Previa en KIRIS (Lectura sin cuenta Google en laboratorio) */}
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc({ title: link.title, url: link.url })}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-100/80 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 text-[11px] font-bold transition cursor-pointer"
                                  title="Ver documento aquí mismo sin necesidad de cuenta de Google Drive"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Ver aquí</span>
                                </button>

                                {/* Botón Copiar Enlace */}
                                <button
                                  type="button"
                                  onClick={() => handleCopy(link.url, linkKey)}
                                  className="p-1.5 rounded-xl text-slate-600 dark:text-teal-300 hover:bg-slate-200 dark:hover:bg-teal-800/60 transition cursor-pointer"
                                  title="Copiar enlace"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>

                                {/* Botón Abrir en Google Drive */}
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-xl text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-teal-800/60 transition"
                                  title="Abrir en pestaña nueva de Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 rounded-2xl bg-slate-50/50 dark:bg-teal-950/20 text-center text-xs text-slate-400 dark:text-teal-300/50 border border-dashed border-slate-300 dark:border-teal-900/60">
                          Carpetas y material en preparación
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visor Embebido de Documentos para PCs de Laboratorio - Arrastrable */}
      {previewDoc && (
        <DrivePreviewModal
          isOpen={Boolean(previewDoc)}
          title={previewDoc.title}
          url={previewDoc.url}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </section>
  );
}
