import { getBlogPostsByLocale } from "@/lib/blog-utils.server";
import { getShelfMarginaliaFragments } from "@/lib/knowledge-shelf-marginalia.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import ThreadsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "단상 | OrangeCat" : "Threads | OrangeCat",
    description: isKo
      ? "매일 한 줄씩, 기술과 삶에 대한 단상을 기록합니다."
      : "Recording daily fragments of thoughts on technology and life.",
  };
}

export default async function ThreadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const blogPosts = await getBlogPostsByLocale(resolvedLocale);
  const { fragments: fallbackFragments } = buildKnowledgeShelfDataFromBlogMeta(
    blogPosts,
    resolvedLocale
  );

  const marginaliaFragments = await getShelfMarginaliaFragments(48);
  const fragments =
    marginaliaFragments.length > 0 ? marginaliaFragments : fallbackFragments;

  return <ThreadsClient initialFragments={fragments} />;
}
