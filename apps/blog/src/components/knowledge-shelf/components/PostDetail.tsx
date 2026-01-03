"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  Feather,
  Highlighter,
  Quote,
  Share2,
  Sparkles,
} from "lucide-react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { mdxComponents } from "@/components/blog/mdx-components";
import type { Post, ThemeMode } from "../types";
import { saveMarginalia } from "@/actions/marginalia";

interface PostDetailProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult | null;
  isLoading: boolean;
  onBack: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  theme: ThemeMode;
}

export const PostDetail: React.FC<PostDetailProps> = ({
  post,
  mdxSource,
  isLoading,
  onBack,
  highlightedTexts,
  onHighlight,
  theme,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const penX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const isDark = theme === "dark";

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(
    null
  );

  const handleTextClick = (e: React.MouseEvent, text: string) => {
    if (highlightedTexts.has(text)) return;
    if (text.trim() === "") return;

    setTooltip({
      text,
      x: e.clientX,
      y: e.clientY - 40,
    });
  };

  const confirmHighlight = async () => {
    if (!tooltip) return;
    
    onHighlight(tooltip.text);
    
    const result = await saveMarginalia(tooltip.text, [post.category]);
    if (!result.success) {
      console.error(result.message);
    }
    
    setTooltip(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`pt-32 pb-40 px-4 transition-colors duration-700`}
      onClick={() => setTooltip(null)}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className={`fixed z-[100] -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-lg shadow-2xl cursor-pointer transition-all border ${
              isDark
                ? "bg-red-900 text-white border-red-700 shadow-[0_0_20px_rgba(153,27,27,0.5)]"
                : "bg-stone-900 text-white border-stone-700"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              void confirmHighlight();
            }}
          >
            <Highlighter className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Mark as Fragment
            </span>
            <div
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                isDark ? "bg-red-900" : "bg-stone-900"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-20 left-0 right-0 z-40 h-14 pointer-events-none container mx-auto px-4 md:px-12">
        <div className="relative w-full h-full flex items-center">
          <motion.div style={{ left: penX }} className="absolute z-10 transition-all duration-75">
            <div className="relative -ml-4 flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full mb-1 ${
                  isDark
                    ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                    : "bg-stone-900"
                }`}
              />
              <div
                className={`w-20 h-1.5 rounded-full transform -rotate-45 shadow-xl transition-colors ${
                  isDark ? "bg-stone-100" : "bg-stone-800"
                }`}
              />
              <span
                className={`text-[8px] font-mono mt-2 ${
                  isDark ? "text-red-500 font-bold" : "text-stone-400"
                }`}
              >
                {Math.round(scrollYProgress.get() * 100)}%
              </span>
            </div>
          </motion.div>
          <div className={`w-full h-px relative ${isDark ? "bg-stone-800" : "bg-stone-300"}`}>
            <motion.div
              style={{ scaleX }}
              className={`absolute inset-0 origin-left transition-colors ${
                isDark
                  ? "bg-red-900 shadow-[0_0_10px_rgba(153,27,27,0.4)]"
                  : "bg-stone-800"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl relative">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <button
              onClick={onBack}
              className={`flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase font-bold transition-colors mb-8 ${
                isDark
                  ? "text-stone-600 hover:text-white"
                  : "text-stone-400 hover:text-stone-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Return to Entrance
            </button>
            <span
              className={`text-[10px] tracking-[0.3em] uppercase font-bold mb-4 block ${
                isDark ? "text-red-700" : "text-stone-400"
              }`}
            >
              {post.category} / VOL. {post.id}
            </span>
            <h1
              className={`text-4xl md:text-7xl font-serif font-bold leading-tight tracking-tighter ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              {post.title}
            </h1>
            <p
              className={`mt-4 font-mono text-xs ${
                isDark ? "text-stone-700" : "text-stone-400"
              }`}
            >
              JOURNAL RECORDED AT {post.date}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className={`p-4 border rounded-full transition-all ${
                isDark
                  ? "border-stone-800 text-stone-500 hover:text-white hover:border-white"
                  : "border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900"
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className={`p-4 border rounded-full transition-all ${
                isDark
                  ? "border-stone-800 text-stone-500 hover:text-white hover:border-white"
                  : "border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          <main
            className={`flex-grow paper-texture shadow-2xl border-l-[16px] min-h-[1000px] p-8 md:p-20 relative transition-all duration-700 ${
              isDark ? "bg-[#1a1a1a] border-red-950" : "bg-white border-stone-800"
            }`}
          >
            <article
              className={`prose prose-stone dark:prose-invert max-w-none leading-relaxed space-y-10 font-light ${
                isDark ? "text-stone-400" : "text-stone-700"
              }`}
            >
              {post.content.trim() !== "" && (
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTextClick(e, post.content);
                  }}
                  className={`text-2xl italic font-serif transition-all cursor-pointer relative inline-block ${
                    highlightedTexts.has(post.content)
                      ? ""
                      : isDark
                        ? "hover:bg-red-900/10"
                        : "hover:bg-yellow-100/30"
                  }`}
                >
                  {highlightedTexts.has(post.content) && (
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      className={`absolute inset-0 -z-10 ${
                        isDark ? "bg-red-900/40" : "bg-yellow-200/60"
                      }`}
                    />
                  )}
                  {`"${post.content}"`}
                </p>
              )}

              <div className="space-y-6 pt-10">
                {isLoading && (
                  <div className="text-xs font-mono opacity-60">Loading archive...</div>
                )}

                {!isLoading && mdxSource && (
                  <MDXRemote {...mdxSource} components={mdxComponents} lazy />
                )}
              </div>
            </article>

            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-around py-20 opacity-5">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 ${
                    isDark ? "border-white" : "border-stone-900"
                  }`}
                />
              ))}
            </div>
          </main>

          <aside className="lg:w-72 space-y-12 shrink-0">
            <motion.div
              whileHover={{ y: -5 }}
              className={`p-10 shadow-2xl relative overflow-hidden transition-all duration-700 ${
                isDark
                  ? "bg-red-950/20 border border-red-900 text-stone-300"
                  : "bg-yellow-100/50 border border-yellow-200 text-stone-700"
              }`}
            >
              <div className={`absolute top-0 right-0 p-2 ${isDark ? "text-red-900" : "text-yellow-600"}`}>
                <Sparkles className="w-8 h-8 opacity-20 animate-pulse" />
              </div>
              <h4
                className={`font-serif italic text-xl mb-6 border-b pb-4 ${
                  isDark ? "border-red-900 text-white" : "border-yellow-200 text-stone-900"
                }`}
              >
                Marginalia Notes
              </h4>
              <ul className="space-y-6 text-xs font-light leading-relaxed">
                <li className="flex gap-4 italic group cursor-default">
                  <span className="text-red-700 font-bold">#1</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    도서관의 분류 시스템은 컴포넌트 폴더 구조의 훌륭한 비유가 된다.
                  </span>
                </li>
              </ul>
            </motion.div>

            <div className={`p-8 border relative overflow-hidden ${isDark ? "border-stone-800" : "border-stone-100"}`}>
              <div className="flex items-center gap-4 mb-6">
                <Feather className={`w-5 h-5 ${isDark ? "text-red-900" : "text-stone-300"}`} />
                <span className={`text-[10px] uppercase tracking-[0.4em] font-bold ${isDark ? "text-stone-400" : "text-stone-500"}`}>
                  Catalog Index
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono opacity-60">
                <Quote className="w-3 h-3" />
                {post.slug}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
};
