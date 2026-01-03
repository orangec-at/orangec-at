"use client";

import { PostDetail } from "@/components/knowledge-shelf/components/PostDetail";
import { Post } from "@/components/knowledge-shelf/types";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface CatalogDetailClientProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
}

export default function CatalogDetailClient({
  post,
  mdxSource,
}: CatalogDetailClientProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  const handleBack = () => {
    router.push(withLocalePath(locale, "/catalog"));
  };

  const handleHighlight = (text: string) => {
    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  const themeMode = theme === "dark" ? "dark" : "light";

  return (
    <PostDetail
      post={post}
      mdxSource={mdxSource}
      isLoading={false}
      onBack={handleBack}
      highlightedTexts={highlightedTexts}
      onHighlight={handleHighlight}
      theme={themeMode}
    />
  );
}
