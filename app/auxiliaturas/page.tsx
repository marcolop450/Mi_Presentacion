import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuxiliariesSection from "@/components/AuxiliariesSection";
import { getAuxiliaries } from "@/lib/services/auxiliaries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function AuxiliaturasPage() {
  const auxiliaries = await getAuxiliaries();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060B14] flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Página Principal</span>
          </Link>
        </div>
        <AuxiliariesSection auxiliaries={auxiliaries} />
      </main>
      <Footer />
    </div>
  );
}
