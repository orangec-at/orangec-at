import BlogClient from "./client";
import fs from "fs";
import path from "path";
import { MDXFrontmatter, BlogCategory } from "@/types/frontmatter";

export default function BlogPage() {
  const postsDir = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDir);

  const posts: (MDXFrontmatter & { slug: string })[] = filenames
    .map((filename) => {
      const file = fs.readFileSync(path.join(postsDir, filename), "utf-8");

      // frontmatter 파싱 (YAML frontmatter + 주석 처리된 메타데이터)
      const frontmatterMatch = file.match(/^---\n([\s\S]*?)\n---/);
      const frontmatterText = frontmatterMatch ? frontmatterMatch[1] : "";

      // 기본 필드들 파싱
      const titleMatch = frontmatterText.match(/title:\s*["']?([^"'\n]+)["']?/);
      const dateMatch = frontmatterText.match(/date:\s*["']?([^"'\n]+)["']?/);
      const descriptionMatch = frontmatterText.match(
        /description:\s*["']?([^"'\n]+)["']?/
      );
      const authorMatch = frontmatterText.match(
        /author:\s*["']?([^"'\n]+)["']?/
      );
      const categoryMatch = frontmatterText.match(
        /category:\s*["']?([^"'\n]+)["']?/
      );
      const thumbnailMatch = frontmatterText.match(
        /thumbnail:\s*["']?([^"'\n]+)["']?/
      );
      const readTimeMatch = frontmatterText.match(
        /readTime:\s*["']?([^"'\n]+)["']?/
      );
      const featuredMatch = frontmatterText.match(/featured:\s*(true|false)/);

      // 태그 파싱 (배열 형태)
      const tagsMatch = frontmatterText.match(/tags:\s*\[([^\]]*)\]/);
      const tags = tagsMatch
        ? tagsMatch[1].split(",").map((tag) => tag.trim().replace(/["']/g, ""))
        : [];

      const slug = filename.replace(/\.mdx?$/, "");

      return {
        title: titleMatch ? titleMatch[1] : "Untitled",
        date: dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0],
        slug,
        description: descriptionMatch ? descriptionMatch[1] : undefined,
        author: authorMatch ? authorMatch[1] : "Jaeil Lee",
        category: categoryMatch
          ? (categoryMatch[1] as BlogCategory)
          : undefined,
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : undefined,
        readTime: readTimeMatch ? readTimeMatch[1] : undefined,
        tags: tags.filter((tag) => tag.length > 0),
        featured: featuredMatch ? featuredMatch[1] === "true" : false,
        draft: false,
        relatedProjects: [],
        seo: undefined,
      };
    })
    .filter((post) => !post.draft); // draft가 아닌 포스트만

  return <BlogClient posts={posts} />;
}
