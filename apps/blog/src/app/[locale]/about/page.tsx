import AboutClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isKo = locale === "ko";

  return {
    title: isKo ? "소개 | OrangeCat" : "About | OrangeCat",
    description: isKo
      ? "지식을 큐레이팅하는 개발자 OrangeCat을 소개합니다."
      : "Introducing OrangeCat, a developer curating knowledge.",
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
