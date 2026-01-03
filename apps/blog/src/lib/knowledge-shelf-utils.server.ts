import type { BlogPostMeta } from "@/lib/blog-utils.server";
import { translateCategory, translateTag } from "@/types/frontmatter";

import type { Fragment, Post } from "@/components/knowledge-shelf/types";

type KnowledgeShelfData = {
  posts: Post[];
  fragments: Fragment[];
};

function toDisplayCategory(meta: BlogPostMeta, locale: string): string {
  if (!meta.category) return locale === "ko" ? "기록" : "Journal";
  return translateCategory(meta.category, locale);
}

function toDisplayTags(meta: BlogPostMeta, locale: string): string[] {
  return (meta.tags ?? []).map((tag) => translateTag(tag, locale));
}

function toCardColor(meta: BlogPostMeta): string {
  switch (meta.category) {
    case "dev-diary":
      return "bg-stone-800";
    case "tech-review":
      return "bg-stone-500";
    case "project":
      return "bg-stone-300";
    case "tutorial":
      return "bg-stone-400";
    case "retrospective":
      return "bg-stone-600";
    case "tech-guide":
      return "bg-stone-700";
    default:
      return "bg-stone-500";
  }
}

function toIsoDateValue(date: string): number {
  const dateValue = Date.parse(date);
  return Number.isFinite(dateValue) ? dateValue : 0;
}

function toFragmentDate(isoDate: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  return isoDate.replace(/-/g, ".");
}

export function buildKnowledgeShelfDataFromBlogMeta(
  blogPosts: BlogPostMeta[],
  locale: string
): KnowledgeShelfData {
  const sorted = [...blogPosts]
    .filter((post) => !post.draft)
    .sort((a, b) => toIsoDateValue(b.date) - toIsoDateValue(a.date));

  const posts: Post[] = sorted.map((post, idx) => ({
    id: String(idx + 1).padStart(3, "0"),
    slug: post.slug,
    locale,
    title: post.title,
    category: toDisplayCategory(post, locale),
    date: post.date,
    color: toCardColor(post),
    content: post.description ?? "",
    tags: toDisplayTags(post, locale),
    readTime: post.readTime,
    thumbnail: post.thumbnail,
    featured: post.featured,
    draft: post.draft,
  }));

  const fragments: Fragment[] = posts
    .filter((post) => post.content.trim() !== "")
    .slice(0, 24)
    .map((post, idx) => ({
      id: post.slug,
      content: post.content,
      date: toFragmentDate(post.date),
      tags: (post.tags ?? []).slice(0, 3).map((tag) => `#${tag}`),
      rotation: [-2, 1, -1, 2][idx % 4],
    }));

  return { posts, fragments };
}
