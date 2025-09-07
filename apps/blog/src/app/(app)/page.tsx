import HomeClient from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaeil Lee - Frontend & Fullstack Developer",
  description:
    "Frontend Developer passionate about creating beautiful, functional web experiences. Specialized in React, Next.js, and modern web technologies.",
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
    title: "Jaeil Lee - Frontend & Fullstack Developer",
    description:
      "Frontend Developer passionate about creating beautiful, functional web experiences. Specialized in React, Next.js, and modern web technologies.",
    type: "website",
    locale: "ko_KR",
    url: "https://oragenc-at.vercel.app", // 실제 도메인으로 변경
    siteName: "Jaeil Lee Portfolio",
    images: [
      {
        url: "/og-image.jpg", // public 폴더에 OG 이미지 추가 필요
        width: 1200,
        height: 630,
        alt: "Jaeil Lee - Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaeil Lee - Frontend Developer & Designer",
    description:
      "Frontend Developer passionate about creating beautiful, functional web experiences.",
    // images: ["/og-image.jpg"], // 동일한 OG 이미지 사용
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
  verification: {
    // 필요시 Google Search Console 등의 verification 코드 추가
    // google: "your-google-verification-code",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
