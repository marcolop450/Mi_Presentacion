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
      maxWidth: {
        page: "1400px",
      },
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          border: "var(--surface-border)",
        },
      },
      fontFamily: {
        sans: ["'Urbanist'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "'Urbanist'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      animation: {
        "mesh-drift": "mesh-drift 30s ease-in-out infinite alternate",
      },
      keyframes: {
        "mesh-drift": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2%, -1%) scale(1.02)" },
          "66%": { transform: "translate(-1%, 2%) scale(0.98)" },
          "100%": { transform: "translate(1%, -2%) scale(1.01)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
