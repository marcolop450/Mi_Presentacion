"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Category, Recommendation } from "@/types/database";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Tag,
  Globe,
  Youtube,
  Cpu,
  BookOpen,
  Compass,
  Layers,
  Inbox,
} from "lucide-react";
import InitialsAvatar from "@/components/InitialsAvatar";

interface CategoryDetailViewProps {
  category: Category;
  recommendations: Recommendation[];
}

export default function CategoryDetailView({
  category,
  recommendations,
}: CategoryDetailViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lista de todas las etiquetas únicas presentes en esta categoría
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    recommendations.forEach((r) => {
      r.tags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [recommendations]);

  // Filtrado de recursos
  const filteredRecs = useMemo(() => {
    return recommendations.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)));

      const matchTag =
        selectedTag === "all" ||
        (r.tags && r.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

      return matchSearch && matchTag;
    });
  }, [recommendations, searchTerm, selectedTag]);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "enlace web";
    }
  };

  const getCategoryIcon = (slug?: string) => {
    if (!slug) return <Compass className="w-5 h-5 text-teal-500" />;
    const s = slug.toLowerCase();
    if (s.includes("web") || s.includes("dev") || s.includes("programacion"))
      return <Globe className="w-5 h-5 text-teal-500" />;
    if (s.includes("youtube") || s.includes("video") || s.includes("canal"))
      return <Youtube className="w-5 h-5 text-teal-500" />;
    if (s.includes("ia") || s.includes("ai") || s.includes("inteligencia"))
      return <Cpu className="w-5 h-5 text-teal-500" />;
    return <BookOpen className="w-5 h-5 text-teal-500" />;
  };

  return (
    <section className="pt-4 sm:pt-6 pb-10 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navegación y Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-teal-900/50">
          <Link
            href="/recursos"
            className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-200 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a todas las categorías</span>
          </Link>

          <nav aria-label="Miga de pan" className="text-xs text-slate-500 dark:text-teal-300/70 font-mono flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-teal-500 transition">Inicio</Link>
            <span>/</span>
            <Link href="/recursos" className="hover:text-teal-500 transition">Recursos</Link>
            <span>/</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">{category.name}</span>
          </nav>
        </div>

        {/* Ficha Principal de la Categoría */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs backdrop-blur-xs">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="p-3 sm:p-4 rounded-2xl bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border border-teal-200 dark:border-teal-800 shrink-0">
              {getCategoryIcon(category.slug)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-teal-100 text-teal-900 dark:bg-teal-950/90 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Categoría
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-teal-300/80">
                  {recommendations.length} {recommendations.length === 1 ? "recurso registrado" : "recursos registrados"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                {category.name}
              </h1>

              {category.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/80 mt-2 leading-relaxed max-w-[75ch]">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda en esta Categoría */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 shadow-xs space-y-4 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Buscador */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-teal-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Buscar en ${category.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/90 dark:bg-teal-950/60 border border-slate-300 dark:border-teal-800/80 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-teal-400/50 focus:outline-none focus:border-teal-500 transition"
              />
            </div>

            <span className="text-xs text-slate-500 dark:text-teal-300/70 font-mono">
              Mostrando {filteredRecs.length} de {recommendations.length} recursos
            </span>
          </div>

          {/* Tags Chips si existen */}
          {allTags.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-teal-900/40 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer ${
                  selectedTag === "all"
                    ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                    : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                }`}
              >
                Todas las etiquetas
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition shadow-2xs cursor-pointer ${
                    selectedTag.toLowerCase() === tag.toLowerCase()
                      ? "bg-teal-600 text-white shadow-teal-600/25 scale-[1.02]"
                      : "bg-white dark:bg-teal-950/60 text-slate-700 dark:text-teal-200/80 border border-slate-300 dark:border-teal-900/60 hover:bg-slate-100 dark:hover:bg-teal-900"
                  }`}
                >
                  #{tag.replace(/^#/, "")}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listado de Tarjetas Verticales Responsivas (Estilo Image 4) */}
        {filteredRecs.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-900/60 text-center space-y-3 shadow-xs">
            <Inbox className="w-8 h-8 text-teal-400 mx-auto" />
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">
              No se encontraron recursos en esta categoría
            </h3>
            <p className="text-xs text-slate-500 dark:text-teal-200/70">
              Prueba cambiando el término de búsqueda o limpiando las etiquetas.
            </p>
            {(searchTerm || selectedTag !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTag("all");
                }}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition cursor-pointer"
              >
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredRecs.map((rec) => {
              const isCopied = copiedId === rec.id;

              return (
                <div
                  key={rec.id}
                  className="w-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-300 shadow-xs hover:shadow-md hover:shadow-teal-500/10 backdrop-blur-xs group"
                >
                  <div className="space-y-4">
                    {/* Fila Superior de Badges: Categoría + Destacado */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950/90 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80">
                        {getCategoryIcon(category.slug)}
                        <span className="truncate max-w-[150px]">{category.name}</span>
                      </span>

                      {rec.is_featured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[11px] font-bold bg-amber-100/80 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/80">
                          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          <span>Destacado</span>
                        </span>
                      )}
                    </div>

                    {/* Logo + Título Limpio (Estilo Image 4: Avatar y nombre directo sin duplicados) */}
                    <div className="flex items-center gap-3.5 pt-1">
                      <InitialsAvatar src={rec.image_url} name={rec.title} size="md" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                          {rec.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-teal-300/70 block truncate">
                          {getDomain(rec.url)}
                        </span>
                      </div>
                    </div>

                    {/* Descripción con espaciado amplio y cómodo */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-teal-100/75 leading-relaxed">
                      {rec.description}
                    </p>

                    {/* Etiquetas con formato #hashtag */}
                    {rec.tags && rec.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rec.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 rounded-xl bg-slate-100 text-teal-900 dark:bg-teal-950/70 dark:text-teal-300 text-[11px] font-mono font-medium border border-slate-200 dark:border-teal-800/60"
                          >
                            #{tag.replace(/^#/, "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acciones de la Tarjeta */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-teal-900/50 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(rec.url, rec.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-teal-200 hover:bg-slate-100 dark:hover:bg-teal-950/70 border border-slate-300 dark:border-teal-800/50 transition cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-teal-400" />
                          <span>Copiar enlace</span>
                        </>
                      )}
                    </button>

                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs hover:shadow-teal-700/20 transition group/btn"
                    >
                      <span>Abrir Recurso</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
