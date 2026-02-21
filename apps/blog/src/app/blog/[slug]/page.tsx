import { getBlogPostMeta, getBlogPosts, getPostType } from "@/lib/blog-utils.server";
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
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blogMeta = await getBlogPostMeta(slug);

  if (!blogMeta) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${blogMeta.title} | Blog`,
    description: blogMeta.description,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  const postType = await getPostType(slug);
  if (!postType) notFound();

  // TSX 커스텀 레이아웃 포스트
  if (postType === "tsx") {
    const TsxPost = dynamic(
      () => import(`@/posts/${slug}`),
      { ssr: true }
    );
    return <TsxPost />;
  }

  // MDX 포스트 (기존 로직)
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.mdx`);

  let source: string;
  try {
    source = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { content } = matter(source);
  const mdxSource = await serialize(content);

  const blogMeta = await getBlogPostMeta(slug);
  if (!blogMeta) notFound();

  const allPostsMeta = await getBlogPosts();
  const otherPostsMeta = allPostsMeta.filter((p) => p.slug !== slug);

  const relatedPostsMeta = otherPostsMeta
    .filter((p) => p.category === blogMeta.category)
    .slice(0, 3);

  const fallbackPostsMeta = relatedPostsMeta.length < 3
    ? otherPostsMeta.filter((p) => p.category !== blogMeta.category).slice(0, 3 - relatedPostsMeta.length)
    : [];

  const finalRelatedMeta = [...relatedPostsMeta, ...fallbackPostsMeta];

  const { posts } = buildKnowledgeShelfDataFromBlogMeta([blogMeta], "en");
  const shelfPost = posts[0];

  const { posts: relatedPosts } = buildKnowledgeShelfDataFromBlogMeta(finalRelatedMeta, "en");
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
