"use client";

import { KineticPostDetail } from "@/components/kinetic";
import { KineticCatalog } from "@/components/kinetic/kinetic-catalog";
import { Post } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface BlogDetailClientProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult;
  relatedPosts?: Post[];
}

export default function BlogDetailClient({
  post,
  mdxSource,
  relatedPosts = [],
}: BlogDetailClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  const handleBack = () => {
    router.push(withLocalePath(locale, "/blog"));
  };

  const handleHighlight = (text: string) => {
    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  const handlePostClick = (clickedPost: Post) => {
    router.push(withLocalePath(locale, `/blog/${clickedPost.slug}`));
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

interface BlogIndexClientProps {
  initialPosts: Post[];
}

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handlePostClick = (post: Post) => {
    router.push(withLocalePath(locale, `/blog/${post.slug}`));
  };

  return (
    <KineticCatalog
      posts={initialPosts}
      onPostClick={handlePostClick}
      onBack={handleBack}
    />
  );
}
