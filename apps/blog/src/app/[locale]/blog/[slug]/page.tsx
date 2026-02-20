import { getBlogPostMeta, getBlogPostsByLocale, getPostType } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { PROJECTS } from "@/data/projects";
import { getRelatedProjectIds } from "@/data/connections";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import dynamic from "next/dynamic";
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

  const postType = await getPostType(slug, resolvedLocale);
  if (!postType) notFound();

  // TSX 커스텀 레이아웃 포스트
  if (postType === "tsx") {
    const TsxPost = dynamic(
      () => import(`@/posts/${resolvedLocale}/${slug}`),
      { ssr: true }
    );
    return <TsxPost />;
  }

  // MDX 포스트 (기존 로직)
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
  const relatedProjectId = getRelatedProjectIds(slug)[0];
  const relatedProject = PROJECTS.find((project) => project.id === relatedProjectId);

  return (
    <BlogDetailClient
      post={shelfPost}
      mdxSource={mdxSource}
      relatedPosts={relatedPosts}
      relatedProject={relatedProject}
    />
  );
}
