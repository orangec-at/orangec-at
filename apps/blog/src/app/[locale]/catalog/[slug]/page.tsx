import { getBlogPostMeta } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import CatalogDetailClient from "./client";
import { notFound } from "next/navigation";

interface CatalogDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: CatalogDetailPageProps) {
  const { slug, locale } = await params;
  const blogMeta = await getBlogPostMeta(slug, locale);

  if (!blogMeta) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${blogMeta.title} | Catalog`,
    description: blogMeta.description,
  };
}

export default async function CatalogDetailPage({ params }: CatalogDetailPageProps) {
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

  const { posts } = buildKnowledgeShelfDataFromBlogMeta([blogMeta], resolvedLocale);
  const shelfPost = posts[0];

  return (
    <CatalogDetailClient
      post={shelfPost}
      mdxSource={mdxSource}
    />
  );
}
