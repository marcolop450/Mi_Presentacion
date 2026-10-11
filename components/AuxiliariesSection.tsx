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
  Clock,
  Layers,
  Inbox,
} from "lucide-react";

interface AuxiliariesSectionProps {
  auxiliaries: Auxiliary[];
}

export default function AuxiliariesSection({ auxiliaries }: AuxiliariesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(auxiliaries.map((a) => a.subject_name)));
  }, [auxiliaries]);

  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(auxiliaries.map((a) => a.group_code)));
  }, [auxiliaries]);

  const filteredAuxiliaries = useMemo(() => {
    return auxiliaries.filter((item) => {
      const matchSearch =
        item.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.group_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSubject =
        selectedSubject === "all" || item.subject_name === selectedSubject;

      const matchGroup =
        selectedGroup === "all" || item.group_code === selectedGroup;

      return matchSearch && matchSubject && matchGroup;
    });
  }, [auxiliaries, searchTerm, selectedSubject, selectedGroup]);

  const renderLinkIcon = (type?: string) => {
    if (type === "clases" || type === "video") return <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    if (type === "practicas" || type === "guias") return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    return <FolderOpen className="w-4 h-4 text-teal-500 dark:text-teal-400" />;
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-teal-200/60 dark:border-teal-900/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold mb-3">
              <span>FICCT // UAGRM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Auxiliaturas Universitarias
            </h1>
            <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 max-w-[65ch]">
              Carpetas oficiales de Google Drive organizadas por Sigla, Materia y Grupo para estudiantes de la FICCT.
            </p>
          </div>
        </div>

        {/* Estado inicial sin auxiliaturas */}
        {auxiliaries.length === 0 ? (
          <div className="text-center py-16 rounded-3xl p-8 max-w-md mx-auto border border-teal-200/80 dark:border-teal-900/60 bg-white/80 dark:bg-[#0a2026]/80 backdrop-blur-sm shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-300">
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
            {/* Controles de Búsqueda y Filtro */}
            <div className="p-4 sm:p-5 rounded-3xl mb-8 bg-white/80 dark:bg-[#0a2026]/80 border border-teal-200/80 dark:border-teal-900/60 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Buscador */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar materia, sigla (INF-220) o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-teal-600/50 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
                    data-testid="auxiliaries-search"
                  />
                </div>

                {/* Filtro por Materia */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    data-testid="subject-select"
                  >
                    <option value="all">Todas las materias</option>
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
                    className="w-full px-3 py-2.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition"
                    data-testid="group-select"
                  >
                    <option value="all">Todos los grupos</option>
                    {uniqueGroups.map((grp) => (
                      <option key={grp} value={grp}>
                        Grupo {grp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío de Filtro */}
            {filteredAuxiliaries.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-teal-200/80 dark:border-teal-900/60 bg-white/80 dark:bg-[#0a2026]/80 max-w-md mx-auto">
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
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAuxiliaries.map((aux) => (
                  <div
                    key={aux.id}
                    className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-white/85 dark:bg-[#0a2026]/90 border border-teal-200/80 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-teal-500/5 backdrop-blur-sm"
                  >
                    <div>
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/80">
                            {aux.subject_code}
                          </span>
                          <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Grupo {aux.group_code}
                          </span>
                        </div>
                        {aux.semester && (
                          <span className="text-xs font-mono text-slate-500 dark:text-teal-300/60 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-teal-500" />
                            {aux.semester}
                          </span>
                        )}
                      </div>

                      {/* Título de la Materia */}
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {aux.subject_name}
                      </h3>

                      {/* Horario */}
                      {aux.schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-teal-200/60 mt-2 font-mono">
                          <Clock className="w-3.5 h-3.5 text-teal-500" />
                          <span>{aux.schedule}</span>
                        </div>
                      )}

                      {/* Descripción */}
                      {aux.description && (
                        <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-3 leading-relaxed">
                          {aux.description}
                        </p>
                      )}
                    </div>

                    {/* Enlaces a Google Drive */}
                    <div className="mt-6 pt-4 border-t border-teal-100 dark:border-teal-900/50">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-teal-300/60 block mb-2.5">
                        Carpetas de Google Drive
                      </span>

                      {aux.drive_links && aux.drive_links.length > 0 ? (
                        <div className="space-y-2">
                          {aux.drive_links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-2xl bg-teal-50/50 hover:bg-teal-100/70 dark:bg-teal-950/50 dark:hover:bg-teal-900/60 border border-teal-200/60 dark:border-teal-800/50 hover:border-teal-400 text-xs text-slate-800 dark:text-teal-100 transition group"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {renderLinkIcon(link.type)}
                                <span className="truncate font-semibold">{link.title}</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-teal-500 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 rounded-2xl bg-teal-50/30 dark:bg-teal-950/30 text-center text-xs text-slate-400 dark:text-teal-300/50 border border-teal-200/40 dark:border-teal-800/40">
                          Material en preparación
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
