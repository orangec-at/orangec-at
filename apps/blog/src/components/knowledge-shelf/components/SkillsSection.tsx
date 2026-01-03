"use client";

import React from "react";
import { motion } from "framer-motion";

import type { ThemeMode } from "../types";

interface SkillsSectionProps {
  theme: ThemeMode;
}

const CATEGORIES = [
  { name: "Languages", items: ["TypeScript", "JavaScript", "Python", "Rust"] },
  { name: "Frontend", items: ["React", "Next.js", "Tailwind", "Framer Motion"] },
  { name: "Backend", items: ["Node.js", "GraphQL", "PostgreSQL", "Docker"] },
  { name: "Tools", items: ["Git", "AWS", "Vercel", "Figma"] },
] as const;

export const SkillsSection: React.FC<SkillsSectionProps> = ({ theme }) => {
  const isDark = theme === "dark";

  return (
    <section
      className={`py-32 transition-colors duration-500 overflow-hidden ${
        isDark ? "bg-[#121212]" : "bg-stone-900"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col lg:flex-row border ${isDark ? "border-red-950" : "border-stone-700"}`}>
          <div
            className={`lg:w-20 border-r p-6 flex lg:items-center justify-center ${
              isDark ? "bg-red-950/20 border-red-900" : "bg-stone-800 border-stone-700"
            }`}
          >
            <span
              className={`lg:rotate-180 font-serif italic tracking-widest text-sm ${
                isDark ? "text-red-700" : "text-stone-500"
              }`}
              style={{ writingMode: "vertical-rl" }}
            >
              TECHNICAL STACKS & TOOLS
            </span>
          </div>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 border-b md:border-b-0 group relative overflow-hidden ${
                  isDark ? "border-red-950" : "border-stone-700"
                } ${idx !== 3 ? "md:border-r" : ""}`}
              >
                <div
                  className={`absolute top-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full group-hover:bg-red-500 transition-colors ${
                    isDark ? "bg-red-900/50" : "bg-stone-700"
                  }`}
                />

                <h4
                  className={`text-xs tracking-[0.3em] uppercase mb-10 font-bold group-hover:text-white transition-colors ${
                    isDark ? "text-red-800" : "text-stone-500"
                  }`}
                >
                  {cat.name}
                </h4>
                <ul className="space-y-4">
                  {cat.items.map((item) => (
                    <motion.li
                      key={item}
                      whileHover={{ x: 5, color: "#fff" }}
                      className="text-stone-400 font-light flex items-center gap-3 cursor-default"
                    >
                      <span className={`w-1 h-1 rounded-full ${isDark ? "bg-red-900" : "bg-stone-600"}`} />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <span
                  className={`absolute bottom-4 right-6 text-6xl font-serif italic pointer-events-none opacity-10 transition-opacity group-hover:opacity-20 ${
                    isDark ? "text-red-900" : "text-stone-500"
                  }`}
                >
                  0{idx + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
