import AboutClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "소개 | Jaeil Lee" : "About | Jaeil Lee",
    description: isKo
      ? "풀스택 개발자 & 프로덕트 빌더 이재일을 소개합니다."
      : "Full-stack developer & product builder. 4.5 years shipping web, mobile, and enterprise apps.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  return <AboutClient locale={resolvedLocale} />;
}
