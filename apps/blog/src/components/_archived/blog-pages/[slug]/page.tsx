import {
  BlogPostMeta,
  getAvailableTranslations,
  getBlogPostMeta,
} from "@/lib/blog-utils.server";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import BlogPostClient from "./client";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;

  const [blogMeta, availableTranslations] = await Promise.all([
    getBlogPostMeta(slug),
    getAvailableTranslations(slug),
  ]);

  if (!blogMeta) {
    return {
      title: "Post Not Found",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  // hreflang links 생성
  const languages: Record<string, string> = {};
  availableTranslations.forEach((availableLocale) => {
    const localeUrl = `${baseUrl}/blog/${slug}`;
    languages[availableLocale] = localeUrl;
  });

  return {
    title: blogMeta.title,
    description: blogMeta.description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: blogMeta.title,
      description: blogMeta.description,
      url: canonicalUrl,
      siteName: "Orange C At",
      locale: "en_US",
      type: "article",
      publishedTime: blogMeta.date,
      authors: [blogMeta.author],
      ...(blogMeta.thumbnail && { images: [blogMeta.thumbnail] }),
    },
    twitter: {
      card: "summary_large_image",
      title: blogMeta.title,
      description: blogMeta.description,
      ...(blogMeta.thumbnail && { images: [blogMeta.thumbnail] }),
    },
    other: {
      "article:author": blogMeta.author,
      "article:published_time": blogMeta.date,
      ...(blogMeta.category && { "article:section": blogMeta.category }),
      ...(blogMeta.tags && { "article:tag": blogMeta.tags.join(", ") }),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;

  // 언어별 포스트 경로 시도
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.mdx`);

  let source: string;
  try {
    source = await fs.readFile(filePath, "utf-8");
  } catch {
    console.error(`Post not found: ${slug}`);
    throw new Error(`Post not found: ${slug}`);
  }

  // frontmatter 제거하고 content만 추출
  const { content } = matter(source);
  const mdxSource = await serialize(content);

  // 블로그 포스트 메타데이터와 번역 정보 가져오기
  const [blogMeta, availableTranslations] = await Promise.all([
    getBlogPostMeta(slug),
    getAvailableTranslations(slug),
  ]);

  if (!blogMeta) {
    throw new Error(`Post metadata not found: ${slug}`);
  }

  // JSON-LD 데이터 생성
  const jsonLd = generateJsonLd(blogMeta, slug);

  return (
    <>
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <BlogPostClient
        mdxSource={mdxSource}
        blogMeta={blogMeta}
        blogSlug={slug}
        locale="en"
        availableTranslations={availableTranslations}
      />
    </>
  );
}

// JSON-LD 구조화된 데이터 생성
function generateJsonLd(blogMeta: BlogPostMeta, slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com";
  const url = `${baseUrl}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blogMeta.title,
    description: blogMeta.description,
    url,
    datePublished: blogMeta.date,
    dateModified: blogMeta.date,
    author: {
      "@type": "Person",
      name: blogMeta.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Orange C At",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en-US",
    ...(blogMeta.category && {
      articleSection: blogMeta.category,
    }),
    ...(blogMeta.tags && {
      keywords: blogMeta.tags.join(", "),
    }),
    ...(blogMeta.thumbnail && {
      image: blogMeta.thumbnail,
    }),
  };
}
