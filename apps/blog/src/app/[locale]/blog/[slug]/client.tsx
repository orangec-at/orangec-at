"use client";

import { BlogCatalog } from "@/components/blog/blog-catalog";
import { BlogPostDetail } from "@/components/blog/post-detail";
import type { Project } from "@/data/projects";
import { withLocalePath } from "@/lib/locale-path";
import { Post } from "@/lib/types";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";

interface BlogDetailClientProps {
  post: Post;
  mdxSource: MDXRemoteSerializeResult | null;
  relatedPosts?: Post[];
  relatedProject?: Project;
  children?: ReactNode;
}

export default function BlogDetailClient({
  post,
  mdxSource,
  relatedPosts = [],
  relatedProject,
  children,
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
    <>
      <BlogPostDetail
        post={post}
        mdxSource={mdxSource}
        isLoading={false}
        onBack={handleBack}
        highlightedTexts={highlightedTexts}
        onHighlight={handleHighlight}
        relatedPosts={relatedPosts}
        onPostClick={handlePostClick}
      >
        {children}
      </BlogPostDetail>
      {relatedProject && (
        <section className="pb-16">
          <div className="container-narrow">
            <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-background/70 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Related Project
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {locale === "ko"
                  ? relatedProject.title
                  : relatedProject.titleEn || relatedProject.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {locale === "ko"
                  ? relatedProject.description
                  : relatedProject.descriptionEn || relatedProject.description}
              </p>
              <Link
                href={withLocalePath(locale, `/projects/${relatedProject.id}`)}
                className="mt-4 inline-flex text-sm font-medium text-foreground/80 transition-colors hover:text-ember-accent"
              >
                View project
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

interface BlogIndexClientProps {
  initialPosts: Post[];
}

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const router = useRouter();
  const locale = useLocale();

  const handlePostClick = (post: Post) => {
    router.push(withLocalePath(locale, `/blog/${post.slug}`));
  };

  return (
    <BlogCatalog
      posts={initialPosts}
      onPostClick={handlePostClick}
    />
  );
}
