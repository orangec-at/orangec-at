"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { withLocalePath } from "@/lib/locale-path";

import type { Fragment, Post, ThemeMode, ViewState } from "./types";

import { About } from "./components/About";
import { AdminDashboard } from "./components/AdminDashboard";
import { Catalog } from "./components/Catalog";
import { DesignSystem } from "./components/DesignSystem";
import { FeaturedPosts } from "./components/FeaturedPosts";
import { Footer } from "./components/Footer";
import { GadgetToolbar } from "./components/GadgetToolbar";
import { Hero } from "./components/Hero";
import { Marginalia } from "./components/Marginalia";
import { Navbar } from "./components/Navbar";
import { PostDetail } from "./components/PostDetail";
import { Profile } from "./components/Profile";
import { SearchModal } from "./components/SearchModal";
import { Shop } from "./components/Shop";
import { SkillsSection } from "./components/SkillsSection";
import { ThreadsArchive } from "./components/ThreadsArchive";

type KnowledgeShelfAppProps = {
  locale: string;
  initialPosts: Post[];
  initialFragments: Fragment[];
  initialSelectedSlug?: string;
};

export default function KnowledgeShelfApp({
  locale,
  initialPosts,
  initialFragments,
  initialSelectedSlug,
}: KnowledgeShelfAppProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>("home");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPostMdx, setSelectedPostMdx] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [inkPoints, setInkPoints] = useState(450);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalAnnouncement, setGlobalAnnouncement] = useState(
    "새로운 리서치 Journal Vol. 042가 발간되었습니다. 지식의 파편을 수집해 보세요."
  );
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (view === "admin" || view === "design-system") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [view]);

  useEffect(() => {
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousBodyColor = document.body.style.color;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#d6d3d1";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f4f1ea";
      document.body.style.color = "#1c1917";
    }

    return () => {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = previousBodyBackground;
      document.body.style.color = previousBodyColor;
    };
  }, [theme]);


  const handleHomeClick = () => {
    setView("home");
    setSelectedPost(null);
    setSelectedPostMdx(null);
    setIsPostLoading(false);
    router.push(pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostClick = useCallback(
    async (post: Post, syncUrl: boolean = true) => {
      setSelectedPost(post);
      setView("post");
      setIsSearchOpen(false);
      setSelectedPostMdx(null);
      setIsPostLoading(true);

      if (syncUrl) {
        const url = `${pathname}?post=${encodeURIComponent(post.slug)}`;
        router.push(url);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const res = await fetch(
          `/api/knowledge-shelf/post?slug=${encodeURIComponent(
            post.slug
          )}&locale=${encodeURIComponent(post.locale)}`,
          { method: "GET" }
        );

        if (!res.ok) {
          throw new Error(`Failed to load post content: ${res.status}`);
        }

        const data: { mdxSource?: MDXRemoteSerializeResult } = await res.json();
        setSelectedPostMdx(data.mdxSource ?? null);
      } catch {
        setSelectedPostMdx(null);
      } finally {
        setIsPostLoading(false);
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!initialSelectedSlug) return;

    const post = initialPosts.find((p) => p.slug === initialSelectedSlug);
    if (!post) return;

    void handlePostClick(post, false);
  }, [handlePostClick, initialPosts, initialSelectedSlug]);

  const handleThreadsClick = () => {
    setView("threads");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCatalogClick = () => {
    router.push(withLocalePath(locale, "/blog"));
  };

  const handleShopClick = () => {
    router.push(withLocalePath(locale, "/shop"));
  };

  const handleAboutClick = () => {
    setView("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setView("profile");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsLoggedIn(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAdminClick = () => {
    router.push(withLocalePath(locale, "/dashboard"));
  };

  const handleDesignSystemClick = () => {
    setView("design-system");
  };

  const handleHighlight = (text: string) => {
    if (highlightedTexts.has(text)) return;

    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });

    setInkPoints((prev) => prev + 15);
  };

  const handleLike = () => {
    if (isLoggedIn) {
      setInkPoints((prev) => prev + 5);
    }
  };

  const handleNewsletterSignup = (email: string) => {
    console.log(`Newsletter signup for: ${email}`);
    setIsSubscribed(true);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#121212] text-stone-300"
          : "bg-[#f4f1ea] text-stone-900"
      } ${view === "admin" || view === "design-system" ? "h-screen overflow-hidden" : ""}`}
    >
      {view !== "admin" && view !== "design-system" && (
        <Navbar
          scrolled={scrolled}
          currentView={view}
          theme={theme}
          onThemeToggle={toggleTheme}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onHomeClick={handleHomeClick}
          onThreadsClick={handleThreadsClick}
          onCatalogClick={handleCatalogClick}
          onShopClick={handleShopClick}
          onAboutClick={handleAboutClick}
          onProfileClick={handleProfileClick}
          onAdminClick={handleAdminClick}
          onSearchOpen={() => setIsSearchOpen(true)}
          onDesignSystemClick={handleDesignSystemClick}
        />
      )}

      <AnimatePresence>
        {isAnnouncementVisible &&
          globalAnnouncement &&
          view !== "admin" &&
          view !== "design-system" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`fixed top-20 left-0 right-0 z-40 backdrop-blur-sm border-b overflow-hidden transition-colors ${
                theme === "dark"
                  ? "bg-red-950/80 border-red-900"
                  : "bg-yellow-100/90 border-yellow-200"
              }`}
            >
              <div className="container mx-auto px-6 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles
                    className={`w-3 h-3 animate-pulse ${
                      theme === "dark" ? "text-red-400" : "text-yellow-600"
                    }`}
                  />
                  <p
                    className={`text-[10px] md:text-xs font-serif italic tracking-tight ${
                      theme === "dark" ? "text-stone-300" : "text-stone-800"
                    }`}
                  >
                    {globalAnnouncement}
                  </p>
                </div>
                <button
                  onClick={() => setIsAnnouncementVisible(false)}
                  className={`p-1 rounded-full transition-colors ${
                    theme === "dark" ? "hover:bg-red-900" : "hover:bg-yellow-200"
                  }`}
                >
                  <X className="w-3 h-3 text-stone-400" />
                </button>
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      <main
        className={`flex-grow ${
          view === "admin" || view === "design-system"
            ? "h-screen overflow-hidden"
            : "overflow-hidden"
        } ${
          isAnnouncementVisible &&
          globalAnnouncement &&
          view !== "admin" &&
          view !== "design-system"
            ? "pt-8"
            : ""
        }`}
      >
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Hero
                onSearchOpen={() => setIsSearchOpen(true)}
                onAdminSecret={handleAdminClick}
                theme={theme}
              />
              <FeaturedPosts
                posts={initialPosts}
                onPostClick={handlePostClick}
                onCatalogClick={handleCatalogClick}
                theme={theme}
              />
              <Marginalia
                snippets={initialFragments}
                onViewAll={handleThreadsClick}
                onLike={handleLike}
                highlightedTexts={highlightedTexts}
                onHighlight={handleHighlight}
                theme={theme}
              />
              <SkillsSection theme={theme} />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "post" && selectedPost && (
            <motion.div
              key="post"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PostDetail
                post={selectedPost}
                mdxSource={selectedPostMdx}
                isLoading={isPostLoading}
                onBack={handleHomeClick}
                highlightedTexts={highlightedTexts}
                onHighlight={handleHighlight}
                theme={theme}
              />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "threads" && (
            <motion.div
              key="threads"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ThreadsArchive
                threads={initialFragments}
                onBack={handleHomeClick}
                onSearchOpen={() => setIsSearchOpen(true)}
                highlightedTexts={highlightedTexts}
                onHighlight={handleHighlight}
                theme={theme}
              />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "catalog" && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Catalog
                posts={initialPosts}
                onPostClick={handlePostClick}
                onBack={handleHomeClick}
                onSearchOpen={() => setIsSearchOpen(true)}
                theme={theme}
              />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "shop" && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <Shop
                onBack={handleHomeClick}
                inkPoints={inkPoints}
                isLoggedIn={isLoggedIn}
                theme={theme}
              />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <About onBack={handleHomeClick} theme={theme} />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Profile
                onBack={handleHomeClick}
                onAdminClick={handleAdminClick}
                isAdmin={isAdmin}
                inkPoints={inkPoints}
                highlightedTexts={highlightedTexts}
                isSubscribed={isSubscribed}
                onSubscriptionToggle={() => setIsSubscribed(!isSubscribed)}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setIsAdmin(false);
                  handleHomeClick();
                }}
                theme={theme}
              />
              <Footer
                onAdminSecret={handleAdminClick}
                onSubscribe={handleNewsletterSignup}
                onDesignSystemClick={handleDesignSystemClick}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <AdminDashboard
                onBack={handleHomeClick}
                onProfileBack={() => setView("profile")}
                onDesignSystemClick={handleDesignSystemClick}
                announcement={globalAnnouncement}
                onAnnouncementChange={(val: string) => {
                  setGlobalAnnouncement(val);
                  setIsAnnouncementVisible(true);
                }}
                theme={theme}
              />
            </motion.div>
          )}

          {view === "design-system" && (
            <motion.div
              key="design-system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <DesignSystem
                onBack={handleHomeClick}
                onAdminBack={handleAdminClick}
                fromAdmin={isAdmin}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        locale={locale}
        posts={initialPosts}
        fragments={initialFragments}
        onClose={() => setIsSearchOpen(false)}
        onPostClick={handlePostClick}
        theme={theme}
      />

      {view !== "profile" && view !== "admin" && view !== "design-system" && (
        <GadgetToolbar
          isLoggedIn={isLoggedIn}
          onLoginToggle={() => setIsLoggedIn(!isLoggedIn)}
          inkPoints={inkPoints}
          highlightedTexts={highlightedTexts}
          onAdminSecret={handleAdminClick}
          theme={theme}
          onThemeToggle={toggleTheme}
          currentView={view}
        />
      )}
    </div>
  );
}
