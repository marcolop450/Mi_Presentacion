import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendationsSection from "@/components/RecommendationsSection";
import { getCategories, getRecommendations } from "@/lib/services/recommendations";

export const revalidate = 60;

export default async function RecursosPage() {
  const [categories, recommendations] = await Promise.all([
    getCategories(),
    getRecommendations(),
  ]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <RecommendationsSection
          categories={categories}
          initialRecommendations={recommendations}
        />
      </main>
      <Footer />
    </div>
  );
}
