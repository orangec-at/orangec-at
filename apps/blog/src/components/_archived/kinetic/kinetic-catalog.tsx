"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, LayoutGrid, List, Search } from "lucide-react";
import type { Post } from "@/lib/types";

interface KineticCatalogProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onBack: () => void;
  onSearchOpen?: () => void;
}

export function KineticCatalog({
  posts,
  onPostClick,
  onBack,
  onSearchOpen,
}: KineticCatalogProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const toCatalogDate = (isoDate: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate.replace(/-/g, ".");
    return isoDate;
  };

  const toShortDate = (isoDate: string) => {
    const parsed = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase();
  };

  const getCategoryBadgeClasses = (category?: string) => {
    const base = "text-xs px-2 py-0.5 rounded-full font-medium";
    if (category === "case-study") {
      return `${base} bg-[#FF4D00]/10 text-[#FF4D00]`;
    }
    if (category === "technical") {
      return `${base} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`;
    }
    if (category === "insight") {
      return `${base} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300`;
    }
    return `${base} bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-200`;
  };

  const getCategoryLabel = (category?: string) => {
    if (category === "case-study") return "Case Study";
    if (category === "technical") return "Technical";
    if (category === "insight") return "Insight";
    return category ?? "Uncategorized";
  };

  return (
    <section className="min-h-screen bg-[#f4f1ea] dark:bg-black pt-32 pb-40">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.button
          onClick={onBack}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#78716c] dark:text-white/40 hover:text-kinetic-orange transition-all duration-300 mb-16"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2" />
          Back to Archive
        </motion.button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-stone-300 dark:border-white/10 pb-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-4 block">
              (01)
            </span>
            <h1 className="font-serif text-[clamp(48px,14vw,180px)] md:text-[10vw] lg:text-[8vw] leading-[0.85] text-[#1c1917] dark:text-white uppercase font-black">
              Full
              <br />
              <span className="text-kinetic-orange">Catalog</span>
            </h1>
            <p className="font-mono text-[#78716c] dark:text-white/40 text-sm uppercase tracking-widest mt-6">
              {posts.length} Articles • The Master Index
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <div className="flex bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-white/10 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-kinetic-orange text-black"
                    : "text-[#78716c] dark:text-white/40 hover:text-[#1c1917] dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-kinetic-orange text-black"
                    : "text-[#78716c] dark:text-white/40 hover:text-[#1c1917] dark:hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {onSearchOpen && (
              <button
                type="button"
                onClick={onSearchOpen}
                className="group p-3 bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-white/10 text-[#78716c] dark:text-white/40 hover:border-kinetic-orange hover:text-kinetic-orange transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1"
            >
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.5 }}
                  onClick={() => onPostClick(post)}
                  className="group relative bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-white/10 p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:bg-kinetic-orange min-h-[280px] flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-kinetic-orange text-[10px] uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                        Vol. {String(post.id).padStart(2, "0")}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-stone-400 dark:text-white/20 transition-all duration-300 group-hover:text-black group-hover:rotate-45 group-hover:scale-125" />
                    </div>

                    <h3 className="font-serif text-xl lg:text-2xl font-bold text-[#1c1917] dark:text-white leading-tight mb-4 flex-grow group-hover:text-black transition-colors duration-300">
                      {post.title}
                    </h3>

                    <div className="mt-auto pt-6 border-t border-stone-300 dark:border-white/10 group-hover:border-black/20 transition-colors duration-300">
                      <div className="flex justify-between items-center">
                        <span className={getCategoryBadgeClasses(post.category)}>
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className="font-mono text-[#78716c] dark:text-white/30 text-[9px] group-hover:text-black/50 transition-colors duration-300">
                          {toCatalogDate(post.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-1"
            >
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.4 }}
                  onClick={() => onPostClick(post)}
                  className="group relative bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-white/10 p-6 md:p-8 cursor-pointer transition-all duration-500 hover:bg-kinetic-orange"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6 md:gap-10 flex-1">
                      <span className="font-mono text-stone-400 dark:text-white/20 text-xs w-10 group-hover:text-black/40 transition-colors duration-300">
                        {String(post.id).padStart(2, "0")}
                      </span>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg md:text-xl font-bold text-[#1c1917] dark:text-white leading-tight truncate group-hover:text-black transition-colors duration-300">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className={getCategoryBadgeClasses(post.category)}>
                            {getCategoryLabel(post.category)}
                          </span>
                          <span className="font-mono text-[#78716c] dark:text-white/30 text-[9px] group-hover:text-black/50 transition-colors duration-300">
                            {toShortDate(post.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ArrowUpRight className="w-6 h-6 text-kinetic-orange shrink-0 transition-all duration-300 group-hover:text-black group-hover:rotate-45 group-hover:translate-x-2" />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-stone-300 dark:border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[#78716c] dark:text-white/20 text-xs uppercase tracking-[0.5em]">
              Complete Archive • {new Date().getFullYear()}
            </span>
            <div className="flex items-center gap-8">
              <span className="font-mono text-kinetic-orange text-xs uppercase tracking-widest">
                {posts.length} Articles
              </span>
              <span className="font-mono text-[#78716c] dark:text-white/30 text-xs uppercase tracking-widest">
                {Array.from(new Set(posts.map((p) => p.category))).length} Categories
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
