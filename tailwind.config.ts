import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#EBF4F6",
        foreground: "#111827",
        border: "#C4DDE3",
        input: "#C4DDE3",
        ring: "#088395",

        primary: {
          DEFAULT: "#09637E",
          foreground: "#FFFFFF",
          50: "#EBF4F6",
          100: "#C4DDE3",
          200: "#7AB2B2",
          500: "#09637E",
          600: "#088395",
          700: "#065F73",
        },
        accent: {
          DEFAULT: "#088395",
          foreground: "#FFFFFF",
          50: "#EBF4F6",
          100: "#C4DDE3",
          200: "#7AB2B2",
          500: "#088395",
          600: "#09637E",
        },
        warning: {
          DEFAULT: "#D97706",
          foreground: "#FFFFFF",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          500: "#D97706",
          600: "#B45309",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
          50: "#FEF2F2",
          100: "#FEE2E2",
          500: "#DC2626",
          600: "#B91C1C",
        },
        muted: {
          DEFAULT: "#D6EBEF",
          foreground: "#374151",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        secondary: {
          DEFAULT: "#D6EBEF",
          foreground: "#09637E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "card-lg":
          "0 10px 30px 0 rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.06)",
        focus: "0 0 0 3px rgba(8,131,149,0.18)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
