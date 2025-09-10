import { getAllPostSlugs } from "@/lib/blog-utils.server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  
  // 모든 포스트 slug 가져오기
  const allPostSlugs = await getAllPostSlugs();
  
  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // 블로그 포스트들
  const blogPages = allPostSlugs.map(({ slug, locale }) => {
    const url = locale === "ko" 
      ? `${baseUrl}/blog/${slug}`
      : `${baseUrl}/en/blog/${slug}`;
    
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...blogPages];
}