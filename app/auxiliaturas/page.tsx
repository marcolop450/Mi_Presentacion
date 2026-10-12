import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuxiliariesSection from "@/components/AuxiliariesSection";
import { getAuxiliaries } from "@/lib/services/auxiliaries";

export const revalidate = 60;

export default async function AuxiliaturasPage() {
  const auxiliaries = await getAuxiliaries();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <AuxiliariesSection auxiliaries={auxiliaries} />
      </main>
      <Footer />
    </div>
  );
}
