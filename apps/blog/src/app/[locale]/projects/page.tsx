import type { Metadata } from "next";

import ProjectsClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const route = isKo ? "/projects" : "/en/projects";

  return {
    title: isKo ? "프로젝트 | Jaeil Lee" : "Projects | Jaeil Lee",
    description: isKo
      ? "실제 서비스에 적용한 프로젝트와 제품/기술 의사결정을 정리한 사례 모음입니다."
      : "A curated set of product and engineering projects with practical trade-offs and outcomes.",
    alternates: {
      canonical: route,
      languages: {
        ko: "/projects",
        en: "/en/projects",
      },
    },
  };
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}
