"use client";

import React from "react";
import { motion } from "framer-motion";

import type { ThemeMode } from "../types";

interface HeroProps {
  onSearchOpen: () => void;
  onAdminSecret?: () => void;
  theme: ThemeMode;
}

export const Hero: React.FC<HeroProps> = ({ onSearchOpen, onAdminSecret, theme }) => {
  const isDark = theme === "dark";
  const particles = Array.from({ length: 20 });

  return (
    <section
      className={`relative min-h-screen flex items-center overflow-hidden border-b-8 transition-colors duration-700 ${
        isDark ? "bg-[#121212] border-stone-100" : "bg-[#f4f1ea] border-stone-800"
      }`}
    >
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0.1,
          }}
          animate={{
            y: ["-10%", "110%"],
            x: ["0%", (Math.random() - 0.5) * 20 + "%"],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundColor: isDark ? "#fff" : "#000" }}
        />
      ))}

      <div
        className={`container mx-auto px-4 min-h-[calc(100vh-5rem)] flex flex-col md:flex-row border-x relative z-10 ${
          isDark ? "border-stone-800" : "border-stone-300"
        }`}
      >
        <div
          className={`flex-1 border-b md:border-b-0 md:border-r p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative ${
            isDark ? "border-stone-800" : "border-stone-300"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-serif italic text-base sm:text-lg mb-4 block text-stone-500"
            >
              {isDark ? "Midnight Protocol: Active" : "Volume I: The Beginning"}
            </motion.span>
            <h1
              className={`text-5xl sm:text-6xl lg:text-8xl font-serif font-bold leading-[0.9] mb-8 select-none ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              The <br />
              <motion.span
                animate={{
                  color: isDark
                    ? ["#fff", "#991b1b", "#fff"]
                    : ["#1c1917", "#a8a29e", "#1c1917"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="italic"
              >
                Archivist&apos;s
              </motion.span>{" "}
              <br />
              Logs
              <span
                onClick={onAdminSecret}
                className={`cursor-default transition-colors ${
                  isDark ? "hover:text-red-900/40" : "hover:text-red-900/10"
                }`}
                title="Secret Entrance"
              >
                .
              </span>
            </h1>
            <p
              className={`max-w-md font-light leading-relaxed mb-10 text-sm sm:text-base ${
                isDark ? "text-stone-400" : "text-stone-600"
              }`}
            >
              지식은 쌓이는 것이 아니라 정리되는 것입니다. 코드와 철학, 그리고 기록이 공존하는 개인 도서관에 오신 것을 환영합니다.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearchOpen}
              className={`px-8 py-3 uppercase tracking-widest text-[10px] sm:text-xs transition-colors shadow-2xl ${
                isDark
                  ? "bg-stone-100 text-stone-900 hover:bg-white"
                  : "bg-stone-900 text-stone-100 hover:bg-stone-700"
              }`}
            >
              Explore Stacks
            </motion.button>
          </motion.div>

          <div
            className={`absolute bottom-0 left-0 right-0 h-[1px] md:h-[2px] ${
              isDark ? "bg-stone-800" : "bg-stone-300"
            }`}
          />
        </div>

        <div className="flex-1 grid grid-cols-2 grid-rows-2 min-h-[400px] md:min-h-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onSearchOpen}
            className={`border-b p-6 sm:p-8 flex flex-col justify-end group cursor-pointer transition-colors overflow-hidden ${
              isDark ? "border-stone-800 hover:bg-red-950/20" : "border-stone-300 hover:bg-white"
            }`}
          >
            <motion.div
              className={`w-12 h-1 mb-4 transition-all group-hover:w-20 ${
                isDark ? "bg-red-900" : "bg-stone-800"
              }`}
            />
            <h3
              className={`font-serif italic text-xl sm:text-2xl ${
                isDark ? "text-stone-300" : "text-stone-900"
              }`}
            >
              Visual Archive
            </h3>
            <p className="text-[10px] tracking-widest text-stone-500 uppercase mt-2">
              012 Entries
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`border-b border-l p-6 sm:p-8 flex items-center justify-center overflow-hidden ${
              isDark ? "border-stone-800" : "border-stone-300"
            }`}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`w-24 h-24 sm:w-32 sm:h-32 border border-dashed rounded-full flex items-center justify-center text-[8px] sm:text-[10px] tracking-widest text-center uppercase p-4 ${
                isDark ? "border-stone-700 text-stone-600" : "border-stone-400 text-stone-400"
              }`}
            >
              Continuous Learning
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`p-6 sm:p-8 flex flex-col justify-center items-center group cursor-pointer transition-all duration-500 ${
              isDark ? "hover:bg-red-950 hover:text-white" : "hover:bg-stone-900 hover:text-white"
            }`}
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-3xl sm:text-4xl font-serif mb-2"
            >
              3.4k
            </motion.span>
            <span className="text-[8px] sm:text-[10px] tracking-tighter uppercase opacity-60">
              Lines Authored
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`border-l p-0 relative group overflow-hidden ${
              isDark ? "border-stone-800" : "border-stone-300"
            }`}
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop"
              className="w-full h-full object-cover transition-all duration-1000 grayscale opacity-40 group-hover:opacity-80"
              alt="Books"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={`backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[10px] tracking-[0.3em] uppercase border shadow-xl transition-colors ${
                  isDark
                    ? "bg-stone-900/90 border-stone-800 text-stone-300"
                    : "bg-white/90 border-stone-200 text-stone-800"
                }`}
              >
                Latest Read
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
