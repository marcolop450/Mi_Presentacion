import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        kiris: {
          bg: "#060B14",
          surface: "#0B1528",
          card: "#0E1A33",
          border: "#1E2F52",
          borderHighlight: "#2B4780",
          primary: "#00A3FF",
          primaryDark: "#0077C8",
          accent: "#38BDF8",
          cyan: "#06B6D4",
          slate: "#94A3B8",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
