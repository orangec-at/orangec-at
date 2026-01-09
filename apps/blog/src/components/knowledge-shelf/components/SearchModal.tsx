"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, BookOpen, MessageSquare, ChevronRight, Loader2 } from "lucide-react";

import { stripLocalePrefix, withLocalePath } from "@/lib/locale-path";
import { blogApiUrl } from "@/lib/blog-api";
import type { Fragment, Post, ThemeMode } from "../types";

interface SearchModalProps {
  isOpen: boolean;
  locale: string;
  posts: Post[];
  fragments: Fragment[];
  onClose: () => void;
  onPostClick: (post: Post) => void;
  theme: ThemeMode;
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

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  locale,
  posts,
  fragments,
  onClose,
  onPostClick,
  theme,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(false);
  const [remoteResults, setRemoteResults] = useState<RemoteSearchResult[]>([]);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsRemoteLoading(true);
        setRemoteError(null);

        const response = await fetch(
          blogApiUrl(`/api/search?query=${encodeURIComponent(trimmed)}&locale=${encodeURIComponent(locale)}`),
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
      window.clearTimeout(timeoutId);
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

  const totalResults = filteredPosts.length + filteredFragments.length + remoteResults.length;
  const shouldShowRemoteBlogResults = posts.length === 0;
  const remoteBlogResults = remoteResults.filter((r) => r.content_type === "blog");
  const remoteDocumentResults = remoteResults.filter((r) => r.content_type !== "blog");

  const handleRemoteResultClick = (result: RemoteSearchResult) => {
    const nextPathname = stripLocalePrefix(result.url || "/");
    router.push(withLocalePath(locale, nextPathname));
    onClose();
  };

  return (

    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`w-full max-w-4xl paper-texture shadow-2xl rounded-sm overflow-hidden relative z-10 flex flex-col max-h-[85vh] border-t-8 transition-colors duration-500 ${
              isDark
                ? "bg-[#1a1a1a] border-red-900 text-stone-300"
                : "bg-[#fdfcf5] border-stone-800 text-stone-800"
            }`}
          >
            <div className={`p-6 md:p-10 border-b ${isDark ? "border-stone-800" : "border-stone-200"}`}>
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] tracking-[0.5em] uppercase text-stone-400 font-bold italic">
                  Global Archive Catalog Search
                </span>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${
                    isDark ? "hover:bg-stone-800" : "hover:bg-stone-100"
                  }`}
                >
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="relative">
                {isTyping || isRemoteLoading ? (
                  <Loader2
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 animate-spin ${
                      isDark ? "text-red-900" : "text-stone-300"
                    }`}
                  />
                ) : (
                  <Search
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 ${
                      isDark ? "text-stone-700" : "text-stone-300"
                    }`}
                  />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="지식의 키워드를 입력하세요..."
                  className={`w-full bg-transparent border-none text-3xl md:text-5xl font-serif font-bold outline-none pl-12 md:pl-16 transition-colors ${
                    isDark
                      ? "text-white placeholder:text-stone-800"
                      : "text-stone-800 placeholder:text-stone-200"
                  }`}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 md:p-10">
              {query.trim() === "" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <BookOpen
                    className={`w-12 h-12 mb-6 ${
                      isDark ? "text-stone-800" : "text-stone-200"
                    }`}
                  />
                  <p className="text-stone-400 font-serif italic text-xl">
                    서랍이 열렸습니다. 무엇을 찾고 계신가요?
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {["React", "Philosophy", "Architecture", "UI"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all ${
                          isDark
                            ? "bg-stone-900 text-stone-500 hover:bg-red-900 hover:text-white"
                            : "bg-stone-100 text-stone-500 hover:bg-stone-900 hover:text-white"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-16">
                  {remoteError && (
                    <div
                      className={`text-[9px] uppercase tracking-[0.5em] ${
                        isDark ? "text-red-900" : "text-stone-400"
                      }`}
                    >
                      {remoteError}
                    </div>
                  )}

                  {shouldShowRemoteBlogResults && remoteBlogResults.length > 0 && (
                    <section>
                      <h3
                        className={`text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-6 border-b pb-2 ${
                          isDark ? "border-stone-800" : "border-stone-100"
                        }`}
                      >
                        Journal Entries ({remoteBlogResults.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {remoteBlogResults.map((result) => (
                          <div
                            key={`${result.content_type}:${result.slug}:${result.url}`}
                            onClick={() => handleRemoteResultClick(result)}
                            className={`p-6 border cursor-pointer group flex items-center justify-between transition-all ${
                              isDark
                                ? "bg-stone-900/40 border-stone-800 hover:border-red-900"
                                : "bg-white border-stone-100 hover:border-stone-400"
                            }`}
                          >
                            <div className="pr-6">
                              <span
                                className={`text-[8px] uppercase tracking-widest font-bold block mb-1 ${
                                  isDark ? "text-red-900" : "text-stone-400"
                                }`}
                              >
                                Semantic Match • {Math.round(result.similarity * 100)}%
                              </span>
                              <h4
                                className={`text-lg font-serif font-bold transition-colors ${
                                  isDark
                                    ? "text-stone-200 group-hover:text-white"
                                    : "text-stone-800 group-hover:text-stone-600"
                                }`}
                              >
                                {result.title}
                              </h4>
                              {result.excerpt && (
                                <p
                                  className={`mt-2 text-xs leading-relaxed line-clamp-2 ${
                                    isDark ? "text-stone-500" : "text-stone-600"
                                  }`}
                                >
                                  {result.excerpt}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 transition-colors ${
                                isDark
                                  ? "text-stone-800 group-hover:text-red-900"
                                  : "text-stone-200 group-hover:text-stone-800"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {remoteDocumentResults.length > 0 && (
                    <section>
                      <h3
                        className={`text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-6 border-b pb-2 ${
                          isDark ? "border-stone-800" : "border-stone-100"
                        }`}
                      >
                        Documents ({remoteDocumentResults.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {remoteDocumentResults.map((result) => (
                          <div
                            key={`${result.content_type}:${result.slug}:${result.url}`}
                            onClick={() => handleRemoteResultClick(result)}
                            className={`p-6 border cursor-pointer group flex items-center justify-between transition-all ${
                              isDark
                                ? "bg-stone-900/40 border-stone-800 hover:border-red-900"
                                : "bg-white border-stone-100 hover:border-stone-400"
                            }`}
                          >
                            <div className="pr-6">
                              <span
                                className={`text-[8px] uppercase tracking-widest font-bold block mb-1 ${
                                  isDark ? "text-red-900" : "text-stone-400"
                                }`}
                              >
                                {result.content_type} • {Math.round(result.similarity * 100)}%
                              </span>
                              <h4
                                className={`text-lg font-serif font-bold transition-colors ${
                                  isDark
                                    ? "text-stone-200 group-hover:text-white"
                                    : "text-stone-800 group-hover:text-stone-600"
                                }`}
                              >
                                {result.title}
                              </h4>
                              {result.excerpt && (
                                <p
                                  className={`mt-2 text-xs leading-relaxed line-clamp-2 ${
                                    isDark ? "text-stone-500" : "text-stone-600"
                                  }`}
                                >
                                  {result.excerpt}
                                </p>
                              )}
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 transition-colors ${
                                isDark
                                  ? "text-stone-800 group-hover:text-red-900"
                                  : "text-stone-200 group-hover:text-stone-800"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredPosts.length > 0 && (
                    <section>
                      <h3
                        className={`text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-6 border-b pb-2 ${
                          isDark ? "border-stone-800" : "border-stone-100"
                        }`}
                      >
                        Journal Entries ({filteredPosts.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredPosts.map((post) => (
                          <div
                            key={post.id}
                            onClick={() => onPostClick(post)}
                            className={`p-6 border cursor-pointer group flex items-center justify-between transition-all ${
                              isDark
                                ? "bg-stone-900/40 border-stone-800 hover:border-red-900"
                                : "bg-white border-stone-100 hover:border-stone-400"
                            }`}
                          >
                            <div>
                              <span
                                className={`text-[8px] uppercase tracking-widest font-bold block mb-1 ${
                                  isDark ? "text-red-900" : "text-stone-400"
                                }`}
                              >
                                {post.category}
                              </span>
                              <h4
                                className={`text-lg font-serif font-bold transition-colors ${
                                  isDark
                                    ? "text-stone-200 group-hover:text-white"
                                    : "text-stone-800 group-hover:text-stone-600"
                                }`}
                              >
                                {post.title}
                              </h4>
                            </div>
                            <ChevronRight
                              className={`w-5 h-5 transition-colors ${
                                isDark
                                  ? "text-stone-800 group-hover:text-red-900"
                                  : "text-stone-200 group-hover:text-stone-800"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredFragments.length > 0 && (
                    <section>
                      <h3
                        className={`text-[10px] tracking-[0.3em] uppercase text-stone-400 font-bold mb-6 border-b pb-2 ${
                          isDark ? "border-stone-800" : "border-stone-100"
                        }`}
                      >
                        Thinking Fragments ({filteredFragments.length})
                      </h3>
                      <div className="space-y-4">
                        {filteredFragments.map((fragment) => (
                          <div
                            key={fragment.id}
                            className={`p-6 border-l-4 relative group ${
                              isDark
                                ? "bg-stone-900/20 border-red-900"
                                : "bg-stone-50/50 border-stone-300"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[8px] font-bold text-stone-400">
                                #{String(fragment.id).padStart(3, "0")} / {fragment.date}
                              </span>
                              <MessageSquare
                                className={`w-3 h-3 ${
                                  isDark ? "text-stone-800" : "text-stone-200"
                                }`}
                              />
                            </div>
                            <p
                              className={`font-handwriting text-sm leading-relaxed ${
                                isDark ? "text-stone-400" : "text-stone-700"
                              }`}
                            >
                              {fragment.content}
                            </p>
                            <div className="mt-2 flex gap-2">
                              {fragment.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[8px] text-stone-500 uppercase"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {totalResults === 0 && !isRemoteLoading && (
                    <div className="py-20 text-center">
                      <p
                        className={`font-serif italic text-2xl ${
                          isDark ? "text-stone-700" : "text-stone-300"
                        }`}
                      >
                        {`“${query}”에 대한 기록을 찾을 수 없습니다.`}
                      </p>
                      <p className="text-stone-400 text-xs mt-2 uppercase tracking-widest">
                        다른 색인 키워드를 시도해 보세요.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className={`p-4 border-t text-center ${
                isDark ? "bg-stone-900/50 border-stone-800" : "bg-stone-100/50 border-stone-200"
              }`}
            >
              <span className="text-[9px] uppercase tracking-[0.5em] text-stone-400">
                Esc to close • Enter to search
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
