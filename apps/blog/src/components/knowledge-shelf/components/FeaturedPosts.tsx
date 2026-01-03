"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Post, ThemeMode } from "../types";

interface FeaturedPostsProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onCatalogClick: () => void;
  theme: ThemeMode;
}


export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  posts,
  onPostClick,
  onCatalogClick,
  theme,
}) => {
  const isDark = theme === "dark";

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
    <section
      className={`py-24 transition-colors duration-500 ${
        isDark ? "bg-[#1a1a1a]" : "bg-[#efede7]"
      }`}
    >
      <div className="container mx-auto px-4">
        <div
          className={`mb-16 flex justify-between items-end border-b pb-8 ${
            isDark ? "border-stone-800" : "border-stone-400"
          }`}
        >
          <div>
            <span
              className={`text-xs tracking-[0.4em] uppercase block mb-2 ${
                isDark ? "text-stone-700" : "text-stone-400"
              }`}
            >
              Section 02
            </span>
            <h2
              className={`text-3xl sm:text-4xl font-serif italic ${
                isDark ? "text-stone-100" : "text-stone-900"
              }`}
            >
              On the Shelf
            </h2>
          </div>
          <button
            onClick={onCatalogClick}
            className={`text-[9px] sm:text-[10px] tracking-widest uppercase font-bold border px-4 sm:px-6 py-2 transition-all ${
              isDark
                ? "border-red-900 text-red-500 hover:bg-red-950"
                : "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white"
            }`}
          >
            Full Catalog
          </button>
        </div>

        <div
          className={`relative flex flex-wrap lg:flex-nowrap items-end gap-1 px-0 sm:px-4 min-h-[400px] sm:min-h-[500px] border-b-[10px] sm:border-b-[20px] ${
            isDark ? "border-red-950" : "border-stone-800"
          }`}
        >
          {featuredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -30 }}
              onClick={() => onPostClick(post)}
              className={`relative flex-grow basis-[calc(50%-0.25rem)] lg:flex-1 min-w-[140px] sm:min-w-[180px] h-[300px] md:h-[400px] lg:h-[450px] ${
                isDark ? "bg-stone-900" : post.color
              } p-5 sm:p-6 flex flex-col justify-between group cursor-pointer shadow-lg overflow-hidden border ${
                isDark ? "border-stone-800" : "border-transparent"
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
              <div className="flex justify-between items-start z-10">
                <span
                  className={`text-[9px] sm:text-[10px] font-bold tracking-tighter uppercase opacity-60 ${
                    isDark ? "text-red-500" : "text-white"
                  }`}
                >
                  Vol. {post.id}
                </span>
                <ArrowUpRight
                  className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? "text-red-500" : "text-white"
                  }`}
                />
              </div>
              <div className="z-10">
                <span
                  className={`text-[9px] sm:text-[10px] tracking-widest uppercase mb-2 sm:mb-4 block opacity-60 ${
                    isDark ? "text-stone-500" : "text-white"
                  }`}
                >
                  {post.category}
                </span>
                <h3
                  className={`text-lg sm:text-xl lg:text-2xl font-serif leading-tight group-hover:underline decoration-red-500 underline-offset-8 ${
                    isDark ? "text-stone-100" : "text-white"
                  }`}
                >
                  {post.title}
                </h3>
              </div>
              <div
                className={`mt-4 sm:mt-8 pt-4 border-t z-10 flex justify-between items-center ${
                  isDark ? "border-stone-800" : "border-white/20"
                }`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-bold ${
                    isDark ? "text-stone-600" : "text-white"
                  }`}
                >
                  {toShortDate(post.date)}
                </span>
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                    isDark ? "bg-red-800" : "bg-white"
                  }`}
                />
              </div>
            </motion.div>
          ))}
          <div
            className={`hidden lg:block flex-[0.5] h-[400px] border-l ${
              isDark ? "border-stone-800" : "border-stone-300"
            }`}
          />
        </div>
        <div className="mt-4 text-center">
          <span
            className={`text-[10px] tracking-[1em] uppercase ${
              isDark ? "text-stone-800" : "text-stone-400"
            }`}
          >
            Current Collection • 2024
          </span>
        </div>
      </div>
    </section>
  );
};
