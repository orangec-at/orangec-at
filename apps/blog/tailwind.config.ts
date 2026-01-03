import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      // Design token system for MUJI-inspired minimal aesthetic
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
        },
        // MUJI-inspired wood tones (warm neutrals)
        wood: {
          50: "rgb(250 249 246)",   // Very light warm white
          100: "rgb(245 242 237)",  // Light wood
          200: "rgb(235 230 222)",  // Soft beige
          300: "rgb(220 213 203)",  // Natural wood
          400: "rgb(195 185 172)",  // Medium wood
          500: "rgb(165 152 138)",  // Darker wood
          600: "rgb(140 125 110)",  // Rich wood
          700: "rgb(115 100 85)",   // Deep wood
          800: "rgb(90 75 60)",     // Dark wood
          900: "rgb(65 50 35)",     // Almost black wood
        },
        // Steel/metallic tones for accents
        steel: {
          50: "rgb(248 249 250)",
          100: "rgb(241 243 245)",
          200: "rgb(226 229 233)",
          300: "rgb(206 212 218)",
          400: "rgb(173 181 189)",
          500: "rgb(134 142 150)",
          600: "rgb(108 117 125)",
          700: "rgb(73 80 87)",
          800: "rgb(52 58 64)",
          900: "rgb(33 37 41)",
        }
      },
      // Typography scale following your existing patterns
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'section': ['1.875rem', { lineHeight: '1.2', fontWeight: '600' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      // MUJI-inspired systematic spacing (8px base unit)
      spacing: {
        'section': '4rem',      // 64px - Major sections
        'subsection': '3rem',   // 48px - Subsections
        'card': '2rem',         // 32px - Card padding
        'element': '1.5rem',    // 24px - Element spacing
        'tight': '1rem',        // 16px - Tight spacing
        'compact': '0.5rem',    // 8px - Compact spacing
        'grid-gap': '1.5rem',   // 24px - Grid gaps
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        handwriting: ['Architects Daughter', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/images/paper-texture.png')", // Fallback or utility usage
      },
    },
  },
  plugins: [
    typography,
    require("tailwindcss-animate") // Ensure this is installed for framer-motion/shadcn compatibility
  ],
};

export default config;
