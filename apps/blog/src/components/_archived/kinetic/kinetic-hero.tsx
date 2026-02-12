"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Globe } from "lucide-react";

interface KineticHeroProps {
  title?: string;
  subtitle?: string;
  location?: string;
  role?: string;
}

export function KineticHero({
  title = "Orange\nCat",
  subtitle = "Product-minded Frontend Developer",
  location = "Seoul, Korea",
  role = "Frontend Developer\nSince 2019",
}: KineticHeroProps) {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const titleLines = title.split("\n");

  return (
    <section className="relative bg-[#f4f1ea] dark:bg-black flex flex-col justify-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="font-serif text-[clamp(40px,8vw,80px)] leading-[0.9] font-bold uppercase tracking-tight text-[#1c1917] dark:text-white text-center"
        >
          {titleLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center font-mono text-base md:text-lg text-[#78716c] dark:text-white/60 mt-6 uppercase tracking-widest"
        >
          {subtitle}
        </motion.p>

        <div className="flex flex-col md:flex-row justify-between items-end mt-8 border-t border-[#1c1917]/20 dark:border-white/10 pt-4">
          <div className="font-mono text-sm md:text-base font-medium uppercase text-[#1c1917] dark:text-white">
            <Globe className="inline mr-2 mb-1" />
            {location}
          </div>

          <motion.div
            style={{ rotate }}
            className="hidden md:flex items-center justify-center w-20 h-20 bg-[#1c1917] dark:bg-kinetic-orange rounded-full relative"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" width="100" height="100" className="w-full h-full">
                <path
                  id="curve"
                  d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
                  fill="transparent"
                />
                <text className="text-[9px] font-mono font-medium uppercase tracking-wider fill-white dark:fill-black">
                  <textPath href="#curve">Scroll Down * Scroll Down *</textPath>
                </text>
              </svg>
            </div>
            <ArrowDown className="text-white dark:text-black w-5 h-5" />
          </motion.div>

          <div className="font-mono text-sm md:text-base font-medium uppercase text-right whitespace-pre-line text-[#1c1917] dark:text-white">
            {role}
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[30vw] h-[30vw] bg-kinetic-orange rounded-full blur-[80px] opacity-10 pointer-events-none" />
    </section>
  );
}
