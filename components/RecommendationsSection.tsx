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
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Share2,
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname.replace(/^www\./, "");
      return hostname;
    } catch {
      return "enlace web";
    }
  };

  const getCategoryIcon = (categorySlug?: string) => {
    if (!categorySlug) return <Compass className="w-3.5 h-3.5" />;
    if (categorySlug.includes("web") || categorySlug.includes("dev")) return <Globe className="w-3.5 h-3.5" />;
    if (categorySlug.includes("youtube") || categorySlug.includes("video")) return <Youtube className="w-3.5 h-3.5" />;
    if (categorySlug.includes("ia") || categorySlug.includes("ai")) return <Cpu className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-teal-500/15 dark:border-teal-400/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800/80 text-teal-700 dark:text-teal-300 text-xs font-mono font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEXUS // RECURSOS &amp; IA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Recursos y Recomendaciones
            </h1>
            <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2 max-w-[65ch]">
              Herramientas de desarrollo, canales científicos, papers y librerías modernas de IA seleccionadas.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/60 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/50 text-xs font-medium text-slate-600 dark:text-teal-200/80 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Curaduría Especializada</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span>Verificada</span>
          </div>
        </div>

        {/* Estado inicial sin recomendaciones */}
        {initialRecommendations.length === 0 ? (
          <div className="text-center py-16 rounded-3xl p-8 max-w-md mx-auto border border-teal-200/80 dark:border-teal-900/60 bg-white/80 dark:bg-[#0a2026]/80 backdrop-blur-sm shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-300">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
              Aún no hay recomendaciones registradas
            </h3>
            <p className="text-xs text-slate-500 dark:text-teal-200/70 mt-2 leading-relaxed">
              Las recomendaciones seleccionadas aparecerán aquí una vez agregadas en el panel administrativo.
            </p>
          </div>
        ) : (
          <>
            {/* Controles: Categorías (Pills redondeadas) y Buscador */}
            <div className="p-4 sm:p-5 rounded-3xl mb-8 bg-white/70 dark:bg-[#081e19]/70 border border-teal-200/80 dark:border-teal-900/60 shadow-xs backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Pills de Categoría */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveCategoryId("all")}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                      activeCategoryId === "all"
                        ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                        : "bg-teal-50/60 dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-teal-200/80 dark:border-teal-900/60 hover:bg-teal-100 dark:hover:bg-teal-900"
                    }`}
                  >
                    Todas ({initialRecommendations.length})
                  </button>
                  {categories.map((cat) => {
                    const countInCat = initialRecommendations.filter(r => r.category_id === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryId(cat.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs ${
                          activeCategoryId === cat.id
                            ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                            : "bg-teal-50/60 dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-teal-200/80 dark:border-teal-900/60 hover:bg-teal-100 dark:hover:bg-teal-900"
                        }`}
                      >
                        {getCategoryIcon(cat.slug)}
                        <span>{cat.name} ({countInCat})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Buscador */}
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar por nombre o etiqueta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-teal-600/50 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
                    data-testid="recommendations-search"
                  />
                </div>
              </div>

              {/* Indicador de conteo */}
              <div className="mt-3 pt-3 border-t border-teal-200/40 dark:border-teal-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-teal-300/70">
                <span>
                  Mostrando <strong>{filteredRecommendations.length}</strong> de <strong>{initialRecommendations.length}</strong> recursos disponibles
                </span>
                {(searchTerm || activeCategoryId !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategoryId("all");
                    }}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Restablecer vista
                  </button>
                )}
              </div>
            </div>

            {/* Listado de Tarjetas o Estado Vacío */}
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12 rounded-3xl p-6 border border-teal-200/80 dark:border-teal-900/60 bg-white/80 dark:bg-[#0a2026]/80 max-w-md mx-auto">
                <Inbox className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                  No se encontraron recursos
                </h3>
                <p className="text-xs text-slate-500 dark:text-teal-200/60 mt-1">
                  Prueba cambiando los términos de búsqueda o seleccionando otra categoría.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-white/70 dark:bg-[#081e19]/80 border border-teal-200/80 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-teal-500/5 backdrop-blur-xs"
                  >
                    <div>
                      {/* Cabecera de la Tarjeta con Badges Detallados */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300 font-semibold px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60">
                          {getDomain(rec.url)}
                        </span>

                        {rec.is_featured && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/80">
                            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Destacado</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
                        {rec.title}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-teal-100/70 mt-2.5 leading-relaxed">
                        {rec.description}
                      </p>

                      {/* Etiquetas / Tags */}
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {rec.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-50/80 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 text-[11px] font-mono border border-teal-200/60 dark:border-teal-800/60"
                            >
                              <Tag className="w-2.5 h-2.5 text-teal-500" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="mt-6 pt-4 border-t border-teal-100 dark:border-teal-900/50 flex items-center gap-2">
                      <a
                        href={rec.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 flex-1 px-5 py-2.5 rounded-2xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all hover:scale-[1.01]"
                      >
                        <span>Abrir Recurso</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleCopyLink(rec.url, rec.id)}
                        title="Copiar enlace"
                        className="p-2.5 rounded-2xl bg-teal-50/70 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-200/60 dark:border-teal-800/60 text-slate-600 dark:text-teal-300 transition"
                      >
                        {copiedId === rec.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
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
