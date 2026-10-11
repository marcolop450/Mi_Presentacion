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
  BookOpen,
  Terminal
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
    <section id="recomendaciones" className="py-20 relative border-t border-slate-200/80 dark:border-blue-950/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-blue-950/60">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>NEXUS // RECURSOS DE INGENIERÍA & IA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Recomendaciones Curadas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md font-sans">
            Herramientas web, canales de divulgación científica, papers y librerías modernas de IA seleccionadas.
          </p>
        </div>

        {/* Si no hay recomendaciones registradas */}
        {initialRecommendations.length === 0 ? (
          <div className="text-center py-20 cyber-glass rounded-3xl p-8 max-w-lg mx-auto shadow-xl border border-slate-200 dark:border-blue-900/40">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-600 dark:text-cyan-400">
              <Bookmark className="w-8 h-8 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold block mb-1">
              [ REPOSITORIO CURADO EN CONFIGURACIÓN ]
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
              Aún no hay recomendaciones registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Las recomendaciones seleccionadas por categoría (Web, Clases, Canales de YouTube e IA) aparecerán aquí una vez agregadas en el panel administrativo.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de Filtros por Categoría y Buscador */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              {/* Tabs de Categorías */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono">
                <button
                  onClick={() => setActiveCategoryId("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeCategoryId === "all"
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  [ TODAS ]
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryId === cat.id
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                        : "bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Buscador de Recursos */}
              <div className="relative w-full md:w-72 font-mono">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="> filtrar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
                  data-testid="recommendations-search"
                />
              </div>
            </div>

            {/* Cuadrícula de Tarjetas de Recomendaciones */}
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-14 cyber-glass rounded-2xl p-8 border border-slate-200 dark:border-slate-800 font-mono">
                <Terminal className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron recursos con este criterio
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  // Modifica el término de búsqueda o selecciona otra categoría
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="cyber-glass rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-cyan-500/10 border border-slate-200 dark:border-blue-900/40 hover:border-cyan-500/50 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {rec.is_featured ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-[10px] font-mono font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            DESTACADO
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-cyan-600 dark:text-cyan-400">
                            // RECURSO
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                        {rec.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                        {rec.description}
                      </p>

                      {/* Etiquetas / Tags */}
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-slate-800"
                            >
                              <Tag className="w-2.5 h-2.5 text-cyan-500" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botón de Enlace Externo */}
                    <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-50 hover:bg-cyan-500 text-slate-800 hover:text-slate-950 dark:bg-slate-900 dark:hover:bg-cyan-400 dark:text-slate-200 dark:hover:text-slate-950 transition border border-slate-200 hover:border-cyan-400 dark:border-slate-800 dark:hover:border-cyan-400 group/btn"
                      >
                        <span>$ abrir-recurso</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
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
