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

import { saveMarginalia } from "@/actions/marginalia";
import { mdxComponents } from "@/components/blog/mdx-components";
import type { Post } from "@/lib/types";

interface BlogPostDetailProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult | null;
  isLoading: boolean;
  onBack: () => void;
  highlightedTexts: Set<string>;
  onHighlight: (text: string) => void;
  relatedPosts?: Post[];
  onPostClick?: (post: Post) => void;
}

export function BlogPostDetail({
  post,
  mdxSource,
  isLoading,
  onBack,
  highlightedTexts,
  onHighlight,
  relatedPosts = [],
  onPostClick,
}: BlogPostDetailProps) {
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
      className="min-h-screen bg-background"
      onClick={() => setTooltip(null)}
    >
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ left: tooltip.x, top: tooltip.y }}
            className="fixed z-[100] -translate-x-1/2 flex items-center gap-3 border border-border bg-ember-accent px-4 py-2 text-black shadow-md transition-all"
            onClick={(e) => {
              e.stopPropagation();
              void confirmHighlight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                void confirmHighlight();
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Highlighter className="h-4 w-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
              Mark as Fragment
            </span>
            <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-ember-accent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted/40">
        <motion.div
          style={{ scaleX }}
          className="absolute inset-0 origin-left bg-ember-accent"
        />
      </div>

      <header className="relative border-b border-border px-4 pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="container mx-auto max-w-6xl">
          <motion.button
            onClick={onBack}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="group mb-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground transition-all duration-300 hover:text-ember-accent focus-visible:outline-none focus-visible:text-ember-accent"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-border transition-all duration-300 group-hover:border-ember-accent group-hover:bg-ember-accent group-hover:text-black group-focus-visible:border-ember-accent group-focus-visible:bg-ember-accent group-focus-visible:text-black">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-2">
              Back to Catalog
            </span>
          </motion.button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap items-center gap-4"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-ember-accent">
              {post.category}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Clock className="h-3 w-3" />
              {toShortDate(post.date)}
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="font-mono text-xs uppercase tracking-widest text-ember-accent">
              Vol. {String(post.id).padStart(2, "0")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 font-serif text-[clamp(40px,10vw,120px)] font-black uppercase leading-[0.95] tracking-tight text-foreground md:text-[5vw]"
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
              type="button"
              aria-label="Share this post"
              className="group flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-all duration-300 hover:border-ember-accent hover:bg-ember-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Bookmark this post"
              className="group flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-all duration-300 hover:border-ember-accent hover:bg-ember-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <motion.span
              className="ml-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
              style={{
                opacity: useTransform(progressPercent, (v) => (v > 10 ? 1 : 0)),
              }}
            >
              <motion.span>{Math.round(progressPercent.get())}</motion.span>% read
            </motion.span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-32 bg-ember-accent" />
      </header>

      <main className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          {post.content.trim() !== "" && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-16 border-b border-border pb-16"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTextClick(e, post.content);
                }}
                className={`relative w-full cursor-pointer px-4 py-2 text-left font-serif text-2xl italic leading-relaxed text-muted-foreground transition-all duration-300 md:text-3xl ${
                  highlightedTexts.has(post.content)
                    ? ""
                    : "-mx-4 hover:bg-ember-accent/10 hover:text-foreground"
                }`}
              >
                {highlightedTexts.has(post.content) && (
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute inset-0 -z-10 bg-ember-accent/20"
                  />
                )}
                &ldquo;{post.content}&rdquo;
              </button>
            </motion.div>
          )}

          <motion.article
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="prose prose-lg prose-stone dark:prose-invert max-w-none"
          >
            {isLoading && (
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ember-accent">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-ember-accent border-t-transparent" />
                Loading content...
              </div>
            )}

            {!isLoading && mdxSource && (
              <MDXRemote {...mdxSource} components={mdxComponents} lazy />
            )}
          </motion.article>

          {tags.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="mt-16 border-t border-border pt-16"
            >
              <div className="mb-6 flex items-center gap-3">
                <Tag className="h-4 w-4 text-ember-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-ember-accent">
                  Tagged
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="border border-border px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-all duration-300 hover:border-ember-accent hover:bg-ember-accent/10 hover:text-ember-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        <section className="border-t border-border bg-surface px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <span className="mb-2 block font-mono text-xs uppercase tracking-widest text-ember-accent">
                  Continue Reading
                </span>
                <h2 className="font-serif text-3xl font-black uppercase text-foreground md:text-4xl">
                  Related Posts
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 3).map((relatedPost, idx) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onPostClick?.(relatedPost)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPostClick?.(relatedPost);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group relative flex min-h-[240px] cursor-pointer flex-col overflow-hidden border border-border bg-background p-6 transition-all duration-500 hover:bg-ember-accent md:p-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex items-start justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ember-accent transition-colors duration-300 group-hover:text-black">
                        {relatedPost.category}
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:scale-125 group-hover:text-black" />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-3 font-serif text-xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-black md:text-2xl">
                        {relatedPost.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4 transition-colors group-hover:border-black/20">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-black/60">
                        {toShortDate(relatedPost.date)}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ember-accent transition-colors duration-300 group-hover:text-black">
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

      <div className="border-t border-border px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <motion.button
            onClick={onBack}
            whileHover={{ x: -10 }}
            className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors duration-300 hover:text-ember-accent focus-visible:outline-none focus-visible:text-ember-accent"
          >
            <span className="flex h-12 w-12 items-center justify-center border border-border bg-surface transition-all duration-300 group-hover:border-ember-accent group-hover:bg-ember-accent group-hover:text-black group-focus-visible:border-ember-accent group-focus-visible:bg-ember-accent group-focus-visible:text-black">
              <ArrowLeft className="h-5 w-5" />
            </span>
            Back to Catalog
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
