"use client";

import { useState, useMemo } from "react";
import { Auxiliary } from "@/types/database";
import {
  Search,
  FolderOpen,
  Video,
  FileText,
  ExternalLink,
  Calendar,
  Layers,
  Inbox,
  Copy,
  Check,
  Sparkles,
  Cloud,
  CheckCircle2,
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";

import AdminPagination from "@/components/admin/AdminPagination";

interface AuxiliariesSectionProps {
  auxiliaries: Auxiliary[];
}

export default function AuxiliariesSection({ auxiliaries }: AuxiliariesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Paginación (6 por página)
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(auxiliaries.map((a) => a.subject?.name || a.subject_name).filter(Boolean))) as string[];
  }, [auxiliaries]);

  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(auxiliaries.map((a) => a.group_code).filter(Boolean)));
  }, [auxiliaries]);

  const filteredAuxiliaries = useMemo(() => {
    return auxiliaries.filter((item) => {
      const subName = item.subject?.name || item.subject_name || "";
      const subCode = item.subject?.code || item.subject_code || "";
      const grpCode = item.group_code || "";
      const desc = item.description || item.subject?.description || "";
      const semCode = item.semester?.code || (typeof item.semester === "string" ? item.semester : "") || item.semester_code || "";

      const matchSearch =
        subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grpCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        desc.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSubject =
        selectedSubject === "all" || subName === selectedSubject;

      const matchGroup =
        selectedGroup === "all" || grpCode === selectedGroup;

      return matchSearch && matchSubject && matchGroup;
    });
  }, [auxiliaries, searchTerm, selectedSubject, selectedGroup]);

  // Resetear página al filtrar
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject, selectedGroup]);

  const totalPages = Math.ceil(filteredAuxiliaries.length / ITEMS_PER_PAGE) || 1;
  const paginatedAuxiliaries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAuxiliaries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAuxiliaries, currentPage]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderLinkIcon = (type?: string) => {
    if (type === "clases" || type === "video") return <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    if (type === "practicas" || type === "guias") return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    return <FolderOpen className="w-4 h-4 text-teal-500 dark:text-teal-400" />;
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección Enriquecida */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-teal-400/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-teal-950/70 border border-slate-300 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold mb-3 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FICCT // UAGRM • REPOSITORIO OFICIAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Auxiliaturas Universitarias
            </h1>
            <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 max-w-[65ch]">
              Carpetas oficiales de Google Drive organizadas por Sigla, Materia y Grupo para estudiantes de la FICCT.
            </p>
          </div>

          {/* Badge Informativo de Acceso Directo */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-teal-950/40 border border-slate-300 dark:border-teal-800/50 text-xs font-medium text-slate-600 dark:text-teal-200/80 backdrop-blur-xs shadow-xs">
            <Cloud className="w-4 h-4 text-teal-500" />
            <span>Google Drive Directo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Sincronizado</span>
          </div>
        </div>

        {/* Estado inicial sin auxiliaturas */}
        {auxiliaries.length === 0 ? (
          <div className="text-center py-16 rounded-3xl p-8 max-w-md mx-auto border border-slate-300 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/80 backdrop-blur-sm shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-teal-950/80 border border-slate-300 dark:border-teal-800/80 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-300 shadow-xs">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Sin auxiliaturas registradas todavía
            </h3>
            <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-2 leading-relaxed">
              Las materias y enlaces a las carpetas de Google Drive se mostrarán aquí una vez agregadas en el panel administrativo.
            </p>
          </div>
        ) : (
          <>
            {/* Controles de Búsqueda y Filtro con Detalles */}
            <div className="p-4 sm:p-5 rounded-3xl mb-8 bg-white/85 dark:bg-[#081e19]/70 border border-slate-300 dark:border-teal-900/60 shadow-xs backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Buscador */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar materia, sigla (INF-220) o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
                    data-testid="auxiliaries-search"
                  />
                </div>

                {/* Filtro por Materia */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    data-testid="subject-select"
                  >
                    <option value="all">Todas las materias ({uniqueSubjects.length})</option>
                    {uniqueSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Grupo */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    data-testid="group-select"
                  >
                    <option value="all">Todos los grupos ({uniqueGroups.length})</option>
                    {uniqueGroups.map((grp) => (
                      <option key={grp} value={grp}>
                        Grupo {grp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Indicador de resultados activos */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-teal-300/70">
                <span>
                  Mostrando <strong>{filteredAuxiliaries.length}</strong> de <strong>{auxiliaries.length}</strong> materias registradas
                </span>
                {(searchTerm || selectedSubject !== "all" || selectedGroup !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSubject("all");
                      setSelectedGroup("all");
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío de Filtro */}
            {filteredAuxiliaries.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/80 max-w-md mx-auto shadow-xs">
                <Layers className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron resultados
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/60 mt-1">
                  Prueba cambiando los filtros o el texto de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubject("all");
                    setSelectedGroup("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-slate-300 dark:border-teal-800 transition shadow-xs"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedAuxiliaries.map((aux) => (
                    <div
                      key={aux.id}
                      className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-white/85 dark:bg-[#081e19]/80 border border-slate-300 dark:border-teal-900/60 hover:border-slate-400 dark:hover:border-teal-500 transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-teal-500/5 backdrop-blur-xs"
                    >
                    <div>
                      {/* Cabecera de la Tarjeta con Avatar y Badges */}
                      {(() => {
                        const subName = aux.subject?.name || aux.subject_name || "Materia";
                        const subCode = aux.subject?.code || aux.subject_code || "INF";
                        const imgUrl = aux.subject?.image_url || aux.image_url;
                        const semCode = aux.semester?.code || (typeof aux.semester === "string" ? aux.semester : "") || aux.semester_code || "";
                        const cat = aux.subject?.category;

                        return (
                          <div className="flex items-start justify-between gap-3 mb-3.5">
                            <div className="flex items-center gap-3">
                              <InitialsAvatar src={imgUrl} name={subName} size="md" />
                              <div>
                                <div className="flex items-center flex-wrap gap-2">
                                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-teal-900 dark:bg-teal-950/90 dark:text-teal-300 border border-slate-300 dark:border-teal-800/80">
                                    {subCode}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                                    Grupo {aux.group_code}
                                  </span>
                                  {cat && (
                                    <span
                                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border"
                                      style={{
                                        backgroundColor: `${cat.color || "#0d9488"}20`,
                                        borderColor: `${cat.color || "#0d9488"}50`,
                                        color: cat.color || "#0d9488",
                                      }}
                                    >
                                      {cat.name}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                                  {subName}
                                </h3>
                              </div>
                            </div>
                            {semCode && (
                              <span className="text-xs font-mono text-slate-500 dark:text-teal-300/70 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/70 border border-slate-200 dark:border-transparent dark:bg-teal-950/40 shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                {semCode}
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Descripción */}
                      {aux.description && (
                        <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-3 leading-relaxed">
                          {aux.description}
                        </p>
                      )}
                    </div>

                    {/* Enlaces a Google Drive */}
                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-teal-900/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-teal-300/60 flex items-center gap-1.5">
                          <Cloud className="w-3 h-3 text-teal-500" />
                          <span>Carpetas en Google Drive</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verificado</span>
                        </span>
                      </div>

                      {aux.drive_links && aux.drive_links.length > 0 ? (
                        <div className="space-y-2">
                          {aux.drive_links.map((link, idx) => {
                            const linkUniqueId = `${aux.id}-${idx}`;
                            const isCopied = copiedIndex === linkUniqueId;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 hover:bg-slate-100 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 border border-slate-300 dark:border-teal-800/50 hover:border-slate-400 text-xs text-slate-800 dark:text-teal-100 transition group shadow-2xs"
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2.5 overflow-hidden flex-1"
                                >
                                  {renderLinkIcon(link.type)}
                                  <span className="truncate font-semibold">{link.title}</span>
                                </a>

                                <div className="flex items-center gap-1.5 ml-2">
                                  {/* Botón Copiar Enlace */}
                                  <button
                                    onClick={() => handleCopyLink(link.url, linkUniqueId)}
                                    title="Copiar enlace de Google Drive"
                                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-teal-800/50 text-slate-500 dark:text-teal-300 transition"
                                  >
                                    {isCopied ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-teal-800/50 text-teal-600 dark:text-teal-400 transition"
                                    title="Abrir en pestaña nueva"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-slate-50/50 dark:bg-teal-950/30 text-center text-xs text-slate-400 dark:text-teal-300/50 border border-slate-300 dark:border-teal-800/40">
                          Material en preparación
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredAuxiliaries.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                itemLabel="auxiliaturas"
              />
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
}
