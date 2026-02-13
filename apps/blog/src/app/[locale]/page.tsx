import type { Metadata } from "next";
import HomeClient from "./client";
import { FEATURED_PROJECTS } from "@/data/projects";
import { getBlogPostsByLocale } from "@/lib/blog-utils.server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const route = isKo ? "/" : "/en";

  return {
    title: isKo ? "홈 | Jaeil Lee" : "Home | Jaeil Lee",
    description: isKo
      ? "프로덕트 엔지니어 이재일의 포트폴리오, 최신 글, 그리고 프로젝트를 한눈에 확인하세요."
      : "Explore Jaeil Lee's product engineering portfolio, recent writings, and featured projects.",
    alternates: {
      canonical: route,
      languages: {
        ko: "/",
        en: "/en",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const blogPosts = await getBlogPostsByLocale(resolvedLocale);

  return (
    <HomeClient
      locale={resolvedLocale}
      recentPosts={blogPosts.slice(0, 3)}
      featuredProjects={FEATURED_PROJECTS}
    />
  );
}
