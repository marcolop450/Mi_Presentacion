import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import MouseFollower from "@/components/MouseFollower";
import AnimatedBackground from "@/components/AnimatedBackground";

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
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('kiris-theme');
                var isDark = storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#060B14] dark:text-white min-h-screen antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 relative">
        <ThemeProvider>
          <AnimatedBackground />
          <MouseFollower />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
