import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import ProfileCard from "@/components/ProfileCard";
import AuxiliariesSection from "@/components/AuxiliariesSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import Footer from "@/components/Footer";
import { getSocialLinks } from "@/lib/services/socialLinks";
import { getCategories, getRecommendations } from "@/lib/services/recommendations";
import { getAuxiliaries } from "@/lib/services/auxiliaries";

export const revalidate = 60; // Regeneración estática incremental (ISR) cada 60 segundos

export default async function HomePage() {
  const [socialLinks, categories, recommendations, auxiliaries] = await Promise.all([
    getSocialLinks(),
    getCategories(),
    getRecommendations(),
    getAuxiliaries(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060B14] flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <HeroBanner />
        <AuxiliariesSection auxiliaries={auxiliaries} />
        <RecommendationsSection
          categories={categories}
          initialRecommendations={recommendations}
        />
        <ProfileCard socialLinks={socialLinks} />
      </main>
      <Footer />
    </div>
  );
}
