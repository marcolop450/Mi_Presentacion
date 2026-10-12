import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";
import { getSocialLinks } from "@/lib/services/socialLinks";

export const revalidate = 60;

export default async function SobreMiPage() {
  const socialLinks = await getSocialLinks();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        <ProfileCard socialLinks={socialLinks} />
      </main>
      <Footer />
    </div>
  );
}
