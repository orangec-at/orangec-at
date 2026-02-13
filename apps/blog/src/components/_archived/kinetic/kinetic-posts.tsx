"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";

interface KineticPostsProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onCatalogClick: () => void;
}

export function KineticPosts({
  posts,
  onPostClick,
  onCatalogClick,
}: KineticPostsProps) {
  const toShortDate = (isoDate: string) => {
    const parsed = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase();
  };

  const featuredPosts = (() => {
    const featured = posts.filter((p) => p.featured);
    if (featured.length > 0) return featured.slice(0, 4);
    return posts.slice(0, 4);
  })();

  return (
    <section className="bg-[#f4f1ea] dark:bg-black py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-2 block">
              (02)
            </span>
            <h2 className="font-serif text-[clamp(32px,6vw,64px)] md:text-[5vw] leading-[0.9] text-[#1c1917] dark:text-white uppercase font-bold">
              Latest
            </h2>
          </div>
          <button
            onClick={onCatalogClick}
            className="group flex items-center gap-2 px-6 py-3 border border-[#1c1917] dark:border-white text-[#1c1917] dark:text-white font-mono text-xs uppercase hover:bg-[#1c1917] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            Full Catalog
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:rotate-[-45deg]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {featuredPosts.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => onPostClick(post)}
              className="group relative bg-white dark:bg-zinc-900 border border-stone-200 dark:border-white/10 p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:bg-kinetic-orange dark:hover:bg-kinetic-orange"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col h-full min-h-[200px]">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-kinetic-orange text-xs uppercase tracking-wider group-hover:text-black transition-colors">
                    {post.category}
                  </span>
                  <ArrowUpRight className="w-6 h-6 text-[#1c1917]/30 dark:text-white/30 transition-all duration-300 group-hover:text-black group-hover:rotate-45 group-hover:scale-125" />
                </div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl md:text-2xl lg:text-3xl font-bold text-[#1c1917] dark:text-white leading-tight mb-3 group-hover:text-black transition-colors duration-300">
                    {post.title}
                  </h3>
                  {post.content && (
                    <p className="text-[#78716c] dark:text-white/50 font-mono text-sm leading-relaxed line-clamp-2 group-hover:text-black/60 transition-colors">
                      {post.content.slice(0, 120)}...
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-stone-200 dark:border-white/10 group-hover:border-black/20 transition-colors">
                  <span className="font-mono text-[#78716c] dark:text-white/40 text-xs uppercase tracking-wider group-hover:text-black/60 transition-colors">
                    {toShortDate(post.date)}
                  </span>
                  <span className="font-mono text-kinetic-orange text-xs uppercase group-hover:text-black transition-colors">
                    Vol. {String(post.id).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <span className="font-mono text-[#78716c] dark:text-white/20 text-xs uppercase tracking-[0.5em]">
            Current Collection • 2024
          </span>
        </div>
      </div>
    </section>
  );
}
