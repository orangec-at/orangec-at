import { getBlogPostMeta, getBlogPostsByLocale } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import BlogDetailClient from "./client";
import { notFound } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const blogMeta = await getBlogPostMeta(slug, locale);

  if (!blogMeta) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${blogMeta.title} | Blog`,
    description: blogMeta.description,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const filePath = path.join(process.cwd(), "src/posts", resolvedLocale, `${slug}.mdx`);

  let source: string;
  try {
    source = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { content } = matter(source);
  const mdxSource = await serialize(content);

  const blogMeta = await getBlogPostMeta(slug, resolvedLocale);
  if (!blogMeta) notFound();

  const allPostsMeta = await getBlogPostsByLocale(resolvedLocale);
  const otherPostsMeta = allPostsMeta.filter((p) => p.slug !== slug);
  
  const relatedPostsMeta = otherPostsMeta
    .filter((p) => p.category === blogMeta.category)
    .slice(0, 3);
  
  const fallbackPostsMeta = relatedPostsMeta.length < 3
    ? otherPostsMeta.filter((p) => p.category !== blogMeta.category).slice(0, 3 - relatedPostsMeta.length)
    : [];

  const finalRelatedMeta = [...relatedPostsMeta, ...fallbackPostsMeta];

  const { posts } = buildKnowledgeShelfDataFromBlogMeta([blogMeta], resolvedLocale);
  const shelfPost = posts[0];

  const { posts: relatedPosts } = buildKnowledgeShelfDataFromBlogMeta(finalRelatedMeta, resolvedLocale);

  return (
    <BlogDetailClient
      post={shelfPost}
      mdxSource={mdxSource}
      relatedPosts={relatedPosts}
    />
  );
}
