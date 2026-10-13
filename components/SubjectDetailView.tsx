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
  Users,
  BookOpen,
  Search,
  Filter,
  Layers,
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";

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

  // Estados de Filtros locales en la página de la materia
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const semesterLabel = getSemesterLevelLabel(semesterLevel);

  // Grupos disponibles únicos
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
              (grp.description && grp.description.toLowerCase().includes(q)) ||
              (grp.semester_code && grp.semester_code.toLowerCase().includes(q))
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

  // Agrupar por Código de Grupo (ej. Contenedor SB - ED1, Contenedor SD - ED1) según diagrama
  const groupedClusters = useMemo(() => {
    const map = new Map<string, typeof filteredGroups>();

    for (const grp of filteredGroups) {
      if (!map.has(grp.group_code)) {
        map.set(grp.group_code, []);
      }
      map.get(grp.group_code)!.push(grp);
    }

    return Array.from(map.entries())
      .map(([code, items]) => ({
        groupCode: code,
        semesters: items.sort((a, b) => (b.semester_code || "").localeCompare(a.semester_code || "")),
      }))
      .sort((a, b) => a.groupCode.localeCompare(b.groupCode));
  }, [filteredGroups]);

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
                  <span>{availableGroups.length} {availableGroups.length === 1 ? "grupo registrado" : "grupos registrados"}</span>
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
              Mostrando {totalShownLinks} enlaces en {groupedClusters.length} {groupedClusters.length === 1 ? "grupo" : "grupos"} ({filteredGroups.length} semestres)
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
                Todos los grupos ({availableGroups.length})
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

          {groupedClusters.length === 0 ? (
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
            <div className="space-y-8">
              {groupedClusters.map((cluster) => (
                <div
                  key={cluster.groupCode}
                  className="rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs space-y-5"
                >
                  {/* Cabecera del Contenedor de Grupo: ej. SB - ED1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-teal-900/50">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-teal-600 text-white shadow-2xs">
                        Grupo {cluster.groupCode}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white leading-snug">
                          {cluster.groupCode} - {subjectCode}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-teal-300/70">
                          {cluster.semesters.length} {cluster.semesters.length === 1 ? "semestre con material registrado" : "semestres con material registrado"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold self-start sm:self-auto px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Drive Activo</span>
                    </span>
                  </div>

                  {/* Sub-tarjetas: Semestres con su link (según diagrama del usuario) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cluster.semesters.map((sem) => (
                      <div
                        key={sem.id}
                        className="rounded-2xl p-5 bg-slate-50/90 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 hover:border-teal-500 dark:hover:border-teal-500/70 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
                      >
                        <div>
                          {/* Cabecera del Semestre */}
                          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-teal-900/40">
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-800 dark:text-teal-200 px-2.5 py-1 rounded-lg bg-teal-100/80 dark:bg-teal-950 border border-teal-200 dark:border-teal-800">
                              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>{sem.semester_code || "Semestre"}</span>
                            </span>

                            <span className="text-[11px] font-mono text-slate-500 dark:text-teal-300/70">
                              {sem.drive_links.length} {sem.drive_links.length === 1 ? "carpeta" : "carpetas"}
                            </span>
                          </div>

                          {/* Descripción / Docente del Semestre */}
                          {sem.description && (
                            <p className="text-xs text-slate-600 dark:text-teal-100/75 mt-2.5 leading-relaxed">
                              {sem.description}
                            </p>
                          )}

                          {/* Lista de Carpetas y Enlaces */}
                          <div className="mt-3.5 space-y-2">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-teal-300/60 flex items-center gap-1.5 mb-1.5">
                              <Cloud className="w-3 h-3 text-teal-500" />
                              <span>Carpetas Oficiales de Google Drive</span>
                            </span>

                            {sem.drive_links && sem.drive_links.length > 0 ? (
                              sem.drive_links.map((link, idx) => {
                                const linkKey = `${sem.id}-${idx}`;
                                const isCopied = copiedId === linkKey;

                                return (
                                  <div
                                    key={idx}
                                    className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#07191d] hover:bg-slate-100/80 dark:hover:bg-teal-900/50 border border-slate-200 dark:border-teal-900/60 transition group flex items-center justify-between gap-2 shadow-2xs"
                                  >
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 min-w-0 flex-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition"
                                      title="Abrir recurso en Google Drive"
                                    >
                                      {renderLinkIcon(link.type)}
                                      <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 truncate">
                                        {link.title}
                                      </span>
                                    </a>

                                    <div className="flex items-center gap-1 shrink-0">
                                      {/* Botón Copiar Enlace */}
                                      <button
                                        type="button"
                                        onClick={() => handleCopy(link.url, linkKey)}
                                        className="p-1 rounded-lg text-slate-600 dark:text-teal-300 hover:bg-slate-200 dark:hover:bg-teal-800/60 transition cursor-pointer"
                                        title="Copiar enlace de Google Drive"
                                        aria-label="Copiar enlace de Google Drive"
                                      >
                                        {isCopied ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>

                                      {/* Botón Abrir en Google Drive */}
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-slate-200 dark:hover:bg-teal-800/60 transition"
                                        title="Abrir en pestaña nueva de Google Drive"
                                        aria-label="Abrir en pestaña nueva de Google Drive"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-teal-950/20 text-center text-xs text-slate-400 dark:text-teal-300/50 border border-dashed border-slate-300 dark:border-teal-900/60">
                                Carpetas y material en preparación
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
