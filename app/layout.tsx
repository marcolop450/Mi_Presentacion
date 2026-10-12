import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import MouseFollower from "@/components/MouseFollower";
import AnimatedBackground from "@/components/AnimatedBackground";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

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
      <body className="bg-[#dff0fa] text-slate-900 dark:bg-[#061317] dark:text-[#f0fdfa] min-h-screen antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200 relative flex flex-col">
        <ThemeProvider>
          {/* Transition loader for immediate feedback on navigation */}
          <Suspense fallback={null}>
            <RouteTransitionLoader />
          </Suspense>
          {/* Animated Background at z-0 */}
          <AnimatedBackground />
          <MouseFollower />
          {/* Content layer above the animated background */}
          <div className="relative z-10 flex flex-col flex-grow w-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
