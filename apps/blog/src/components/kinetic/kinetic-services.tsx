"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  title: string;
  tags: string[];
}

interface KineticServicesProps {
  title?: string;
  services?: Service[];
}

const DEFAULT_SERVICES: Service[] = [
  { title: "Frontend", tags: ["React", "TypeScript", "Next.js", "React Native"] },
  { title: "Architecture", tags: ["Design System", "Monorepo", "SSO", "Cloud"] },
  { title: "Product", tags: ["User Research", "Analytics", "A/B Testing"] },
  { title: "AI Integration", tags: ["LLM", "RAG", "Claude", "Automation"] },
];

function ServiceCard({
  number,
  title,
  tags,
  index,
}: {
  number: string;
  title: string;
  tags: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group border-t border-[#1c1917]/20 dark:border-white/20 py-6 md:py-8 hover:bg-[#1c1917]/5 dark:hover:bg-white/5 transition-colors duration-500 cursor-pointer"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-8">
        <div className="font-mono text-kinetic-orange text-lg md:text-xl">
          ({number})
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-[#1c1917] dark:text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
            {title}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 border border-[#1c1917]/30 dark:border-white/30 rounded-full text-[#78716c] dark:text-white/60 font-mono text-xs md:text-sm uppercase group-hover:border-kinetic-orange group-hover:text-kinetic-orange transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="md:self-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="w-10 h-10 md:w-12 md:h-12 text-kinetic-orange transform group-hover:rotate-45 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
}

export function KineticServices({
  title = "Services",
  services = DEFAULT_SERVICES,
}: KineticServicesProps) {
  return (
    <section className="bg-[#f4f1ea] dark:bg-black py-12 md:py-16 relative">
      <div className="container mx-auto px-4 mb-10 md:mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-2 block">
            (01)
          </span>
          <h2 className="font-serif text-[clamp(32px,6vw,64px)] md:text-[5vw] leading-[0.9] text-[#1c1917] dark:text-white uppercase font-bold">
            {title}
          </h2>
        </div>
        <Star
          className="w-10 h-10 md:w-12 md:h-12 text-kinetic-orange animate-pulse"
          fill="currentColor"
        />
      </div>

      <div className="flex flex-col">
        {services.map((s, i) => (
          <ServiceCard
            key={i}
            number={`0${i + 1}`}
            title={s.title}
            tags={s.tags}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
