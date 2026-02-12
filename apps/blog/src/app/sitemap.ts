import { getAllPostSlugs } from "@/lib/blog-utils.server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";

  // 모든 포스트 slug 가져오기
  const allPostSlugs = await getAllPostSlugs();

  const staticRoutes = [
    { path: "", changeFrequency: "monthly" as const, priority: 1 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/projects", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/resume", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/design", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.6 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  const staticPages = staticRoutes.flatMap((route) => {
    const koUrl = `${baseUrl}${route.path}`;
    const enUrl = `${baseUrl}/en${route.path}`;

    return [
      {
        url: koUrl,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      },
      {
        url: enUrl,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      },
    ];
  });

  // 블로그 포스트들
  const blogPages = allPostSlugs.map(({ slug, locale }) => {
    const url =
      locale === "ko"
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
