"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  BookOpen,
  MessageSquare,
  ArrowUpRight,
  Loader2,
  Sparkles,
  Star,
} from "lucide-react";

import { blogApiUrl } from "@/lib/blog-api";
import type { Fragment, Post } from "@/lib/types";

const SUPPORTED_LOCALES = ["ko", "en"] as const;

function stripLocalePrefix(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  for (const locale of SUPPORTED_LOCALES) {
    const prefix = `/${locale}`;
    if (normalized === prefix) return "/";
    if (normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || "/";
    }
  }

  return normalized;
}

interface KineticSearchModalProps {
  isOpen: boolean;
  locale: string;
  posts: Post[];
  fragments?: Fragment[];
  onClose: () => void;
  onPostClick: (post: Post) => void;
}

type RemoteSearchResult = {
  slug: string;
  title: string;
  url: string;
  content_type: string;
  similarity: number;
  excerpt: string;
  locale: string;
};

const SEARCH_SUGGESTIONS = ["React", "TypeScript", "Design", "Architecture"];

export function KineticSearchModal({
  isOpen,
  locale,
  posts,
  fragments = [],
  onClose,
  onPostClick,
}: KineticSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [remoteResults, setRemoteResults] = useState<RemoteSearchResult[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setRemoteResults([]);
      setRemoteError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 500);
  };

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (!isOpen) return;

    const trimmed = query.trim();
    if (!trimmed) {
      setRemoteResults([]);
      setRemoteError(null);
      setIsRemoteLoading(false);
      return;
    }

    const controller = new AbortController();
    const debounceTimer = window.setTimeout(async () => {
      try {
        setIsRemoteLoading(true);
        setRemoteError(null);

        const response = await fetch(
          blogApiUrl(
            `/api/search?query=${encodeURIComponent(trimmed)}&locale=${encodeURIComponent(locale)}`
          ),
          { signal: controller.signal }
        );

        if (!response.ok) {
          const text = await response.text();
          setRemoteError(text || "Search failed");
          setRemoteResults([]);
          return;
        }

        const data = (await response.json()) as unknown;
        if (Array.isArray(data)) {
          setRemoteResults(data as RemoteSearchResult[]);
        } else {
          setRemoteResults([]);
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        setRemoteError(e instanceof Error ? e.message : "Search failed");
        setRemoteResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsRemoteLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(debounceTimer);
    };
  }, [isOpen, locale, query]);

  const { filteredPosts, filteredFragments } = useMemo(() => {
    if (normalizedQuery === "") {
      return { filteredPosts: [], filteredFragments: [] };
    }

    const nextPosts = posts.filter((p) => {
      const tags = (p.tags ?? []).join(" ").toLowerCase();
      return (
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.content.toLowerCase().includes(normalizedQuery) ||
        p.category.toLowerCase().includes(normalizedQuery) ||
        tags.includes(normalizedQuery)
      );
    });

    const nextFragments = fragments.filter((f) => {
      return (
        f.content.toLowerCase().includes(normalizedQuery) ||
        f.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      );
    });

    return {
      filteredPosts: nextPosts,
      filteredFragments: nextFragments,
    };
  }, [fragments, normalizedQuery, posts]);

  const totalResults =
    filteredPosts.length + filteredFragments.length + remoteResults.length;
  const shouldShowRemoteBlogResults = posts.length === 0;
  const remoteBlogResults = remoteResults.filter(
    (r) => r.content_type === "blog"
  );
  const remoteDocumentResults = remoteResults.filter(
    (r) => r.content_type !== "blog"
  );

  const handleRemoteResultClick = (result: RemoteSearchResult) => {
    const nextPathname = stripLocalePrefix(result.url || "/");
    router.push(nextPathname);
    onClose();
  };

  const handlePostClick = (post: Post) => {
    onPostClick(post);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl bg-[#f4f1ea] dark:bg-black border-2 border-kinetic-orange relative z-10 flex flex-col max-h-[80vh] overflow-hidden"
          >
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-kinetic-orange -skew-y-1 origin-left" />
              
              <div className="p-6 md:p-8 border-b border-stone-300 dark:border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <Star className="w-6 h-6 text-kinetic-orange animate-pulse" fill="currentColor" />
                    <span
                      id="search-modal-title"
                      className="font-mono text-[10px] uppercase tracking-[0.4em] text-kinetic-orange"
                    >
                      Global Search
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="group p-2 -m-2 w-10 h-10 border-2 border-stone-300 dark:border-white/30 flex items-center justify-center hover:bg-kinetic-orange hover:border-kinetic-orange transition-all duration-300"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5 text-[#78716c] dark:text-white/60 group-hover:text-black group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14">
                    {isTyping || isRemoteLoading ? (
                      <Loader2 className="w-6 h-6 text-kinetic-orange animate-spin" />
                    ) : (
                      <Search className="w-6 h-6 text-[#78716c]/50 dark:text-white/50" />
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={handleQueryChange}
                    placeholder="Type to search..."
                    className="w-full bg-[#f4f1ea] dark:bg-black border-2 border-kinetic-orange text-xl md:text-2xl font-mono uppercase tracking-widest text-[#1c1917] dark:text-white placeholder:text-[#78716c]/50 dark:placeholder:text-white/50 outline-none pl-16 pr-6 py-4 transition-colors focus:border-[#1c1917] dark:focus:border-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {query.trim() === "" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 px-6">
                  <div className="w-20 h-20 mb-6 flex items-center justify-center bg-kinetic-orange -skew-x-3">
                    <Sparkles className="w-10 h-10 text-black" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-[#1c1917] dark:text-white mb-2">
                    What are you looking for?
                  </p>
                  <p className="font-mono text-[10px] text-[#78716c] dark:text-white/60 uppercase tracking-[0.3em] mb-8">
                    Search articles, fragments, and documents
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {SEARCH_SUGGESTIONS.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="group px-5 py-2.5 bg-[#f4f1ea] dark:bg-black border-2 border-stone-300 dark:border-white/20 font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/70 hover:border-kinetic-orange hover:text-kinetic-orange hover:bg-kinetic-orange/10 transition-all duration-300"
                      >
                        <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                          {tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8 space-y-8">
                  {remoteError && (
                    <div className="font-mono text-[10px] uppercase tracking-widest text-kinetic-orange p-4 border border-kinetic-orange/50 bg-kinetic-orange/10">
                      {remoteError}
                    </div>
                  )}

                  {shouldShowRemoteBlogResults && remoteBlogResults.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-300 dark:border-white/20">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-kinetic-orange">
                          Journal Entries
                        </h3>
                        <span className="font-mono text-[10px] text-[#78716c] dark:text-white/60">
                          ({remoteBlogResults.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {remoteBlogResults.map((result, idx) => (
                          <motion.div
                            key={`${result.content_type}:${result.slug}:${result.url}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleRemoteResultClick(result)}
                            className="group relative border-t border-stone-300 dark:border-white/20 py-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-kinetic-orange text-sm mt-1">
                                  ({String(idx + 1).padStart(2, "0")})
                                </span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                                    Semantic Match • {Math.round(result.similarity * 100)}%
                                  </span>
                                  <h4 className="font-serif text-xl font-bold text-[#1c1917] dark:text-white leading-tight mt-1 group-hover:translate-x-2 transition-transform duration-300">
                                    {result.title}
                                  </h4>
                                  {result.excerpt && (
                                    <p className="text-sm text-[#78716c] dark:text-white/60 line-clamp-1 mt-1">
                                      {result.excerpt}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ArrowUpRight className="w-8 h-8 text-kinetic-orange shrink-0 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {remoteDocumentResults.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-300 dark:border-white/20">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-kinetic-orange">
                          Documents
                        </h3>
                        <span className="font-mono text-[10px] text-[#78716c] dark:text-white/60">
                          ({remoteDocumentResults.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {remoteDocumentResults.map((result, idx) => (
                          <motion.div
                            key={`${result.content_type}:${result.slug}:${result.url}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handleRemoteResultClick(result)}
                            className="group relative border-t border-stone-300 dark:border-white/20 py-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-kinetic-orange text-sm mt-1">
                                  ({String(idx + 1).padStart(2, "0")})
                                </span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                                    {result.content_type} • {Math.round(result.similarity * 100)}%
                                  </span>
                                  <h4 className="font-serif text-xl font-bold text-[#1c1917] dark:text-white leading-tight mt-1 group-hover:translate-x-2 transition-transform duration-300">
                                    {result.title}
                                  </h4>
                                  {result.excerpt && (
                                    <p className="text-sm text-[#78716c] dark:text-white/60 line-clamp-1 mt-1">
                                      {result.excerpt}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ArrowUpRight className="w-8 h-8 text-kinetic-orange shrink-0 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredPosts.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-300 dark:border-white/20">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-kinetic-orange">
                          Articles
                        </h3>
                        <span className="font-mono text-[10px] text-[#78716c] dark:text-white/60">
                          ({filteredPosts.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {filteredPosts.map((post, idx) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            onClick={() => handlePostClick(post)}
                            className="group relative border-t border-stone-300 dark:border-white/20 py-5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className="font-mono text-kinetic-orange text-sm mt-1">
                                  ({String(idx + 1).padStart(2, "0")})
                                </span>
                                <div className="flex-1 min-w-0">
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                                    {post.category}
                                  </span>
                                  <h4 className="font-serif text-xl font-bold text-[#1c1917] dark:text-white leading-tight mt-1 group-hover:translate-x-2 transition-transform duration-300">
                                    {post.title}
                                  </h4>
                                </div>
                              </div>
                              <ArrowUpRight className="w-8 h-8 text-kinetic-orange shrink-0 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredFragments.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-300 dark:border-white/20">
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-kinetic-orange">
                          Thinking Fragments
                        </h3>
                        <span className="font-mono text-[10px] text-[#78716c] dark:text-white/60">
                          ({filteredFragments.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {filteredFragments.map((fragment, idx) => (
                          <motion.div
                            key={fragment.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                            className="group relative bg-[#f4f1ea] dark:bg-black border-l-4 border-kinetic-orange p-5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                                #{String(fragment.id).padStart(3, "0")} / {fragment.date}
                              </span>
                              <MessageSquare className="w-3 h-3 text-[#78716c]/60 dark:text-white/40" />
                            </div>
                            <p className="font-serif text-sm leading-relaxed text-[#1c1917]/80 dark:text-white/80">
                              {fragment.content}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {fragment.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-2 py-1 border border-kinetic-orange/50 font-mono text-[8px] uppercase tracking-widest text-kinetic-orange/80"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {totalResults === 0 && !isRemoteLoading && (
                    <div className="py-16 text-center">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#78716c]/20 dark:text-white/20" />
                      <p className="font-serif italic text-2xl text-[#78716c] dark:text-white/60 mb-2">
                        No results for &ldquo;{query}&rdquo;
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[#78716c]/60 dark:text-white/40">
                        Try different keywords
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-300 dark:border-white/20 bg-[#f4f1ea]/80 dark:bg-black/80">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#78716c] dark:text-white/60">
                  <kbd className="px-2 py-1 bg-black/5 dark:bg-white/10 border border-stone-300 dark:border-white/20 text-[#78716c] dark:text-white/70 mr-2">
                    ESC
                  </kbd>
                  to close
                </span>
                {query.trim() && (
                  <span className="font-mono text-[10px] uppercase tracking-widest text-kinetic-orange">
                    {totalResults} result{totalResults !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
