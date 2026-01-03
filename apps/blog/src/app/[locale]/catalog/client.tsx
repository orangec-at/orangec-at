"use client";

import { Catalog } from "@/components/knowledge-shelf/components/Catalog";
import { Post } from "@/components/knowledge-shelf/types";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

interface CatalogClientProps {
  initialPosts: Post[];
}

export default function CatalogClient({ initialPosts }: CatalogClientProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handlePostClick = (post: Post) => {
    router.push(withLocalePath(locale, `/catalog/${post.slug}`));
  };

  const themeMode = theme === "dark" ? "dark" : "light";

  return (
    <Catalog
      posts={initialPosts}
      onPostClick={handlePostClick}
      onBack={handleBack}
      onSearchOpen={() => {}}
      theme={themeMode}
    />
  );
}
