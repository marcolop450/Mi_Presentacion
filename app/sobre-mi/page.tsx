import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { getSocialLinks } from "@/lib/services/socialLinks";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function SobreMiPage() {
  const socialLinks = await getSocialLinks();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060B14] flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
        <ProfileCard socialLinks={socialLinks} />
      </main>
      <Footer />
    </div>
  );
}
