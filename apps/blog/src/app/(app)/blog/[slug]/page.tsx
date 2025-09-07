import { promises as fs } from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import matter from "gray-matter";
import { getBlogPostMeta } from "@/lib/blog-utils.server";
import BlogPostClient from "./client";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  
  // frontmatter 제거하고 content만 추출
  const { content } = matter(source);
  const mdxSource = await serialize(content);
  
  // 블로그 포스트 메타데이터 가져오기
  const blogMeta = await getBlogPostMeta(slug);

  return <BlogPostClient mdxSource={mdxSource} blogMeta={blogMeta} blogSlug={slug} />;
}
