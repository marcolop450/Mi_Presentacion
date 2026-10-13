import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryDetailView from "@/components/CategoryDetailView";
import { getCategories, getRecommendations } from "@/lib/services/recommendations";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();

  const categories = await getCategories();

  // Buscar categoría por slug
  const category = categories.find(
    (c) => c.slug.toLowerCase() === normalizedSlug || c.id === normalizedSlug
  );

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#07191d]/90 border border-slate-300 dark:border-teal-800/60 max-w-md w-full shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
              Categoría no encontrada
            </h2>
            <p className="text-xs text-slate-600 dark:text-teal-200/70 mt-2 leading-relaxed">
              No se encontró una categoría activa con el identificador <strong>{normalizedSlug}</strong>.
            </p>
            <div className="mt-6">
              <Link
                href="/recursos"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Catálogo de Recursos</span>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Obtener recomendaciones de esta categoría
  const recommendations = await getRecommendations(category.id);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <CategoryDetailView category={category} recommendations={recommendations} />
      </main>
      <Footer />
    </div>
  );
}
