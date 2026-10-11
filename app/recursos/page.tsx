import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendationsSection from "@/components/RecommendationsSection";
import { getCategories, getRecommendations } from "@/lib/services/recommendations";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function RecursosPage() {
  const [categories, recommendations] = await Promise.all([
    getCategories(),
    getRecommendations(),
  ]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-6 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 hover:text-teal-900 dark:text-teal-300 dark:hover:text-white transition px-3 py-1.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
        <RecommendationsSection
          categories={categories}
          initialRecommendations={recommendations}
        />
      </main>
      <Footer />
    </div>
  );
}
