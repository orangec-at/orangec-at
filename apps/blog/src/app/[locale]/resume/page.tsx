import type { Metadata } from "next";

import ResumeClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const route = isKo ? "/resume" : "/en/resume";

  return {
    title: isKo ? "이력서 | Jaeil Lee" : "Resume | Jaeil Lee",
    description: isKo
      ? "이재일의 경력, 핵심 프로젝트, 기술 역량을 정리한 이력서입니다."
      : "Jaeil Lee's resume covering professional experience, key projects, and technical strengths.",
    alternates: {
      canonical: route,
      languages: {
        ko: "/resume",
        en: "/en/resume",
      },
    },
  };
}

export default function ResumePage() {
  return <ResumeClient />;
}
