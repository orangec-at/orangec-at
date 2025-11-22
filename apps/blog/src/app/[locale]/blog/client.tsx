"use client";

import BlogCard from "@/components/blog/blog-card";
import { MDXFrontmatter } from "@/types/frontmatter";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

interface BlogClientProps {
  posts: (MDXFrontmatter & { slug: string })[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const t = useTranslations("blog");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;

      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      const matchesTag =
        selectedTag === "all" || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchTerm, selectedCategory, selectedTag]);

  // 고유 카테고리와 태그 추출
  const categories = useMemo(() => {
    const cats = posts.map((p) => p.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [posts]);

  const tags = useMemo(() => {
    const allTags = posts.flatMap((p) => p.tags);
    return [...new Set(allTags)];
  }, [posts]);

  return (
    <div className="px-4 py-8 md:px-16 md:py-12 space-y-8">
      {/* 헤더 */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t("subtitle")}
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* 필터 버튼들 */}
        <div className="flex flex-wrap gap-2">
          {/* 카테고리 필터 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">{t("allCategories")}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* 태그 필터 */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">{t("allTags")}</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>

          {/* 필터 초기화 */}
          {(searchTerm ||
            selectedCategory !== "all" ||
            selectedTag !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedTag("all");
              }}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>

      {/* 결과 카운트 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t("postCount", { count: filteredPosts.length })}
      </div>

      {/* 포스트 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.slug}
            title={post.title}
            date={post.date}
            slug={post.slug}
            description={post.description}
            author={post.author}
            category={post.category}
            thumbnail={post.thumbnail}
            readTime={post.readTime}
            tags={post.tags}
            featured={post.featured}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t("noPostsFound")}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{t("adjustSearch")}</p>
        </div>
      )}
    </div>
  );
}
