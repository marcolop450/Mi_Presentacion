"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Auxiliary, DriveLinkItem, getSemesterLevelLabel } from "@/types/database";
import {
  Search,
  Layers,
  Inbox,
  Cloud,
  Users,
  GraduationCap,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";
import AdminPagination from "@/components/admin/AdminPagination";

interface AuxiliariesSectionProps {
  auxiliaries: Auxiliary[];
}

interface GroupInfo {
  id: string;
  group_code: string;
  semester_code?: string;
  description?: string;
  drive_links: DriveLinkItem[];
}

interface GroupedSubject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semesterLevel: number;
  semesterLabel: string;
  imageUrl?: string;
  description?: string;
  groups: GroupInfo[];
}

export default function AuxiliariesSection({ auxiliaries }: AuxiliariesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemesterLevel, setSelectedSemesterLevel] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Paginación (6 materias por página)
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Agrupar auxiliaturas por Materia única para el catálogo
  const groupedSubjects = useMemo<GroupedSubject[]>(() => {
    const map = new Map<string, GroupedSubject>();

    for (const aux of auxiliaries) {
      const sub = aux.subject;
      const subName = sub?.name || aux.subject_name || "Materia";
      const subCode = (sub?.code || aux.subject_code || "INF").toUpperCase();
      const semesterLevel = sub?.semester_level || 1;
      const key = sub?.id || `${subCode}-${subName}`;

      if (!map.has(key)) {
        map.set(key, {
          subjectId: key,
          subjectName: subName,
          subjectCode: subCode,
          semesterLevel: semesterLevel,
          semesterLabel: getSemesterLevelLabel(semesterLevel),
          imageUrl: sub?.image_url || aux.image_url,
          description: sub?.description || undefined,
          groups: [],
        });
      }

      const item = map.get(key)!;
      const groupCode = aux.group_code || "Único";
      const semCode =
        aux.semester?.code ||
        (typeof aux.semester === "string" ? aux.semester : "") ||
        aux.semester_code;

      item.groups.push({
        id: aux.id,
        group_code: groupCode,
        semester_code: semCode,
        description: aux.description,
        drive_links: aux.drive_links || [],
      });
    }

    map.forEach((item) => {
      item.groups.sort((a, b) => a.group_code.localeCompare(b.group_code));
    });

    // Ordenar de MENOR A MAYOR por semesterLevel (1..10, 11=Electiva) y luego por código
    return Array.from(map.values()).sort((a, b) => {
      if (a.semesterLevel !== b.semesterLevel) {
        return a.semesterLevel - b.semesterLevel;
      }
      return a.subjectCode.localeCompare(b.subjectCode);
    });
  }, [auxiliaries]);

  // Lista de niveles de semestre presentes para filtros rápidos
  const availableSemesterLevels = useMemo(() => {
    const levels = Array.from(new Set(groupedSubjects.map((s) => s.semesterLevel)));
    return levels.sort((a, b) => a - b);
  }, [groupedSubjects]);

  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(groupedSubjects.map((s) => s.subjectName)));
  }, [groupedSubjects]);

  // Filtrado reactivo de materias agrupadas
  const filteredSubjects = useMemo(() => {
    return groupedSubjects.filter((subject) => {
      const q = searchTerm.toLowerCase().trim();

      const matchSemester =
        selectedSemesterLevel === "all" ||
        subject.semesterLevel.toString() === selectedSemesterLevel;

      const matchSubject =
        selectedSubject === "all" || subject.subjectName === selectedSubject;

      if (!matchSemester || !matchSubject) {
        return false;
      }

      if (!q) return true;

      const matchName = subject.subjectName.toLowerCase().includes(q);
      const matchCode = subject.subjectCode.toLowerCase().includes(q);
      const matchDesc = subject.description?.toLowerCase().includes(q);
      const matchSemesterLabel = subject.semesterLabel.toLowerCase().includes(q);
      const matchGroups = subject.groups.some(
        (g) =>
          g.group_code.toLowerCase().includes(q) ||
          (g.semester_code && g.semester_code.toLowerCase().includes(q)) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          g.drive_links.some((l) => l.title.toLowerCase().includes(q))
      );

      return matchName || matchCode || matchDesc || matchSemesterLabel || matchGroups;
    });
  }, [groupedSubjects, searchTerm, selectedSemesterLevel, selectedSubject]);

  // Resetear página al filtrar
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSemesterLevel, selectedSubject]);

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) || 1;
  const paginatedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSubjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSubjects, currentPage]);

  return (
    <section className="pt-4 sm:pt-6 pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-200 dark:border-teal-400/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-semibold mb-3 border border-teal-200 dark:border-teal-800/80">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Malla Curricular Universitaria FICCT - UAGRM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Catálogo de Auxiliaturas
            </h1>
            <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 max-w-[70ch]">
              Explora las asignaturas organizadas de menor a mayor semestre. Selecciona una materia para acceder a su <strong>página dedicada</strong> con todos sus grupos y carpetas de Google Drive.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-teal-950/40 border border-slate-300 dark:border-teal-800/50 text-xs font-medium text-slate-600 dark:text-teal-200/80 backdrop-blur-xs shadow-xs self-start md:self-end">
            <Cloud className="w-4 h-4 text-teal-500" />
            <span>Páginas Dedicadas por Materia</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>{groupedSubjects.length} Asignaturas</span>
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
            {/* Controles: Filtros por Semestre Curricular (Pills) + Buscador y Selectores corregidos */}
            <div className="p-4 sm:p-5 rounded-3xl mb-8 bg-white/85 dark:bg-[#081e19]/70 border border-slate-300 dark:border-teal-900/60 shadow-xs backdrop-blur-sm space-y-4">
              {/* Pills de Semestre Curricular (1ro a 10mo y Electivas) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-teal-300/70 mb-2">
                  Filtrar por Semestre Curricular (Malla de la Carrera)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSemesterLevel("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                      selectedSemesterLevel === "all"
                        ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                        : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                    }`}
                  >
                    Todos ({groupedSubjects.length})
                  </button>
                  {availableSemesterLevels.map((lvl) => {
                    const countInLevel = groupedSubjects.filter((s) => s.semesterLevel === lvl).length;
                    const label = getSemesterLevelLabel(lvl);
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedSemesterLevel(lvl.toString())}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                          selectedSemesterLevel === lvl.toString()
                            ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                            : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                        }`}
                      >
                        {label} ({countInLevel})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fila de Buscador y Combobox con Flecha Separada de la Pared */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-200 dark:border-teal-900/40">
                {/* Buscador */}
                <div className="sm:col-span-7 md:col-span-8 relative">
                  <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por materia (ej. Programación), sigla (INF-220) o grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
                    data-testid="auxiliaries-search"
                  />
                </div>

                {/* Combobox Materia con Flecha Separada */}
                <div className="sm:col-span-5 md:col-span-4 relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-teal-500 transition cursor-pointer"
                    data-testid="subject-select"
                  >
                    <option value="all" className="bg-white dark:bg-[#07191d]">
                      Todas las materias ({uniqueSubjects.length})
                    </option>
                    {uniqueSubjects.map((sub) => (
                      <option key={sub} value={sub} className="bg-white dark:bg-[#07191d]">
                        {sub}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-teal-400 flex items-center">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Indicador de resultados */}
              <div className="pt-2 border-t border-slate-200 dark:border-teal-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-teal-300/70">
                <span>
                  Mostrando <strong>{filteredSubjects.length}</strong> de <strong>{groupedSubjects.length}</strong> materias (ordenadas de menor a mayor semestre)
                </span>
                {(searchTerm ||
                  selectedSemesterLevel !== "all" ||
                  selectedSubject !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSemesterLevel("all");
                      setSelectedSubject("all");
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío */}
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/80 max-w-md mx-auto shadow-xs">
                <Layers className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron materias
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/60 mt-1">
                  Prueba cambiando el semestre o el término de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSemesterLevel("all");
                    setSelectedSubject("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 dark:bg-teal-950/80 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-slate-300 dark:border-teal-800 transition shadow-xs cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedSubjects.map((sub) => {
                    const subjectHref = `/auxiliaturas/${encodeURIComponent(sub.subjectCode.toLowerCase())}`;
                    const uniqueGroupCodes = Array.from(new Set(sub.groups.map((g) => g.group_code))).sort();
                    const groupNames = uniqueGroupCodes.map((code) => `Grupo ${code}`).join(", ");
                    const registeredCount = sub.groups.length;

                    return (
                      <div
                        key={sub.subjectId}
                        className="rounded-3xl p-6 flex flex-col justify-between bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-900/60 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-teal-500/10 backdrop-blur-xs group"
                      >
                        <div>
                          {/* Cabecera: Semestre + Sigla */}
                          <div className="flex items-start justify-between gap-3 mb-3.5">
                            <div className="flex items-center gap-3">
                              <InitialsAvatar src={sub.imageUrl} name={sub.subjectName} size="md" />
                              <div>
                                <div className="flex items-center flex-wrap gap-1.5 mb-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-teal-100 text-teal-900 dark:bg-teal-950/90 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                    <GraduationCap className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                    <span>{sub.semesterLabel}</span>
                                  </span>
                                  <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                                    {sub.subjectCode}
                                  </span>
                                </div>

                                <Link href={subjectHref}>
                                  <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                                    {sub.subjectName}
                                  </h3>
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Descripción */}
                          {sub.description && (
                            <p className="text-xs text-slate-600 dark:text-teal-100/70 mt-2 leading-relaxed line-clamp-2">
                              {sub.description}
                            </p>
                          )}

                          {/* Resumen de Grupos Asignados */}
                          <div className="mt-4 p-3 rounded-2xl bg-slate-50/90 dark:bg-teal-950/40 border border-slate-200 dark:border-teal-900/60 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-teal-200 min-w-0">
                              <Users className="w-4 h-4 text-teal-500 shrink-0" />
                              <span className="font-semibold truncate">{groupNames || "1 Grupo"}</span>
                            </div>
                            <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 bg-white dark:bg-teal-950 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-teal-900/80 shrink-0 ml-2">
                              {registeredCount} {registeredCount === 1 ? "auxiliatura" : "auxiliaturas"}
                            </span>
                          </div>
                        </div>

                        {/* Botón de Entrada a la Página Dedicada */}
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-teal-900/50">
                          <Link
                            href={subjectHref}
                            className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-teal-700/25 transition group/btn"
                          >
                            <span>Ver Grupos y Materiales</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredSubjects.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  itemLabel="materias"
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
