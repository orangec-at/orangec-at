"use client";

import { BlogPostMeta } from "@/lib/blog-utils.server";
import { Post, Fragment } from "@/components/knowledge-shelf/types";
import { Hero } from "@/components/knowledge-shelf/components/Hero";
import { FeaturedPosts } from "@/components/knowledge-shelf/components/FeaturedPosts";
import { Marginalia } from "@/components/knowledge-shelf/components/Marginalia";
import { SkillsSection } from "@/components/knowledge-shelf/components/SkillsSection";
import { Footer } from "@/components/knowledge-shelf/components/Footer";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState, useCallback } from "react";
import { useTheme } from "@/contexts/theme-context";

import { useSession } from "next-auth/react";

interface HomeClientProps {
  initialPosts: Post[];
  initialFragments: Fragment[];
}

export default function HomeClient({
  initialPosts,
  initialFragments,
}: HomeClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const { theme } = useTheme();
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  const themeMode = theme === "dark" ? "dark" : "light";

  const handlePostClick = useCallback(
    (post: Post) => {
      router.push(withLocalePath(locale, `/blog/${post.slug}`));
    },
    [locale, router]
  );

  const handleCatalogClick = () => router.push(withLocalePath(locale, "/catalog"));
  const handleThreadsClick = () => router.push(withLocalePath(locale, "/threads"));
  
  const handleAdminClick = () => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }
    if (session.user?.role !== "ADMIN") {
      alert("서고지기 전용 구역입니다. 접근 권한이 없습니다.");
      return;
    }
    router.push(withLocalePath(locale, "/dashboard"));
  };
  const handleDesignSystemClick = () => router.push(withLocalePath(locale, "/test-design"));

  const handleHighlight = (text: string) => {
    if (highlightedTexts.has(text)) return;
    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  return (
    <>
      <Hero
        onSearchOpen={() => {}} 
        onAdminSecret={handleAdminClick}
        theme={themeMode}
      />
      <FeaturedPosts
        posts={initialPosts}
        onPostClick={handlePostClick}
        onCatalogClick={handleCatalogClick}
        theme={themeMode}
      />
      <Marginalia
        snippets={initialFragments}
        onViewAll={handleThreadsClick}
        onLike={() => {}}
        highlightedTexts={highlightedTexts}
        onHighlight={handleHighlight}
        theme={themeMode}
      />
      <SkillsSection theme={themeMode} />
      <Footer
        onAdminSecret={handleAdminClick}
        onDesignSystemClick={handleDesignSystemClick}
        theme={themeMode}
      />
    </>
  );
}
