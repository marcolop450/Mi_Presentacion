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
  BookMarked 
} from "lucide-react";

interface AuxiliariesSectionProps {
  auxiliaries: Auxiliary[];
}

export default function AuxiliariesSection({ auxiliaries }: AuxiliariesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Obtener lista única de materias y grupos para los selectores
  const uniqueSubjects = useMemo(() => {
    const list = Array.from(new Set(auxiliaries.map((a) => a.subject_name)));
    return list;
  }, [auxiliaries]);

  const uniqueGroups = useMemo(() => {
    const list = Array.from(new Set(auxiliaries.map((a) => a.group_code)));
    return list;
  }, [auxiliaries]);

  // Filtrado reactivo en tiempo real
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

  // Helper para asignar icono según el tipo de link
  const renderLinkIcon = (type?: string) => {
    if (type === "clases" || type === "video") return <Video className="w-4 h-4 text-cyan-400" />;
    if (type === "practicas" || type === "guias") return <FileText className="w-4 h-4 text-emerald-400" />;
    return <FolderOpen className="w-4 h-4 text-blue-400" />;
  };

  return (
    <section id="auxiliaturas" className="py-16 bg-[#060B14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>UAGRM - FICCT • Repositorio Académico</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Auxiliaturas Universitarias
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Organizadas por Materia, Sigla y Grupo. Accede directamente a las carpetas, grabaciones y prácticas en Google Drive.
          </p>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-[#0B1528] border border-blue-900/40 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Buscador de texto */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por materia, sigla (INF-220) o grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Selector por Materia */}
            <div className="sm:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition"
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition"
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

        {/* Listado de Tarjetas de Auxiliatura */}
        {filteredAuxiliaries.length === 0 ? (
          <div className="text-center py-16 bg-[#0B1528]/50 border border-slate-800 rounded-2xl p-8">
            <BookMarked className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No se encontraron auxiliaturas</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Intenta cambiando los términos de búsqueda o limpiando los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setSelectedGroup("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 transition"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuxiliaries.map((aux) => (
              <div
                key={aux.id}
                className="bg-[#0B1528] border border-blue-900/40 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-900/20"
              >
                <div>
                  {/* Badges de Sigla, Grupo y Semestre */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-black tracking-wide">
                        {aux.subject_code}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold">
                        Grupo {aux.group_code}
                      </span>
                    </div>
                    {aux.semester && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {aux.semester}
                      </span>
                    )}
                  </div>

                  {/* Nombre de la Materia */}
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {aux.subject_name}
                  </h3>

                  {/* Horario */}
                  {aux.schedule && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{aux.schedule}</span>
                    </div>
                  )}

                  {/* Descripción */}
                  {aux.description && (
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed line-clamp-3">
                      {aux.description}
                    </p>
                  )}
                </div>

                {/* Enlaces Múltiples a Google Drive */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2.5">
                    Enlaces de Material (Google Drive):
                  </span>
                  
                  {aux.drive_links && aux.drive_links.length > 0 ? (
                    <div className="space-y-2">
                      {aux.drive_links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-950/70 border border-slate-800 hover:border-blue-500/50 text-xs text-slate-200 hover:text-white transition group"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            {renderLinkIcon(link.type)}
                            <span className="truncate font-medium">{link.title}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-slate-900/50 text-center text-xs text-slate-400 border border-slate-800">
                      Material en preparación
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
