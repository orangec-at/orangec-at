import HomeClient from "./client";
import { getBlogPostsByLocale } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { getShelfMarginaliaFragments } from "@/lib/knowledge-shelf-marginalia.server";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({
  params,
}: HomePageProps) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const blogPosts = await getBlogPostsByLocale(resolvedLocale);
  const { posts, fragments: fallbackFragments } = buildKnowledgeShelfDataFromBlogMeta(
    blogPosts,
    resolvedLocale
  );

  const marginaliaFragments = await getShelfMarginaliaFragments(24);
  const fragments =
    marginaliaFragments.length > 0 ? marginaliaFragments : fallbackFragments;

  return (
    <HomeClient
      initialPosts={posts}
      initialFragments={fragments}
    />
  );
}
