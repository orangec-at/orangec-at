"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Hash,
  Heart,
  MessageSquare,
  Share2,
  Filter,
  ArrowUpDown,
  Sparkles,
  X,
} from "lucide-react";

import type { Fragment, ThemeMode } from "@/lib/types";

type SortOption = "newest" | "oldest" | "random";

interface KineticThreadsProps {
  threads: Fragment[];
  onBack: () => void;
  onSearchOpen: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  theme: ThemeMode;
}

export function KineticThreads({
  threads,
  onBack,
  highlightedTexts,
  onHighlight,
}: KineticThreadsProps) {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const tags = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          threads
            .flatMap((thread) => thread.tags)
            .filter((tag) => tag.trim() !== "")
        )
      ),
    ],
    [threads]
  );

  const filteredAndSortedThreads = useMemo(() => {
    let result = threads.filter((thread) => {
      const matchesTag =
        activeTag === "All" ||
        thread.tags.some((t) =>
          t.toLowerCase().includes(activeTag.toLowerCase())
        );
      const matchesSearch =
        !searchQuery ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesTag && matchesSearch;
    });

    switch (sortBy) {
      case "oldest":
        result = [...result].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "random":
        result = [...result].sort(() => Math.random() - 0.5);
        break;
      case "newest":
      default:
        result = [...result].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }

    return result;
  }, [threads, activeTag, sortBy, searchQuery]);

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
  };

  const handleTextClick = (text: string) => {
    if (!highlightedTexts.has(text)) {
      onHighlight(text);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] dark:bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 right-0 font-serif text-[40vw] font-black text-[#1c1917] dark:text-white leading-none">
          糸
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-stone-300 dark:bg-white/5" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-stone-300 dark:bg-white/5" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-stone-300 dark:bg-white/5" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-40 relative z-10">
        <div className="mb-16">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[#78716c] dark:text-white/40 hover:text-kinetic-orange transition-colors duration-300 mb-12"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-2" />
            Back to Home
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-stone-300 dark:border-white/10 pb-12">
            <div>
              <span className="text-kinetic-orange font-mono text-sm uppercase tracking-widest mb-4 block">
                (Archive)
              </span>
              <h1 className="font-serif text-[12vw] md:text-[8vw] leading-[0.85] text-[#1c1917] dark:text-white uppercase font-black">
                Threads
              </h1>
              <p className="text-[#78716c] dark:text-white/40 font-mono text-sm mt-6 max-w-lg leading-relaxed">
                도서관 서가 사이사이에 꽂혀있는 짧은 생각의 파편들입니다.
                <br />
                매일 한 줄씩, 기술과 삶에 대한 단상을 기록합니다.
              </p>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-black text-kinetic-orange">
                  {threads.length}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/40 mt-1">
                  Fragments
                </div>
              </div>
              <div className="text-center">
                <div className="font-serif text-4xl md:text-5xl font-black text-[#1c1917] dark:text-white">
                  {tags.length - 1}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/40 mt-1">
                  Topics
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${
                showFilters
                  ? "bg-kinetic-orange border-kinetic-orange text-black"
                  : "border-stone-300 dark:border-white/20 text-[#78716c] dark:text-white/60 hover:border-kinetic-orange hover:text-kinetic-orange"
              }`}
            >
              <Filter className="w-3 h-3" />
              Filters
              {activeTag !== "All" && (
                <span className="ml-1 px-1.5 py-0.5 bg-black/20 text-[9px]">
                  1
                </span>
              )}
            </button>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center gap-2 px-5 py-3 font-mono text-xs uppercase tracking-wider border transition-all duration-300 ${
                showSearch
                  ? "bg-kinetic-orange border-kinetic-orange text-black"
                  : "border-stone-300 dark:border-white/20 text-[#78716c] dark:text-white/60 hover:border-kinetic-orange hover:text-kinetic-orange"
              }`}
            >
              <Search className="w-3 h-3" />
              Search
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716c] dark:text-white/30 mr-2">
              <ArrowUpDown className="w-3 h-3 inline mr-1" />
              Sort:
            </span>
            {(["newest", "oldest", "random"] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider border transition-all duration-300 ${
                  sortBy === option
                    ? "bg-[#1c1917] dark:bg-white text-white dark:text-black border-[#1c1917] dark:border-white"
                    : "border-stone-300 dark:border-white/20 text-[#78716c] dark:text-white/40 hover:border-stone-400 dark:hover:border-white/40 hover:text-[#1c1917] dark:hover:text-white/60"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#78716c] dark:text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search threads..."
                  className="w-full bg-white dark:bg-black border border-stone-300 dark:border-white/10 px-12 py-4 font-mono text-sm text-[#1c1917] dark:text-white placeholder:text-[#78716c] dark:placeholder:text-white/30 focus:outline-none focus:border-kinetic-orange transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716c] dark:text-white/30 hover:text-[#1c1917] dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white/50 dark:bg-black/50 border border-stone-300 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/40">
                    Filter by Topic
                  </span>
                  {activeTag !== "All" && (
                    <button
                      onClick={() => setActiveTag("All")}
                      className="font-mono text-[10px] uppercase tracking-wider text-kinetic-orange hover:underline"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider border transition-all duration-300 ${
                        activeTag === tag
                          ? "bg-kinetic-orange border-kinetic-orange text-black"
                          : "border-stone-300 dark:border-white/20 text-[#78716c] dark:text-white/50 hover:border-kinetic-orange hover:text-kinetic-orange"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 font-mono text-xs text-[#78716c] dark:text-white/30 uppercase tracking-wider">
          Showing {filteredAndSortedThreads.length} of {threads.length} threads
          {activeTag !== "All" && (
            <span className="text-kinetic-orange ml-2">• {activeTag}</span>
          )}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedThreads.map((thread, i) => {
              const isHighlighted = highlightedTexts.has(thread.content);
              const isLiked = likedIds.includes(thread.id);

              return (
                <motion.div
                  key={thread.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white dark:bg-black border border-stone-300 dark:border-white/10 p-6 cursor-default transition-all duration-300 hover:border-kinetic-orange"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-stone-200 dark:border-t-white/5 border-l-[16px] border-l-transparent group-hover:border-t-kinetic-orange transition-colors duration-300" />
                  </div>

                  <div className="flex flex-col h-full min-h-[200px]">
                    <div className="flex justify-between items-start mb-4">
                      <span className="flex items-center gap-2 font-mono text-kinetic-orange text-[10px] uppercase tracking-wider">
                        <Hash className="w-3 h-3" />
                        {String(thread.id).padStart(3, "0")}
                      </span>
                      <span className="font-mono text-[#78716c] dark:text-white/30 text-[10px] uppercase tracking-wider">
                        {thread.date}
                      </span>
                    </div>

                    <div
                      onClick={() => handleTextClick(thread.content)}
                      className="flex-1 mb-4 cursor-pointer"
                    >
                      <p
                        className={`text-base leading-relaxed transition-all duration-300 ${
                          isHighlighted
                            ? "text-kinetic-orange bg-kinetic-orange/10 -mx-2 px-2 py-1"
                            : "text-[#1c1917]/70 dark:text-white/70 group-hover:text-[#1c1917] dark:group-hover:text-white"
                        }`}
                      >
                        {thread.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {thread.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setActiveTag(tag)}
                          className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#78716c] dark:text-white/40 border border-stone-300 dark:border-white/10 hover:border-kinetic-orange hover:text-kinetic-orange transition-all duration-300"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-white/10 group-hover:border-stone-300 dark:group-hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(thread.id)}
                          className={`flex items-center gap-1.5 transition-all duration-300 ${
                            isLiked
                              ? "text-kinetic-orange"
                              : "text-[#78716c] dark:text-white/30 hover:text-kinetic-orange"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${isLiked ? "fill-kinetic-orange" : ""}`}
                          />
                          <AnimatePresence>
                            {isLiked && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                        <button className="text-[#78716c] dark:text-white/30 hover:text-[#1c1917]/60 dark:hover:text-white/60 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-[#78716c]/50 dark:text-white/20 hover:text-kinetic-orange transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredAndSortedThreads.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="font-serif text-6xl text-[#1c1917]/10 dark:text-white/10 mb-4">∅</div>
            <p className="font-mono text-sm text-[#78716c] dark:text-white/40 uppercase tracking-wider">
              No threads found
            </p>
            <button
              onClick={() => {
                setActiveTag("All");
                setSearchQuery("");
              }}
              className="mt-6 px-6 py-3 bg-kinetic-orange text-black font-mono text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        <div className="mt-20 text-center">
          <span className="font-mono text-[#1c1917]/10 dark:text-white/10 text-xs uppercase tracking-[0.5em]">
            Thread Archive • {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
