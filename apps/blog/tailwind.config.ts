import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // Design token system for consistent grayscale branding
      colors: {
        // Semantic color aliases that map to your grayscale scheme
        brand: {
          primary: "var(--primary)",
          secondary: "var(--secondary)",
          accent: "var(--accent)",
        },
        // Restrict usage to approved color palette
        gray: {
          50: "rgb(249 250 251)",
          100: "rgb(243 244 246)", 
          200: "rgb(229 231 235)",
          300: "rgb(209 213 219)",
          400: "rgb(156 163 175)",
          500: "rgb(107 114 128)",
          600: "rgb(75 85 99)",
          700: "rgb(55 65 81)",
          800: "rgb(31 41 55)",
          900: "rgb(17 24 39)",
        }
      },
      // Typography scale following your existing patterns
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'section': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      // Consistent spacing system
      spacing: {
        'section': '3rem',
        'card': '1.5rem',
        'element': '1rem',
      }
    },
  },
  plugins: [typography],
};

export default config;
