import BlogClient from "./client";
import { getBlogPostsByLocale } from "@/lib/blog-utils.server";

// 블로그 목록 페이지 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const canonicalUrl = `${baseUrl}/${resolvedLocale === "ko" ? "" : `${resolvedLocale}/`}blog`;

  const title = resolvedLocale === "ko" ? "블로그" : "Blog";
  const description =
    resolvedLocale === "ko"
      ? "개발 경험과 기술 인사이트를 공유하는 블로그입니다."
      : "A blog sharing development experiences and technical insights.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ko: `${baseUrl}/blog`,
        en: `${baseUrl}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Orange C At",
      locale: resolvedLocale === "ko" ? "ko_KR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";
  const posts = await getBlogPostsByLocale(resolvedLocale);

  return <BlogClient posts={posts} />;
}
