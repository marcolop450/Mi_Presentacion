"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Category, Recommendation } from "@/types/database";
import {
  Compass,
  Search,
  ArrowRight,
  Globe,
  Youtube,
  Cpu,
  BookOpen,
  FolderTree,
  CheckCircle2,
  Inbox,
  Layers,
  Sparkles,
} from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";

interface RecommendationsSectionProps {
  categories: Category[];
  initialRecommendations: Recommendation[];
}

export default function RecommendationsSection({
  categories,
  initialRecommendations,
}: RecommendationsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Ordenar categorías por display_order y luego por nombre
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const ordA = a.display_order ?? 0;
      const ordB = b.display_order ?? 0;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name);
    });
  }, [categories]);

  // Consolidar categorías con metadatos de sus recomendaciones
  const enrichedCategories = useMemo(() => {
    return sortedCategories.map((cat) => {
      const recsInCat = initialRecommendations.filter(
        (r) => r.category_id === cat.id
      );

      // Extraer tags únicos de las recomendaciones de esta categoría
      const tagsSet = new Set<string>();
      recsInCat.forEach((r) => {
        r.tags?.forEach((t) => tagsSet.add(t.replace(/^#/, "")));
      });

      const featuredCount = recsInCat.filter((r) => r.is_featured).length;

      return {
        ...cat,
        resourceCount: recsInCat.length,
        featuredCount,
        tags: Array.from(tagsSet).slice(0, 4),
        sampleTitles: recsInCat.map((r) => r.title).slice(0, 2),
      };
    });
  }, [sortedCategories, initialRecommendations]);

  // Filtrado de categorías por término de búsqueda
  const filteredCategories = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return enrichedCategories;

    return enrichedCategories.filter((cat) => {
      const matchName = cat.name.toLowerCase().includes(q);
      const matchDesc = cat.description?.toLowerCase().includes(q);
      const matchSlug = cat.slug.toLowerCase().includes(q);
      const matchTags = cat.tags.some((t) => t.toLowerCase().includes(q));
      const matchSamples = cat.sampleTitles.some((t) => t.toLowerCase().includes(q));

      return matchName || matchDesc || matchSlug || matchTags || matchSamples;
    });
  }, [enrichedCategories, searchTerm]);

  // Paginación
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  const getCategoryIcon = (categorySlug?: string) => {
    if (!categorySlug) return <Compass className="w-5 h-5" />;
    const s = categorySlug.toLowerCase();
    if (s.includes("web") || s.includes("dev") || s.includes("programacion"))
      return <Globe className="w-5 h-5" />;
    if (s.includes("youtube") || s.includes("video") || s.includes("canal"))
      return <Youtube className="w-5 h-5" />;
    if (s.includes("ia") || s.includes("ai") || s.includes("inteligencia"))
      return <Cpu className="w-5 h-5" />;
    return <BookOpen className="w-5 h-5" />;
  };

  return (
    <section className="pt-4 sm:pt-6 pb-12 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-teal-400/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 text-xs font-semibold mb-3 border border-teal-200 dark:border-teal-800/80">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Directorio Curado de Desarrollo, Inteligencia Artificial & Aprendizaje</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Catálogo de Recursos & Recomendaciones
            </h1>
            <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 max-w-[70ch]">
              Explora herramientas, librerías, canales de autoaprendizaje y documentación organizados por <strong>Categorías Temáticas</strong>. Selecciona una categoría para acceder a su página dedicada con sus recursos completos.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-teal-950/40 border border-slate-300 dark:border-teal-800/50 text-xs font-medium text-slate-600 dark:text-teal-200/80 backdrop-blur-xs shadow-xs self-start md:self-end">
            <CheckCircle2 className="w-4 h-4 text-teal-500" />
            <span>Páginas Dedicadas por Categoría</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>{categories.length} Categorías</span>
          </div>
        </div>

        {/* Estado inicial sin categorías */}
        {categories.length === 0 ? (
          <div className="text-center py-16 rounded-3xl p-8 max-w-md mx-auto border border-slate-300 dark:border-teal-900/60 bg-white/90 dark:bg-[#0a2026]/80 backdrop-blur-sm shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-teal-950/80 border border-slate-300 dark:border-teal-800/80 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-300 shadow-xs">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Aún no hay categorías registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-2 leading-relaxed">
              Las categorías temáticas y sus recursos asociados aparecerán aquí una vez registradas en el panel administrativo.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de Filtros y Búsqueda */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs backdrop-blur-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Buscador de Categorías */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar categoría temática (ej. Web, Python, Inteligencia Artificial)..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
                    data-testid="recommendations-search"
                  />
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-teal-300/70">
                  <span>
                    Mostrando <strong>{filteredCategories.length}</strong> de{" "}
                    <strong>{categories.length}</strong> categorías
                  </span>
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Listado de Tarjetas de Categoría en Grilla Responsiva */}
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-slate-300 dark:border-teal-900/60 bg-white/95 dark:bg-[#07191d]/90 max-w-md mx-auto shadow-xs">
                <Layers className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron categorías
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/60 mt-1">
                  Prueba cambiando los términos de búsqueda.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {paginatedCategories.map((cat) => {
                    const categoryHref = `/recursos/${encodeURIComponent(cat.slug.toLowerCase())}`;

                    return (
                      <div
                        key={cat.id}
                        className="w-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-teal-500/10 backdrop-blur-xs group"
                      >
                        <div className="space-y-4">
                          {/* Fila Superior: Icono de Categoría + Badge de Conteo de Recursos */}
                          <div className="flex items-center justify-between gap-3">
                            <div
                              className="p-3 rounded-2xl border transition-transform group-hover:scale-105"
                              style={{
                                backgroundColor: cat.color ? `${cat.color}15` : undefined,
                                borderColor: cat.color ? `${cat.color}40` : undefined,
                                color: cat.color || undefined,
                              }}
                            >
                              {getCategoryIcon(cat.slug)}
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                              {cat.featuredCount > 0 && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80">
                                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span>{cat.featuredCount}</span>
                                </span>
                              )}
                              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80">
                                {cat.resourceCount} {cat.resourceCount === 1 ? "recurso" : "recursos"}
                              </span>
                            </div>
                          </div>

                          {/* Nombre de la Categoría */}
                          <div>
                            <Link href={categoryHref}>
                              <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {cat.name}
                              </h2>
                            </Link>
                            {cat.description ? (
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/75 mt-2 line-clamp-2 leading-relaxed">
                                {cat.description}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 dark:text-teal-300/50 mt-2 italic">
                                Categoría curada de recursos y herramientas.
                              </p>
                            )}
                          </div>

                          {/* Preview de Etiquetas presentes en esta categoría */}
                          {cat.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {cat.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-teal-950/60 dark:text-teal-300 text-[10px] font-mono border border-slate-200 dark:border-teal-900/60"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Botón de Entrada a la Página Dedicada de la Categoría */}
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-teal-900/50">
                          <Link
                            href={categoryHref}
                            className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-teal-700/25 transition group/btn cursor-pointer"
                          >
                            <span>Explorar Recursos</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginación */}
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredCategories.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                  itemLabel="categorías"
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
