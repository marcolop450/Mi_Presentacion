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
    if (type === "clases" || type === "video") return <Video className="w-4 h-4 text-blue-600 dark:text-sky-400" />;
    if (type === "practicas" || type === "guias") return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    return <FolderOpen className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
  };

  return (
    <section id="auxiliaturas" className="py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
              Auxiliaturas
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-[65ch]">
              Material académico, carpetas y recursos compartidos por materia y grupo.
            </p>
          </div>
        </div>

        {/* Estado inicial sin auxiliaturas */}
        {auxiliaries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Sin auxiliaturas registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Las materias y enlaces a recursos aparecerán aquí una vez que se registren en la plataforma.
            </p>
          </div>
        ) : (
          <>
            {/* Controles de Búsqueda y Filtro */}
            <div className="p-4 rounded-2xl mb-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Buscador */}
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar materia, sigla o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-sky-400 transition"
                    data-testid="auxiliaries-search"
                  />
                </div>

                {/* Filtro por Materia */}
                <div className="sm:col-span-3">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-sky-400 transition"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 dark:focus:border-sky-400 transition"
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
              <div className="text-center py-12 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md mx-auto">
                <Layers className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron resultados
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Prueba cambiando los filtros o el texto de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubject("all");
                    setSelectedGroup("all");
                  }}
                  className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAuxiliaries.map((aux) => (
                  <div
                    key={aux.id}
                    className="rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
                  >
                    <div>
                      {/* Cabecera de la Tarjeta */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-sky-400 border border-blue-200/60 dark:border-blue-800/60">
                            {aux.subject_code}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Grupo {aux.group_code}
                          </span>
                        </div>
                        {aux.semester && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {aux.semester}
                          </span>
                        )}
                      </div>

                      {/* Nombre de la Materia */}
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {aux.subject_name}
                      </h3>

                      {/* Horario */}
                      {aux.schedule && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{aux.schedule}</span>
                        </div>
                      )}

                      {/* Descripción */}
                      {aux.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                          {aux.description}
                        </p>
                      )}
                    </div>

                    {/* Enlaces a Drive */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2.5">
                        Recursos en Drive
                      </span>

                      {aux.drive_links && aux.drive_links.length > 0 ? (
                        <div className="space-y-1.5">
                          {aux.drive_links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                {renderLinkIcon(link.type)}
                                <span className="truncate font-medium">{link.title}</span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 opacity-60 flex-shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Sin recursos adjuntos
                        </p>
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
