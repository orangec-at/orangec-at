import HomeClient from "./client";
import { getBlogPostsByLocale } from "@/lib/blog-utils.server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const blogPosts = await getBlogPostsByLocale(resolvedLocale);

  return <HomeClient locale={resolvedLocale} recentPosts={blogPosts.slice(0, 3)} />;
}
