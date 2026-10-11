"use client";

import { useState, useMemo } from "react";
import { Auxiliary } from "@/types/database";
import { 
  GraduationCap, 
  Search, 
  FolderOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Cpu,
  Layers
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
    if (type === "clases" || type === "video") return <Video className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />;
    if (type === "practicas" || type === "guias") return <FileText className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    return <FolderOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
  };

  return (
    <section id="auxiliaturas" className="py-20 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-blue-950/60">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>TERMINAL ACADÉMICA // FICCT - UAGRM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Auxiliaturas & Repositorios
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md font-sans">
            Accede a las carpetas en Google Drive organizadas con precisión por Materia, Sigla y Grupo.
          </p>
        </div>

        {/* Si no hay auxiliaturas en la base de datos (Estado inicial limpio) */}
        {auxiliaries.length === 0 ? (
          <div className="text-center py-20 cyber-glass rounded-3xl p-8 max-w-lg mx-auto shadow-xl border border-slate-200 dark:border-blue-900/40">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold block mb-1">
              [ ESTACIÓN EN ESPERA // DRIVE NEXUS ]
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              No hay auxiliaturas registradas todavía
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Las materias, horarios y carpetas de Google Drive se mostrarán aquí una vez que el administrador las registre en el panel de control.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de Filtros y Búsqueda estilo Terminal */}
            <div className="cyber-glass rounded-2xl p-4 sm:p-5 mb-8 shadow-sm border border-slate-200 dark:border-blue-900/40">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center font-mono">
                {/* Buscador de texto */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="> Buscar materia, sigla (INF-220) o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                    data-testid="auxiliaries-search"
                  />
                </div>

                {/* Selector por Materia */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                    data-testid="subject-select"
                  >
                    <option value="all">Todas las Materias</option>
                    {uniqueSubjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector por Grupo */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 transition"
                    data-testid="group-select"
                  >
                    <option value="all">Todos los Grupos</option>
                    {uniqueGroups.map((grp) => (
                      <option key={grp} value={grp}>
                        Grupo {grp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío de Búsqueda */}
            {filteredAuxiliaries.length === 0 ? (
              <div className="text-center py-14 cyber-glass rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
                <Layers className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron auxiliaturas con estos filtros
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Intenta modificando los términos de búsqueda o limpiando los filtros seleccionados.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubject("all");
                    setSelectedGroup("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-600/20 dark:text-cyan-300 dark:border-cyan-500/40 hover:bg-cyan-100 transition"
                >
                  $ reset-filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuxiliaries.map((aux) => (
                  <div
                    key={aux.id}
                    className="cyber-glass rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-cyan-500/10 border border-slate-200 dark:border-blue-900/50 hover:border-cyan-500/50 group"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-500/15 dark:border-cyan-500/30 dark:text-cyan-400 text-xs font-mono font-bold tracking-wide">
                            {aux.subject_code}
                          </span>
                          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold">
                            GRUPO {aux.group_code}
                          </span>
                        </div>
                        {aux.semester && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-500" />
                            {aux.semester}
                          </span>
                        )}
                      </div>

                      {/* Nombre de la Materia */}
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {aux.subject_name}
                      </h3>

                      {/* Horario */}
                      {aux.schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{aux.schedule}</span>
                        </div>
                      )}

                      {/* Descripción */}
                      {aux.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed line-clamp-3">
                          {aux.description}
                        </p>
                      )}
                    </div>

                    {/* Módulos de Enlaces a Google Drive */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
                        [ RECURSOS EN GOOGLE DRIVE ]
                      </span>
                      
                      {aux.drive_links && aux.drive_links.length > 0 ? (
                        <div className="space-y-2">
                          {aux.drive_links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-cyan-50/60 dark:hover:bg-blue-950/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 text-xs text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-white transition group/item"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                {renderLinkIcon(link.type)}
                                <span className="truncate font-medium">{link.title}</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-500 group-hover/item:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-800">
                          // Material en preparación
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
