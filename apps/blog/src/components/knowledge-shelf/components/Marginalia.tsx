"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Heart,
  Share2,
  Paperclip,
  Sparkles,
  Highlighter,
} from "lucide-react";

import type { Fragment, ThemeMode } from "../types";

interface MarginaliaProps {
  snippets: Fragment[];
  onViewAll: () => void;
  onLike: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  theme: ThemeMode;
}


export const Marginalia: React.FC<MarginaliaProps> = ({
  snippets,
  onViewAll,
  onLike,
  highlightedTexts,
  onHighlight,
}) => {
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(
    null
  );

  const handleLikeClick = (id: string) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
    onLike();
  };

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
    <section
      className="py-24 bg-[#fdfcf5] relative overflow-hidden"
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
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Ink this thought?
            </span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <span className="text-[20rem] font-serif font-bold absolute -top-20 -left-20">MEMO</span>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-8">
          <div>
            <span className="text-xs tracking-[0.4em] uppercase text-stone-400 block mb-2">
              Section 03
            </span>
            <h2 className="text-4xl font-serif italic text-stone-800">Marginalia.</h2>
            <p className="text-stone-500 text-sm mt-2 font-light">
              여백에 남긴 짤막한 생각들과 기술적 단상들
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-stone-400 hover:text-stone-900 transition-colors"
          >
            View All Threads <Paperclip className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {snippets.slice(0, 4).map((snippet, index) => {
            const isLiked = likedIds.includes(snippet.id);
            const isHighlighted = highlightedTexts.has(snippet.content);
            return (
              <motion.div
                key={snippet.id}
                whileHover={{ rotate: 0, y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                 style={{ rotate: snippet.rotation ?? [-2, 1, -1, 2][index % 4] }}

                className="bg-white p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-stone-100 relative group cursor-pointer"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-stone-200/40 backdrop-blur-sm -rotate-2 group-hover:bg-stone-300/40 transition-colors" />

                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-bold text-stone-400 tracking-widest">
                      {snippet.date}
                    </span>
                    <AnimatePresence>
                      {isLiked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-[8px] font-bold text-yellow-600 flex items-center gap-1"
                        >
                          <Sparkles className="w-2 h-2" /> +5 INK
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTextClick(e, snippet.content);
                    }}
                    className="relative mb-6 flex-grow"
                  >
                    {isHighlighted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="absolute inset-0 bg-yellow-200/50 -z-10 mix-blend-multiply"
                      />
                    )}
                    <p
                      className={`text-stone-800 font-handwriting text-base leading-relaxed transition-all ${
                        isHighlighted
                          ? ""
                          : "hover:underline hover:decoration-dotted hover:decoration-stone-300 hover:underline-offset-4"
                      }`}
                    >
                      {snippet.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {snippet.tags.map((tag) => (
                      <span key={tag} className="text-[9px] text-stone-400 uppercase tracking-tighter">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(snippet.id);
                        }}
                        className={`transition-colors flex items-center gap-1 ${
                          isLiked
                            ? "text-pink-500 scale-110"
                            : "text-stone-300 hover:text-pink-400"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLiked ? "fill-pink-500" : ""}`}
                        />
                        {isLiked && <span className="text-[8px] font-bold">1</span>}
                      </button>
                      <button className="text-stone-300 hover:text-stone-900 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Share2 className="w-3.5 h-3.5 text-stone-300 hover:text-stone-900 cursor-pointer transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
