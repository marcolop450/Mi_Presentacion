import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import MouseFollower from "@/components/MouseFollower";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata: Metadata = {
  title: "KIRIS | Innovación en Razonamiento e Inteligencia de Sistemas",
  description: "Plataforma oficial de KIRIS - Inteligencia Artificial para el día a día. Recursos, auxiliaturas académicas y recomendaciones seleccionadas por Marco Alejandro Lopez Velasquez.",
  icons: {
    icon: "/images/logo_kiris.svg",
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

                // Sary-OS inspired hardware-aware performance profile
                var weak = (navigator.deviceMemory && navigator.deviceMemory <= 4)
                        || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
                if (weak) {
                  document.documentElement.classList.add('perf-lite');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#060B14] dark:text-white min-h-screen antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200 relative flex flex-col">
        <ThemeProvider>
          <AnimatedBackground />
          <MouseFollower />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
