"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, ArrowRight, Sparkles } from "lucide-react";
import type { Fragment } from "@/lib/types";

interface KineticMarginaliaProps {
  snippets: Fragment[];
  onViewAll: () => void;
  onLike: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
}

export function KineticMarginalia({
  snippets,
  onViewAll,
  onLike,
  highlightedTexts,
  onHighlight,
}: KineticMarginaliaProps) {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const handleLikeClick = (id: string) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
    onLike();
  };

  const handleTextClick = (text: string) => {
    if (!highlightedTexts.has(text)) {
      onHighlight(text);
    }
  };

  return (
    <section className="bg-stone-100 dark:bg-zinc-900 py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 font-serif text-[clamp(80px,20vw,200px)] font-black text-[#1c1917] dark:text-white leading-none">
          思
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-2 block">
              (03)
            </span>
            <h2 className="font-serif text-[clamp(32px,6vw,64px)] md:text-[5vw] leading-[0.9] text-[#1c1917] dark:text-white uppercase font-bold">
              Thoughts
            </h2>
            <p className="text-[#78716c] dark:text-white/40 font-mono text-sm mt-4 max-w-md">
              여백에 남긴 짤막한 생각들과 기술적 단상들
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="group flex items-center gap-2 px-6 py-3 bg-kinetic-orange text-black font-mono text-xs uppercase font-bold hover:bg-white transition-all duration-300"
          >
            View All Threads
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-[-45deg]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {snippets.slice(0, 4).map((snippet, index) => {
            const isLiked = likedIds.includes(snippet.id);
            const isHighlighted = highlightedTexts.has(snippet.content);

            return (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-[#f4f1ea] dark:bg-black border border-[#1c1917]/10 dark:border-white/10 p-6 cursor-pointer transition-all duration-300 hover:border-kinetic-orange"
              >
                <div className="flex flex-col h-full min-h-[180px]">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-kinetic-orange text-xs uppercase tracking-wider">
                      {snippet.date}
                    </span>
                    <AnimatePresence>
                      {isLiked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-1 text-kinetic-orange"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span className="text-[10px] font-bold">+5</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    onClick={() => handleTextClick(snippet.content)}
                    className="flex-1 mb-4"
                  >
                    <p
                      className={`text-[#1c1917]/80 dark:text-white/80 text-base leading-relaxed transition-all duration-300 ${
                        isHighlighted
                          ? "bg-kinetic-orange/20 -mx-2 px-2 py-1"
                          : "group-hover:text-[#1c1917] dark:group-hover:text-white"
                      }`}
                    >
                      {snippet.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {snippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#78716c] dark:text-white/40 border border-[#1c1917]/10 dark:border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[#1c1917]/10 dark:border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(snippet.id);
                      }}
                      className={`flex items-center gap-1 transition-all duration-300 ${
                        isLiked
                          ? "text-kinetic-orange scale-110"
                          : "text-[#1c1917]/30 dark:text-white/30 hover:text-kinetic-orange"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isLiked ? "fill-kinetic-orange" : ""}`}
                      />
                      {isLiked && (
                        <span className="text-xs font-mono">1</span>
                      )}
                    </button>
                    <button className="text-[#1c1917]/30 dark:text-white/30 hover:text-[#1c1917] dark:hover:text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
