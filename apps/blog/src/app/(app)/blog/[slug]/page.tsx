import { promises as fs } from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import BlogPostClient from "./client";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params; // 서버 컴포넌트에서는 바로 사용 가능
  const filePath = path.join(process.cwd(), "src/posts", `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf-8");
  const mdxSource = await serialize(source);

  return <BlogPostClient mdxSource={mdxSource} />;
}
