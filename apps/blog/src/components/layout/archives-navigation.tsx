"use client";

import { ReactNode, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/contexts/theme-context";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { Navbar } from "@/components/knowledge-shelf/components/Navbar";
import { GadgetToolbar } from "@/components/GadgetToolbar";
import { SearchModal } from "@/components/knowledge-shelf/components/SearchModal";
import type { Post, ViewState } from "@/components/knowledge-shelf/types";
import { useSession } from "next-auth/react";

interface ArchivesNavigationProps {
  children: ReactNode;
}

export default function ArchivesNavigation({ children }: ArchivesNavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";
  const inkPoints = session?.user?.inkPoints ?? 0;
  const highlightedTexts = new Set<string>();

  const currentView: ViewState = pathname.includes("/about")
    ? "about"
    : pathname.includes("/threads")
    ? "threads"
    : pathname.includes("/profile")
    ? "profile"
    : pathname.includes("/catalog")
    ? "catalog"
    : "home";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeMode = theme === "dark" ? "dark" : "light";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleCatalogClick = () => router.push(withLocalePath(locale, "/catalog"));
  const handleThreadsClick = () => router.push(withLocalePath(locale, "/threads"));
  const handleShopClick = () => router.push(withLocalePath(locale, "/shop"));
  const handleAboutClick = () => router.push(withLocalePath(locale, "/about"));
  const handleProfileClick = () => {
    if (!isLoggedIn) {
      router.push(withLocalePath(locale, "/login"));
      return;
    }
    router.push(withLocalePath(locale, "/profile"));
  };
  
  const handleAdminClick = () => {
    if (!isLoggedIn) {
      router.push(withLocalePath(locale, "/login"));
      return;
    }
    if (!isAdmin) {
      alert("서고지기 전용 구역입니다. 접근 권한이 없습니다.");
      return;
    }
    router.push(withLocalePath(locale, "/dashboard"));
  };

  const handleDesignSystemClick = () => router.push(withLocalePath(locale, "/test-design"));

  const handlePostClick = useCallback(
    (post: Post) => {
      router.push(withLocalePath(locale, `/catalog/${post.slug}`));
      setIsSearchOpen(false);
    },
    [locale, router]
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden w-full ${
        themeMode === "dark" ? "bg-[#121212] text-stone-300" : "bg-[#f4f1ea] text-stone-900"
      }`}
    >
      <Navbar
        scrolled={scrolled}
        currentView={currentView}
        theme={themeMode}
        onThemeToggle={toggleTheme}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onHomeClick={() => router.push(withLocalePath(locale, "/"))}
        onThreadsClick={handleThreadsClick}
        onCatalogClick={handleCatalogClick}
        onShopClick={handleShopClick}
        onAboutClick={handleAboutClick}
        onProfileClick={handleProfileClick}
        onAdminClick={handleAdminClick}
        onSearchOpen={() => setIsSearchOpen(true)}
        onDesignSystemClick={handleDesignSystemClick}
      />

      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        locale={locale}
        posts={[]}
        fragments={[]}
        onClose={() => setIsSearchOpen(false)}
        onPostClick={handlePostClick}
        theme={themeMode}
      />

      <GadgetToolbar
        isLoggedIn={isLoggedIn}
        onLoginToggle={() => router.push(withLocalePath(locale, isLoggedIn ? "/profile" : "/login"))}
        inkPoints={inkPoints}
        highlightedTexts={highlightedTexts}
        onAdminSecret={handleAdminClick}
        onThemeToggle={toggleTheme}
      />
    </div>
  );
}
