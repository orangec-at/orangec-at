import { getBlogPostsByLocale } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import CatalogClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "카탈로그 | OrangeCat" : "Catalog | OrangeCat",
    description: isKo
      ? "서고의 모든 기록물을 한눈에 확인합니다."
      : "View all archives in the library at a glance.",
  };
}

export default async function CatalogPage({
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

  return <CatalogClient initialPosts={posts} />;
}
