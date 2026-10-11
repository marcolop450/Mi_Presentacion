"use client";

import { useState, useMemo } from "react";
import { Category, Recommendation } from "@/types/database";
import { 
  Compass, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  Search, 
  Tag, 
  Globe, 
  Youtube, 
  Cpu, 
  BookOpen 
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

  // Helper para asignar icono por categoría
  const getCategoryIcon = (categorySlug?: string) => {
    if (!categorySlug) return <Compass className="w-3.5 h-3.5" />;
    if (categorySlug.includes("web")) return <Globe className="w-3.5 h-3.5" />;
    if (categorySlug.includes("youtube")) return <Youtube className="w-3.5 h-3.5" />;
    if (categorySlug.includes("ia")) return <Cpu className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <section id="recomendaciones" className="py-16 bg-white dark:bg-[#070D18] border-t border-slate-200 dark:border-blue-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Compass className="w-4 h-4" />
            <span>Recursos Seleccionados • KIRIS Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Recomendaciones & Herramientas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Sitios web, canales de YouTube, librerías y documentación sobre desarrollo e Inteligencia Artificial.
          </p>
        </div>

        {/* Si no hay recomendaciones registradas */}
        {initialRecommendations.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#0B1528]/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-900/50 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Aún no hay recomendaciones registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Las recomendaciones seleccionadas por categoría (Web, Clases, Canales de YouTube e IA) aparecerán aquí una vez agregadas en el panel administrativo.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de Filtros por Categoría y Buscador */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {/* Tabs de Categorías */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setActiveCategoryId("all")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeCategoryId === "all"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryId === cat.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Buscador de Recursos */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en recomendaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Cuadrícula o Estado Vacío de Búsqueda */}
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-14 bg-slate-50 dark:bg-[#0B1528]/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No hay recomendaciones con estos filtros
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Prueba seleccionando otra categoría o borrando la búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-blue-900/40 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md dark:shadow-md dark:hover:shadow-blue-900/20"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        {rec.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 text-[10px] font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Destacado
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {rec.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                        {rec.description}
                      </p>

                      {/* Etiquetas / Tags */}
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 text-[10px] border border-slate-200 dark:border-slate-800"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botón de Enlace Externo */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white dark:bg-slate-900 dark:hover:bg-blue-600 dark:text-slate-200 dark:hover:text-white transition border border-slate-200 hover:border-blue-600 dark:border-slate-800 dark:hover:border-blue-500 group"
                      >
                        <span>Visitar Recurso</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 group-hover:text-white transition-colors" />
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
