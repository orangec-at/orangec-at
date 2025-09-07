// 서버 전용 블로그 유틸리티
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  MDXFrontmatter,
  validateAndParseFrontmatter,
  safeParseFrontmatter,
} from "../types/frontmatter";

// 블로그 포스트 메타데이터 (slug 포함)
export interface BlogPostMeta extends MDXFrontmatter {
  slug: string;
}

export async function getBlogPostMeta(
  slug: string
): Promise<BlogPostMeta | null> {
  try {
    const filePath = path.join(process.cwd(), "src/posts", `${slug}.mdx`);
    const source = await fs.readFile(filePath, "utf-8");
    const { data } = matter(source);

    // Zod 스키마로 검증 및 파싱
    const frontmatter = validateAndParseFrontmatter(data);

    return {
      ...frontmatter,
      slug,
    };
  } catch (error) {
    console.error(`Failed to read blog post meta for ${slug}:`, error);
    return null;
  }
}

export async function getBlogPostsMeta(
  slugs: string[]
): Promise<BlogPostMeta[]> {
  const metaPromises = slugs.map((slug) => getBlogPostMeta(slug));
  const metas = await Promise.all(metaPromises);
  return metas.filter((meta): meta is BlogPostMeta => meta !== null);
}
