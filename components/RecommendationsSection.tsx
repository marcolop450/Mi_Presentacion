"use client";

import { useState, useMemo } from "react";
import { Category, Recommendation } from "@/types/database";
import {
  Compass,
  ExternalLink,
  Search,
  Tag,
  Globe,
  Youtube,
  Cpu,
  BookOpen,
  Inbox,
} from "lucide-react";

interface RecommendationsSectionProps {
  categories: Category[];
  initialRecommendations: Recommendation[];
}

export default function RecommendationsSection({
  categories,
  initialRecommendations,
}: RecommendationsSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecommendations = useMemo(() => {
    return initialRecommendations.filter((rec) => {
      const matchCategory =
        activeCategoryId === "all" || rec.category_id === activeCategoryId;

      const matchSearch =
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rec.tags && rec.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchCategory && matchSearch;
    });
  }, [initialRecommendations, activeCategoryId, searchTerm]);

  const getCategoryIcon = (categorySlug?: string) => {
    if (!categorySlug) return <Compass className="w-3.5 h-3.5" />;
    if (categorySlug.includes("web")) return <Globe className="w-3.5 h-3.5" />;
    if (categorySlug.includes("youtube")) return <Youtube className="w-3.5 h-3.5" />;
    if (categorySlug.includes("ia")) return <Cpu className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <section id="recomendaciones" className="py-20 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
              Recursos y Recomendaciones
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-[65ch]">
              Herramientas, plataformas, bibliografía y canales seleccionados para desarrollo e ingeniería de software.
            </p>
          </div>
        </div>

        {/* Estado inicial sin recomendaciones */}
        {initialRecommendations.length === 0 ? (
          <div className="text-center py-16 rounded-2xl p-8 max-w-md mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-slate-400">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Aún no hay recomendaciones registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Los recursos y plataformas de referencia aparecerán aquí una vez que sean agregados en el panel.
            </p>
          </div>
        ) : (
          <>
            {/* Controles: Categorías y Buscador */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
              {/* Filtros de Categorías */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveCategoryId("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                    activeCategoryId === "all"
                      ? "bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                      activeCategoryId === cat.id
                        ? "bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 font-semibold"
                        : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Buscador */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-600 dark:focus:border-sky-400 transition"
                  data-testid="recommendations-search"
                />
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío */}
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-md mx-auto">
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron recursos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Intenta modificando los criterios de búsqueda o seleccionando otra categoría.
                </p>
                <button
                  onClick={() => {
                    setActiveCategoryId("all");
                    setSearchTerm("");
                  }}
                  className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-2xl p-6 flex flex-col justify-between bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {rec.is_featured ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/70">
                            Destacado
                          </span>
                        ) : (
                          <span />
                        )}
                      </div>

                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {rec.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                        {rec.description}
                      </p>

                      {/* Etiquetas */}
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[11px] border border-slate-200 dark:border-slate-700"
                            >
                              <Tag className="w-2.5 h-2.5 opacity-60" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botón de Enlace Externo */}
                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-4 py-2 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-400 transition border border-slate-200 dark:border-slate-800"
                      >
                        <span>Abrir recurso</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                      </a>
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
