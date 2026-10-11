import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIRIS | Innovación en Razonamiento e Inteligencia de Sistemas",
  description: "Plataforma oficial de KIRIS - Inteligencia Artificial para el día a día. Recursos, auxiliaturas académicas y recomendaciones seleccionadas por Marco Alejandro Lopez Velasquez.",
  icons: {
    icon: "/images/logo_kiris.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#060B14] text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
