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
  ArrowUpRight,
  Bookmark,
  Clock,
  Highlighter,
  Share2,
  Tag,
} from "lucide-react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

import { kineticMdxComponents } from "./kinetic-mdx-components";
import type { Post } from "@/lib/types";
import { saveMarginalia } from "@/actions/marginalia";

interface KineticPostDetailProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult | null;
  isLoading: boolean;
  onBack: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  relatedPosts?: Post[];
  onPostClick?: (post: Post) => void;
}

export function KineticPostDetail({
  post,
  mdxSource,
  isLoading,
  onBack,
  highlightedTexts,
  onHighlight,
  relatedPosts = [],
  onPostClick,
}: KineticPostDetailProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

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

  const toShortDate = (isoDate: string) => {
    const parsed = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  };

  const tags = post.tags ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f4f1ea] dark:bg-black"
      onClick={() => setTooltip(null)}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className="fixed z-[100] -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-kinetic-orange text-black cursor-pointer transition-all border-2 border-black shadow-[4px_4px_0_0_#000]"
            onClick={(e) => {
              e.stopPropagation();
              void confirmHighlight();
            }}
          >
            <Highlighter className="w-4 h-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
              Mark as Fragment
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-kinetic-orange border-r-2 border-b-2 border-black" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200 dark:bg-stone-900">
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 origin-left bg-kinetic-orange"
        />
      </div>

      <header className="relative pt-28 pb-16 md:pt-32 md:pb-24 px-4 border-b border-[#1c1917]/10 dark:border-white/10">
        <div className="container mx-auto max-w-6xl">
          <motion.button
            onClick={onBack}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="group flex items-center gap-3 mb-12 font-mono text-xs uppercase tracking-[0.3em] text-[#78716c] dark:text-white/60 hover:text-kinetic-orange focus-visible:outline-none focus-visible:text-kinetic-orange transition-all duration-300"
          >
            <span className="flex items-center justify-center w-10 h-10 border-2 border-[#1c1917]/20 dark:border-white/20 group-hover:border-kinetic-orange group-hover:bg-kinetic-orange group-hover:text-black group-focus-visible:border-kinetic-orange group-focus-visible:bg-kinetic-orange group-focus-visible:text-black transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">
              Back to Catalog
            </span>
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span className="font-mono text-kinetic-orange text-xs uppercase tracking-widest">
              {post.category}
            </span>
            <span className="w-px h-4 bg-[#1c1917]/20 dark:bg-white/20" />
            <span className="flex items-center gap-2 font-mono text-[#78716c] dark:text-white/60 text-xs uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              {toShortDate(post.date)}
            </span>
            <span className="w-px h-4 bg-[#1c1917]/20 dark:bg-white/20" />
            <span className="font-mono text-kinetic-orange text-xs uppercase tracking-widest">
              Vol. {String(post.id).padStart(2, "0")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-[clamp(40px,10vw,120px)] md:text-[5vw] leading-[0.95] text-[#1c1917] dark:text-white uppercase font-black tracking-tight mb-8"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3"
          >
            <button 
              aria-label="Share this post"
              className="group flex items-center justify-center w-12 h-12 border-2 border-[#1c1917]/20 dark:border-white/20 text-[#78716c] dark:text-white/60 hover:border-kinetic-orange hover:bg-kinetic-orange hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea] dark:focus-visible:ring-offset-black transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              aria-label="Bookmark this post"
              className="group flex items-center justify-center w-12 h-12 border-2 border-[#1c1917]/20 dark:border-white/20 text-[#78716c] dark:text-white/60 hover:border-kinetic-orange hover:bg-kinetic-orange hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea] dark:focus-visible:ring-offset-black transition-all duration-300"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <motion.span
              className="ml-4 font-mono text-[#78716c] dark:text-white/50 text-xs uppercase tracking-widest"
              style={{
                opacity: useTransform(progressPercent, (v) =>
                  v > 10 ? 1 : 0
                ),
              }}
            >
              <motion.span>{Math.round(progressPercent.get())}</motion.span>%
              read
            </motion.span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-32 h-1 bg-kinetic-orange" />
      </header>

      <main className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {post.content.trim() !== "" && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-16 pb-16 border-b border-[#1c1917]/10 dark:border-white/10"
            >
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  handleTextClick(e, post.content);
                }}
                className={`text-2xl md:text-3xl font-serif italic text-[#1c1917]/70 dark:text-white/70 leading-relaxed cursor-pointer relative transition-all duration-300 ${
                  highlightedTexts.has(post.content)
                    ? ""
                    : "hover:text-[#1c1917] dark:hover:text-white hover:bg-kinetic-orange/10 -mx-4 px-4 py-2"
                }`}
              >
                {highlightedTexts.has(post.content) && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute inset-0 -z-10 bg-kinetic-orange/20"
                  />
                )}
                &ldquo;{post.content}&rdquo;
              </p>
            </motion.div>
          )}

          <motion.article
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="prose prose-lg prose-stone dark:prose-invert max-w-none"
          >
            {isLoading && (
              <div className="flex items-center gap-3 font-mono text-kinetic-orange text-xs uppercase tracking-widest">
                <div className="w-4 h-4 border-2 border-kinetic-orange border-t-transparent rounded-full animate-spin" />
                Loading content...
              </div>
            )}

            {!isLoading && mdxSource && (
              <MDXRemote {...mdxSource} components={kineticMdxComponents} lazy />
            )}
          </motion.article>

          {tags.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 pt-16 border-t border-[#1c1917]/10 dark:border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-4 h-4 text-kinetic-orange" />
                <span className="font-mono text-kinetic-orange text-xs uppercase tracking-widest">
                  Tagged
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="px-4 py-2 border-2 border-[#1c1917]/20 dark:border-white/20 font-mono text-xs uppercase tracking-wider text-[#78716c] dark:text-white/60 hover:border-kinetic-orange hover:text-kinetic-orange hover:bg-kinetic-orange/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kinetic-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f1ea] dark:focus-visible:ring-offset-black transition-all duration-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-stone-100 dark:bg-stone-900 border-t border-[#1c1917]/10 dark:border-white/10">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="font-mono text-kinetic-orange text-xs uppercase tracking-widest mb-2 block">
                  Continue Reading
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-black text-[#1c1917] dark:text-white uppercase">
                  Related Posts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {relatedPosts.slice(0, 3).map((relatedPost, idx) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onPostClick?.(relatedPost)}
                  className="group relative bg-white dark:bg-black border border-[#1c1917]/10 dark:border-white/10 p-6 md:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:bg-kinetic-orange dark:hover:bg-kinetic-orange min-h-[240px] flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-kinetic-orange text-[10px] uppercase tracking-wider group-hover:text-black transition-colors duration-300">
                        {relatedPost.category}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-[#1c1917]/40 dark:text-white/40 transition-all duration-300 group-hover:text-black group-hover:rotate-45 group-hover:scale-125" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1c1917] dark:text-white leading-tight mb-3 group-hover:text-black transition-colors duration-300">
                        {relatedPost.title}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#1c1917]/10 dark:border-white/10 group-hover:border-black/20 transition-colors">
                      <span className="font-mono text-[#78716c] dark:text-white/50 text-[10px] uppercase tracking-wider group-hover:text-black/60 transition-colors">
                        {toShortDate(relatedPost.date)}
                      </span>
                      <span className="font-mono text-kinetic-orange text-[10px] uppercase tracking-widest font-bold group-hover:text-black transition-colors duration-300">
                        Vol. {String(relatedPost.id).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="py-16 px-4 border-t border-[#1c1917]/10 dark:border-white/10">
        <div className="container mx-auto max-w-6xl">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -10 }}
            className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-[#78716c] dark:text-white/60 hover:text-kinetic-orange focus-visible:outline-none focus-visible:text-kinetic-orange transition-colors duration-300"
          >
            <span className="flex items-center justify-center w-12 h-12 bg-stone-100 dark:bg-stone-900 border-2 border-[#1c1917]/10 dark:border-white/10 group-hover:border-kinetic-orange group-hover:bg-kinetic-orange group-hover:text-black group-focus-visible:border-kinetic-orange group-focus-visible:bg-kinetic-orange group-focus-visible:text-black transition-all duration-300">
              <ArrowLeft className="w-5 h-5" />
            </span>
            Back to Catalog
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
