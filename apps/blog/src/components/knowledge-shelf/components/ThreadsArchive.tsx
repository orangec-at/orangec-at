"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Hash,
  Heart,
  MessageSquare,
  Share2,
  Highlighter,
} from "lucide-react";

import type { Fragment, ThemeMode } from "../types";

interface ThreadsArchiveProps {
  threads: Fragment[];
  onBack: () => void;
  onSearchOpen: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  theme: ThemeMode;
}


export const ThreadsArchive: React.FC<ThreadsArchiveProps> = ({
  threads,
  onBack,
  onSearchOpen,
  highlightedTexts,
  onHighlight,
}) => {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(
    null
  );

  const tags = [
    "All",
    ...Array.from(
      new Set(
        threads.flatMap((thread) => thread.tags).filter((tag) => tag.trim() !== "")
      )
    ),
  ];

  const filteredThreads = threads.filter((thread) => {
    if (activeTag === "All") return true;
    return thread.tags.some((t) => t.toLowerCase().includes(activeTag.toLowerCase()));
  });

  const handleTextClick = (e: React.MouseEvent, text: string) => {
    if (highlightedTexts.has(text)) return;
    setTooltip({
      text,
      x: e.clientX,
      y: e.clientY - 40,
    });
  };

  const confirmHighlight = () => {
    if (tooltip) {
      onHighlight(tooltip.text);
      setTooltip(null);
    }
  };

  return (
    <div
      className="pt-32 pb-40"
      onClick={() => setTooltip(null)}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className="fixed z-[100] -translate-x-1/2 flex items-center gap-3 bg-stone-900 text-white px-4 py-2 rounded-lg shadow-2xl cursor-pointer hover:bg-stone-700 transition-colors border border-stone-700"
            onClick={(e) => {
              e.stopPropagation();
              confirmHighlight();
            }}
          >
            <Highlighter className="w-4 h-4 text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mark as Important?</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold text-stone-400 hover:text-stone-900 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Archive Entrance
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-200 pb-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 leading-tight">
                Marginalia <br />
                <span className="italic text-stone-400 text-4xl md:text-5xl">The Card Catalog.</span>
              </h1>
              <p className="text-stone-500 mt-6 max-w-lg font-light leading-relaxed">
                도서관 서가 사이사이에 꽂혀있는 짧은 생각의 파편들입니다. 매일 한 줄씩, 기술과 삶에 대한 단상을 기록합니다.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-80">
              <button
                onClick={onSearchOpen}
                className="w-full bg-white border border-stone-200 rounded-full py-3 px-6 text-stone-300 text-sm flex items-center gap-4 shadow-sm hover:border-stone-400 transition-all"
              >
                <Search className="w-4 h-4" />
                Global archive search...
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto no-scrollbar pb-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                activeTag === tag
                  ? "bg-stone-900 border-stone-900 text-white"
                  : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredThreads.map((thread, i) => {
              const isHighlighted = highlightedTexts.has(thread.content);
              return (
                <motion.div
                  key={thread.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid bg-white p-10 border border-stone-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] group relative cursor-default"
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-stone-100/60 backdrop-blur-sm -rotate-1 group-hover:bg-stone-200/80 transition-all" />

                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-stone-300 tracking-[0.2em] mb-8 flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      FRAGMENT #{String(thread.id).padStart(3, "0")} / {thread.date}
                    </span>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTextClick(e, thread.content);
                      }}
                      className="relative mb-8"
                    >
                      {isHighlighted && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          className="absolute inset-0 bg-yellow-200/50 -z-10 mix-blend-multiply"
                        />
                      )}
                      <p
                        className={`text-stone-800 font-handwriting text-lg leading-relaxed transition-all ${
                          isHighlighted
                            ? ""
                            : "hover:underline hover:decoration-dotted hover:decoration-stone-300 hover:underline-offset-4 cursor-pointer"
                        }`}
                      >
                        {thread.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] text-stone-400 uppercase tracking-tighter px-2 py-1 bg-stone-50 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                      <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-stone-300 hover:text-pink-400 transition-colors group/btn">
                          <Heart className="w-4 h-4 group-hover/btn:fill-pink-400" />
                          <span className="text-[10px] font-bold">12</span>
                        </button>
                        <button className="flex items-center gap-2 text-stone-300 hover:text-stone-900 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-[10px] font-bold">4</span>
                        </button>
                      </div>
                      <Share2 className="w-4 h-4 text-stone-200 hover:text-stone-900 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
