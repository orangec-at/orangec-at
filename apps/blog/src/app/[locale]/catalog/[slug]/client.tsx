"use client";

import { KineticPostDetail } from "@/components/kinetic";
import { Post } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface CatalogDetailClientProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts?: Post[];
}

export default function CatalogDetailClient({
  post,
  mdxSource,
  relatedPosts = [],
}: CatalogDetailClientProps) {
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

  const handlePostClick = (clickedPost: Post) => {
    router.push(withLocalePath(locale, `/catalog/${clickedPost.slug}`));
  };

  return (
    <KineticPostDetail
      post={post}
      mdxSource={mdxSource}
      isLoading={false}
      onBack={handleBack}
      highlightedTexts={highlightedTexts}
      onHighlight={handleHighlight}
      relatedPosts={relatedPosts}
      onPostClick={handlePostClick}
    />
  );
}
