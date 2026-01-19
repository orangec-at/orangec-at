"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Search,
  Moon,
  Sun,
  Settings,
  X,
  ChevronUp,
  ArrowUpRight,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useLocale } from "next-intl";
import { ChatMessages } from "@/components/rag/chat-messages";
import { ChatInput } from "@/components/rag/chat-input";
import { streamChat, type ChatMessage, type SourceDocument } from "@/lib/rag-client";
import { withLocalePath } from "@/lib/locale-path";
import { KineticSearchModal } from "@/components/kinetic/kinetic-search-modal";
import { useBackgroundMusic } from "@/components/layout/background-music";

type PanelType = "chat" | "music" | "settings" | null;

export function KineticGadgetToolbar() {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const isDark = theme === "dark";
  const { isPlaying, currentTrack, toggle, next, previous } = useBackgroundMusic();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((current) => (current === panel ? null : panel));
  }, []);

  const handleChatSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setSources([]);

    try {
      let assistantContent = "";
      const assistantMessage: ChatMessage = { role: "assistant", content: "" };

      for await (const chunk of streamChat(query, locale)) {
        if (chunk.type === "sources") {
          setSources(chunk.sources || []);
        } else if (chunk.type === "content") {
          assistantContent += chunk.content || "";
          assistantMessage.content = assistantContent;

          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === "assistant") {
              return [...prev.slice(0, -1), { ...assistantMessage }];
            }
            return [...prev, { ...assistantMessage }];
          });
        } else if (chunk.type === "done") {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: locale === "ko"
          ? "죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
          : "Sorry, an error occurred. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const welcomeMessage = locale === "ko"
    ? "안녕하세요! 블로그 콘텐츠에 대해 궁금한 점을 물어보세요."
    : "Hello! Ask me anything about the blog content.";

  const toolbarButtons = [
    { id: "chat" as const, icon: MessageCircle, label: locale === "ko" ? "채팅" : "Chat", ariaLabel: "Open chat" },
    { id: "search" as const, icon: Search, label: locale === "ko" ? "검색" : "Search", ariaLabel: "Open search", action: () => {
      setActivePanel(null);
      setIsSearchOpen(true);
    } },
    { id: "music" as const, icon: Music, label: locale === "ko" ? "음악" : "Music", ariaLabel: "Open music player" },
    { id: "theme" as const, icon: isDark ? Sun : Moon, label: isDark ? "Light" : "Dark", ariaLabel: "Toggle theme", action: toggleTheme },
    { id: "settings" as const, icon: Settings, label: locale === "ko" ? "설정" : "Settings", ariaLabel: "Open settings" },
  ];

  return (
    <>
      <KineticSearchModal
        isOpen={isSearchOpen}
        locale={locale}
        posts={[]}
        fragments={[]}
        onClose={() => setIsSearchOpen(false)}
        onPostClick={(post) => {
          router.push(withLocalePath(locale, `/catalog/${post.slug}`));
          setIsSearchOpen(false);
        }}
      />

      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setActivePanel(null)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-[90vw] max-w-lg"
            >
              {activePanel === "chat" && (
                <div className="bg-[#f4f1ea] dark:bg-black border-2 border-kinetic-orange overflow-hidden shadow-2xl">
                  <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-kinetic-orange -skew-y-1 origin-left" />
                    <div className="flex items-center justify-between px-6 py-5 border-b border-stone-300 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-kinetic-orange flex items-center justify-center -skew-x-3">
                          <MessageCircle className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF5F1F]">
                            {locale === "ko" ? "AI 어시스턴트" : "AI Assistant"}
                          </h3>
                          <p className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                            {locale === "ko" ? "지식 탐색 도우미" : "Knowledge Navigator"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="group w-10 h-10 border-2 border-stone-300 dark:border-white/20 flex items-center justify-center text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:border-kinetic-orange hover:text-black transition-all duration-300"
                      >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>

                  <div className="h-[400px] flex flex-col">
                    <ChatMessages
                      messages={messages}
                      sources={sources}
                      isLoading={isLoading}
                      welcomeMessage={welcomeMessage}
                    />
                    <div className="border-t border-stone-300 dark:border-white/20 p-4 bg-stone-100 dark:bg-black/50">
                      <ChatInput onSubmit={handleChatSubmit} isLoading={isLoading} locale={locale} />
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "music" && (
                <div className="bg-[#f4f1ea] dark:bg-black border-2 border-kinetic-orange overflow-hidden shadow-2xl">
                  <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-kinetic-orange -skew-y-1 origin-left" />
                    <div className="flex items-center justify-between px-6 py-5 border-b border-stone-300 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-kinetic-orange flex items-center justify-center -skew-x-3">
                          <Music className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF5F1F]">
                            {locale === "ko" ? "배경 음악" : "Background Music"}
                          </h3>
                          <p className="font-mono text-[9px] uppercase tracking-widest text-[#78716c] dark:text-white/60">
                            {locale === "ko" ? "집중 모드" : "Focus Mode"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="group w-10 h-10 border-2 border-stone-300 dark:border-white/20 flex items-center justify-center text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:border-kinetic-orange hover:text-black transition-all duration-300"
                      >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="group border-t border-stone-300 dark:border-white/10 py-6 -mx-6 px-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-[#FF5F1F] text-sm">(01)</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#78716c] dark:text-white/60">
                          {locale === "ko" ? "지금 재생 중" : "Now Playing"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 border-2 border-kinetic-orange flex items-center justify-center -skew-x-3 transition-all duration-300 ${isPlaying ? "bg-kinetic-orange" : "bg-transparent"}`}>
                            {isPlaying ? (
                              <div className="flex gap-0.5 items-end h-6">
                                {[...Array(4)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ height: [8, 20, 8] }}
                                    transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-1 bg-black"
                                  />
                                ))}
                              </div>
                            ) : (
                              <Music className="w-6 h-6 text-kinetic-orange" />
                            )}
                          </div>
                          <div>
                            <p className="font-serif text-xl font-bold text-[#1c1917] dark:text-white">
                              {currentTrack}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/60 mt-1">
                              {isPlaying ? (locale === "ko" ? "재생 중" : "Playing") : (locale === "ko" ? "일시정지" : "Paused")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="group border-t border-stone-300 dark:border-white/10 py-6 -mx-6 px-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-mono text-[#FF5F1F] text-sm">(02)</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#78716c] dark:text-white/60">
                          {locale === "ko" ? "컨트롤" : "Controls"}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={previous}
                          className="w-12 h-12 border-2 border-stone-300 dark:border-white/20 flex items-center justify-center text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:border-kinetic-orange hover:text-black transition-all duration-300"
                          aria-label={locale === "ko" ? "이전 트랙" : "Previous track"}
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                          onClick={toggle}
                          className="w-16 h-16 bg-kinetic-orange text-black flex items-center justify-center -skew-x-3 hover:scale-105 transition-transform duration-300 shadow-lg"
                          aria-label={isPlaying ? (locale === "ko" ? "일시정지" : "Pause") : (locale === "ko" ? "재생" : "Play")}
                        >
                          {isPlaying ? (
                            <Pause className="w-7 h-7" />
                          ) : (
                            <Play className="w-7 h-7 ml-1" />
                          )}
                        </button>
                        <button
                          onClick={next}
                          className="w-12 h-12 border-2 border-stone-300 dark:border-white/20 flex items-center justify-center text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:border-kinetic-orange hover:text-black transition-all duration-300"
                          aria-label={locale === "ko" ? "다음 트랙" : "Next track"}
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-300 dark:border-white/10 text-center">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#78716c] dark:text-white/50">
                        {locale === "ko" ? "MUJI 스타일 배경음악" : "MUJI-Style Background Music"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === "settings" && (
                <div className="bg-[#f4f1ea] dark:bg-black border-2 border-kinetic-orange overflow-hidden shadow-2xl">
                  <div className="relative">
                    <div className="absolute inset-x-0 top-0 h-1 bg-kinetic-orange -skew-y-1 origin-left" />
                    <div className="flex items-center justify-between px-6 py-5 border-b border-stone-300 dark:border-white/20">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-kinetic-orange flex items-center justify-center -skew-x-3">
                          <Settings className="w-5 h-5 text-black" />
                        </div>
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF5F1F]">
                          {locale === "ko" ? "설정" : "Settings"}
                        </h3>
                      </div>
                      <button
                        onClick={() => setActivePanel(null)}
                        className="group w-10 h-10 border-2 border-stone-300 dark:border-white/20 flex items-center justify-center text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:border-kinetic-orange hover:text-black transition-all duration-300"
                      >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="group border-t border-stone-300 dark:border-white/10 py-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 cursor-pointer -mx-6 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[#FF5F1F] text-sm">(01)</span>
                          <div>
                            <p className="font-serif text-2xl font-bold text-[#1c1917] dark:text-white group-hover:translate-x-2 transition-transform duration-300">
                              {locale === "ko" ? "테마" : "Theme"}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/60 mt-1">
                              {isDark ? (locale === "ko" ? "다크 모드" : "Dark Mode") : (locale === "ko" ? "라이트 모드" : "Light Mode")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={toggleTheme}
                          className="flex items-center gap-2 px-4 py-2 bg-kinetic-orange text-black font-mono text-[10px] uppercase tracking-widest hover:bg-[#1c1917] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                        >
                          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                          <span>{locale === "ko" ? "전환" : "Toggle"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="group border-t border-stone-300 dark:border-white/10 py-6 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300 -mx-6 px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-[#FF5F1F] text-sm">(02)</span>
                          <div>
                            <p className="font-serif text-2xl font-bold text-[#1c1917] dark:text-white group-hover:translate-x-2 transition-transform duration-300">
                              {locale === "ko" ? "언어" : "Language"}
                            </p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#78716c] dark:text-white/60 mt-1">
                              {locale === "ko" ? "한국어" : "English"}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-kinetic-orange opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300" />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-stone-300 dark:border-white/10 text-center">
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#78716c] dark:text-white/50">
                        OrangeCat® v2.0 / Kinetic Orange
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative"
            >
              <div className="absolute -top-1 left-4 right-4 h-0.5 bg-kinetic-orange -skew-x-12" />
              
              <div className="bg-[#f4f1ea]/95 dark:bg-black/95 border-2 border-stone-300 dark:border-white/10 rounded-full px-2 py-2 shadow-2xl flex items-center gap-1 backdrop-blur-sm">
                {toolbarButtons.map((button) => {
                  const Icon = button.icon;
                  const isActive = activePanel === button.id;

                  return (
                    <motion.button
                      key={button.id}
                      onClick={() => {
                        if (button.action) {
                          button.action();
                        } else {
                          togglePanel(button.id as PanelType);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full border-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                        isActive
                          ? "bg-kinetic-orange text-black border-kinetic-orange"
                          : "text-[#78716c] dark:text-white/70 border-transparent hover:bg-kinetic-orange hover:text-black hover:border-kinetic-orange"
                      }`}
                      aria-label={button.ariaLabel}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{button.label}</span>
                      <ArrowUpRight className={`w-3 h-3 absolute -top-1 -right-1 text-kinetic-orange opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300 ${isActive ? 'hidden' : ''}`} />
                    </motion.button>
                  );
                })}

                <div className="w-px h-8 bg-stone-300 dark:bg-white/20 mx-1" />

                <motion.button
                  onClick={() => setIsMinimized(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center justify-center w-10 h-10 rounded-full border-2 border-stone-300 dark:border-white/10 text-[#78716c] dark:text-white/70 hover:bg-kinetic-orange hover:text-black hover:border-kinetic-orange transition-all duration-300"
                  aria-label="Minimize toolbar"
                >
                  <ChevronUp className="w-4 h-4 rotate-180 group-hover:rotate-0 transition-transform duration-300" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isMinimized && (
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={() => setIsMinimized(false)}
              className="group relative w-14 h-14 bg-kinetic-orange text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform -skew-x-3"
              aria-label="Expand toolbar"
            >
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-black" />
              <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
