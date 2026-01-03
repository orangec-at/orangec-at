"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Book, Search, LayoutGrid, List, ChevronRight } from "lucide-react";

import type { Post, ThemeMode } from "../types";

interface CatalogProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onBack: () => void;
  onSearchOpen: () => void;
  theme: ThemeMode;
}


export const Catalog: React.FC<CatalogProps> = ({
  posts,
  onPostClick,
  onBack,
  onSearchOpen,
  theme,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isDark = theme === "dark";

  const toCatalogDate = (isoDate: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate.replace(/-/g, ".");
    return isoDate;
  };

  return (
    <div
      className={`pt-32 pb-40 transition-colors duration-700`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold transition-colors mb-12 ${
              isDark ? "text-stone-600 hover:text-white" : "text-stone-400 hover:text-stone-900"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive Entrance
          </button>

          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12 ${
              isDark ? "border-stone-800" : "border-stone-200"
            }`}
          >
            <div>
              <h1
                className={`text-5xl md:text-7xl font-serif font-bold leading-tight ${
                  isDark ? "text-white" : "text-stone-900"
                }`}
              >
                Full Catalog <br />
                <span
                  className={`italic text-4xl md:text-5xl ${
                    isDark ? "text-stone-600" : "text-stone-400"
                  }`}
                >
                  The Master Index.
                </span>
              </h1>
            </div>

            <div className="flex gap-4">
              <div
                className={`p-1 rounded-sm border flex gap-1 ${
                  isDark ? "bg-stone-900 border-stone-800" : "bg-white border-stone-200"
                }`}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-sm transition-all ${
                    viewMode === "grid"
                      ? isDark
                        ? "bg-red-900 text-white"
                        : "bg-stone-900 text-white"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-sm transition-all ${
                    viewMode === "list"
                      ? isDark
                        ? "bg-red-900 text-white"
                        : "bg-stone-900 text-white"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={onSearchOpen}
                className={`p-3 border rounded-sm transition-all ${
                  isDark
                    ? "bg-stone-900 border-stone-800 text-stone-400 hover:text-white"
                    : "bg-white border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900"
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onPostClick(post)}
                  className={`p-8 border shadow-sm group cursor-pointer transition-all flex flex-col h-full ${
                    isDark
                      ? "bg-stone-900 border-stone-800 hover:border-red-900 hover:shadow-[0_0_20px_rgba(153,27,27,0.1)]"
                      : "bg-white border-stone-100 hover:border-stone-400"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase opacity-40 ${
                        isDark ? "text-stone-400" : "text-stone-500"
                      }`}
                    >
                      VOL. {post.id}
                    </span>
                    <Book
                      className={`w-4 h-4 opacity-10 group-hover:opacity-100 transition-opacity ${
                        isDark ? "text-red-900" : "text-stone-900"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-xl font-serif font-bold mb-6 group-hover:underline decoration-red-900 underline-offset-4 flex-grow ${
                      isDark ? "text-white" : "text-stone-900"
                    }`}
                  >
                    {post.title}
                  </h3>
                  <div
                    className={`mt-auto pt-6 border-t flex justify-between items-center ${
                      isDark ? "border-stone-800" : "border-stone-50"
                    }`}
                  >
                    <span
                      className={`text-[9px] uppercase tracking-widest font-bold ${
                        isDark ? "text-red-900" : "text-stone-400"
                      }`}
                    >
                      {post.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono ${
                        isDark ? "text-stone-700" : "text-stone-300"
                      }`}
                    >
                       {toCatalogDate(post.date)}

                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {posts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onPostClick(post)}
                  className={`p-6 border flex items-center justify-between group cursor-pointer transition-all ${
                    isDark
                      ? "bg-stone-900 border-stone-800 hover:bg-stone-800"
                      : "bg-white border-stone-100 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center gap-8">
                    <span
                      className={`text-[10px] font-mono opacity-20 w-8 ${
                        isDark ? "text-white" : "text-stone-900"
                      }`}
                    >
                      {post.id}
                    </span>
                    <div>
                      <h3
                        className={`font-serif font-bold group-hover:underline ${
                          isDark ? "text-white" : "text-stone-900"
                        }`}
                      >
                        {post.title}
                      </h3>
                      <span
                        className={`text-[9px] uppercase tracking-widest font-bold ${
                          isDark ? "text-stone-600" : "text-stone-400"
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                      isDark ? "text-red-900" : "text-stone-200"
                    }`}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
