"use client";

import { Post, Fragment } from "@/lib/types";
import {
  KineticHero,
  MarqueeSection,
  KineticProjects,
  KineticServices,
  KineticFooter,
  KineticPosts,
  KineticMarginalia,
} from "@/components/kinetic";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState, useCallback } from "react";

interface HomeClientProps {
  initialPosts: Post[];
  initialFragments: Fragment[];
}

export default function HomeClient({
  initialPosts,
  initialFragments,
}: HomeClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  const handlePostClick = useCallback(
    (post: Post) => {
      router.push(withLocalePath(locale, `/catalog/${post.slug}`));
    },
    [locale, router]
  );

  const handleCatalogClick = () => router.push(withLocalePath(locale, "/catalog"));
  const handleThreadsClick = () => router.push(withLocalePath(locale, "/threads"));

  const handleHighlight = (text: string) => {
    if (highlightedTexts.has(text)) return;
    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-kinetic-orange text-black selection:bg-black selection:text-kinetic-orange dark:bg-black dark:text-white dark:selection:bg-kinetic-orange dark:selection:text-black">
      <KineticHero
        title={"Orange\nCat"}
        subtitle="Full-Stack Engineer & Builder"
        location="Seoul, Korea"
        role={"Frontend Dev\nSince 2019"}
      />

      <MarqueeSection
        line1="BUILD * SHIP * ITERATE * SCALE *"
        line2="REACT * TYPESCRIPT * NEXT.JS * NODE *"
      />

      <KineticProjects />

      <KineticServices
        title="Stack"
        services={[
          { title: "Frontend", tags: ["React", "TypeScript", "Next.js", "React Native", "Tailwind"] },
          { title: "Backend", tags: ["Node.js", "NestJS", "Supabase", "PostgreSQL"] },
          { title: "DevOps", tags: ["Monorepo", "CI/CD", "Docker", "AWS"] },
          { title: "AI/LLM", tags: ["RAG", "LangChain", "Claude", "OpenAI"] },
        ]}
      />

      <KineticPosts
        posts={initialPosts}
        onPostClick={handlePostClick}
        onCatalogClick={handleCatalogClick}
      />

      <KineticMarginalia
        snippets={initialFragments}
        onViewAll={handleThreadsClick}
        onLike={() => {}}
        highlightedTexts={highlightedTexts}
        onHighlight={handleHighlight}
      />

      <KineticFooter
        title="Let's Talk"
        email="radio941016@gmail.com"
        copyright="2024 OrangeCat"
        socialLinks={["GitHub", "LinkedIn", "App Store"]}
      />
    </div>
  );
}
