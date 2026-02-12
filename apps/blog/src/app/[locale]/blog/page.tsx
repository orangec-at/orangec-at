import { getBlogPostsByLocale } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { BlogIndexClient } from "./[slug]/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "블로그 | OrangeCat" : "Blog | OrangeCat",
    description: isKo
      ? "오렌지캣의 생각과 기록들을 모아두었습니다."
      : "Thoughts and archives of OrangeCat.",
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const blogPosts = await getBlogPostsByLocale(resolvedLocale);
  const { posts } = buildKnowledgeShelfDataFromBlogMeta(
    blogPosts,
    resolvedLocale
  );

  return <BlogIndexClient initialPosts={posts} />;
}
