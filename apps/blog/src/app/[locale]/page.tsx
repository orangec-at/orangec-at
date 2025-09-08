import HomeClient from "./client";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const isKorean = locale === "ko";

  return {
    title: isKorean
      ? "이재일 - 프론트엔드 & 풀스택 개발자"
      : "Jaeil Lee - Frontend & Fullstack Developer",
    description: t("hero.description"),
    keywords: [
      "Frontend Developer",
      "React",
      "Next.js",
      "Web Developer",
      "UI/UX",
      "JavaScript",
      "TypeScript",
    ],
    authors: [{ name: "Jaeil Lee" }],
    openGraph: {
      title: isKorean
        ? "이재일 - 프론트엔드 & 풀스택 개발자"
        : "Jaeil Lee - Frontend & Fullstack Developer",
      description: t("hero.description"),
      type: "website",
      locale: isKorean ? "ko_KR" : "en_US",
      url: "https://oragenc-at.vercel.app",
      siteName: "Jaeil Lee Portfolio",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isKorean
            ? "이재일 - 프론트엔드 개발자 포트폴리오"
            : "Jaeil Lee - Frontend Developer Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isKorean
        ? "이재일 - 프론트엔드 개발자 & 디자이너"
        : "Jaeil Lee - Frontend Developer & Designer",
      description: t("hero.description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  console.log({ locale });
  return <HomeClient />;
}
