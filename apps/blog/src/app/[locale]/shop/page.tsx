import { Metadata } from "next";
import { getProducts, getUserInkPoints } from "@/actions/shop";
import ShopClient from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const canonicalUrl = `${baseUrl}/${locale === "ko" ? "" : `${locale}/`}shop`;

  const title = locale === "ko" ? "상점 | 심야 서고" : "Shop | Midnight Archives";
  const description =
    locale === "ko"
      ? "잉크 포인트로 특별한 아이템을 구매하세요."
      : "Purchase special items with your Ink Points.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ko: `${baseUrl}/shop`,
        en: `${baseUrl}/en/shop`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Orange C At",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      type: "website",
    },
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const [products, userPoints] = await Promise.all([
    getProducts(),
    getUserInkPoints(),
  ]);

  return (
    <ShopClient 
      products={products} 
      userPoints={userPoints} 
      locale={locale}
    />
  );
}
