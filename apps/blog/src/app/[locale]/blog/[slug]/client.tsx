"use client";

import { BlogCTASection } from "@/components/blog/blog-cta-section";
import { mdxComponents } from "@/components/blog/mdx-components";
import { RelatedProjectsSection } from "@/components/blog/related-projects-section";
import { Button } from "@/components/ui";
import { BlogPostMeta, getRelatedProjects } from "@/lib/blog-utils";
import { translateCategory, translateTag } from "@/types/frontmatter";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Link from "next/link";

interface BlogPostClientProps {
  mdxSource: MDXRemoteSerializeResult;
  blogMeta: BlogPostMeta | null;
  blogSlug: string;
  locale?: string;
  availableTranslations?: string[];
}

export default function BlogPostClient({
  mdxSource,
  blogMeta,
  blogSlug,
  locale = "ko",
  availableTranslations = [],
}: BlogPostClientProps) {
  const relatedProjects = getRelatedProjects(blogSlug);

  return (
    <div className="min-h-screen bg-background prevent-horizontal-scroll">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl w-full prevent-horizontal-scroll">
        {/* Language Switcher */}
        {availableTranslations.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {availableTranslations.map((availableLocale) => (
              <Button
                key={availableLocale}
                asChild
                variant={locale === availableLocale ? "default" : "outline"}
                size="sm"
              >
                <Link href={`/${availableLocale}/blog/${blogSlug}`}>
                  {availableLocale === "ko" ? "한국어" : "English"}
                </Link>
              </Button>
            ))}
          </div>
        )}

        {/* Blog Header */}
        {blogMeta && (
          <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              {blogMeta.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              <span className="flex items-center gap-1">
                📅
                {new Date(blogMeta.date).toLocaleDateString(
                  locale === "ko" ? "ko-KR" : "en-US"
                )}
              </span>
              {blogMeta.readTime && (
                <span className="flex items-center gap-1">
                  ⏱️ {blogMeta.readTime}
                </span>
              )}
              {blogMeta.category && (
                <span className="flex items-center gap-1">
                  📂 {translateCategory(blogMeta.category, locale)}
                </span>
              )}
            </div>
            {blogMeta.description && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {blogMeta.description}
              </p>
            )}
            {blogMeta.tags && blogMeta.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {blogMeta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs sm:text-sm font-medium"
                  >
                    #{translateTag(tag, locale)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <article
          className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none w-full overflow-x-hidden
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:break-words
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:break-words
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:break-words
          prose-pre:bg-transparent prose-pre:p-0 prose-pre:overflow-x-auto prose-pre:max-w-full
          prose-blockquote:border-l-blue-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:break-words
          prose-table:text-gray-700 dark:prose-table:text-gray-300 prose-table:max-w-full prose-table:overflow-x-auto"
        >
          <MDXRemote {...mdxSource} components={mdxComponents} lazy />
        </article>

        <RelatedProjectsSection projects={relatedProjects} />

        <BlogCTASection />
      </div>
    </div>
  );
}
