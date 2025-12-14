// 서버 전용 블로그 유틸리티
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import {
  MDXFrontmatter,
  validateAndParseFrontmatter,
} from "../types/frontmatter";

// 블로그 포스트 메타데이터 (slug 포함)
export interface BlogPostMeta extends MDXFrontmatter {
  slug: string;
  locale: string;
}

export async function getBlogPostMeta(
  slug: string,
  locale: string = "ko"
): Promise<BlogPostMeta | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "src/posts",
      locale,
      `${slug}.mdx`
    );
    const source = await fs.readFile(filePath, "utf-8");
    const { data } = matter(source);

    // Zod 스키마로 검증 및 파싱
    const frontmatter = validateAndParseFrontmatter(data);

    return {
      ...frontmatter,
      slug,
      locale,
    };
  } catch (error) {
    console.error(
      `Failed to read blog post meta for ${slug} in ${locale}:`,
      error
    );
    return null;
  }
}

export async function getBlogPostsMeta(
  slugs: string[],
  locale: string = "ko"
): Promise<BlogPostMeta[]> {
  const metaPromises = slugs.map((slug) => getBlogPostMeta(slug, locale));
  const metas = await Promise.all(metaPromises);
  return metas.filter((meta): meta is BlogPostMeta => meta !== null);
}

// 특정 언어의 모든 포스트 가져오기
export async function getBlogPostsByLocale(
  locale: string = "ko"
): Promise<BlogPostMeta[]> {
  try {
    const postsDir = path.join(process.cwd(), "src/posts", locale);
    const files = await fs.readdir(postsDir);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const posts = await Promise.all(
      mdxFiles.map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        return await getBlogPostMeta(slug, locale);
      })
    );

    return posts.filter((post): post is BlogPostMeta => post !== null);
  } catch (error) {
    console.error(`Failed to get posts for locale ${locale}:`, error);
    return [];
  }
}

// 동일한 slug의 다른 언어 버전들 찾기
export async function getAvailableTranslations(
  slug: string
): Promise<string[]> {
  const locales = ["ko", "en"];
  const availableLocales: string[] = [];

  for (const locale of locales) {
    try {
      const filePath = path.join(
        process.cwd(),
        "src/posts",
        locale,
        `${slug}.mdx`
      );
      await fs.access(filePath); // 파일 존재 확인
      availableLocales.push(locale);
    } catch {
      // 파일이 없으면 skip
    }
  }

  return availableLocales;
}

// 모든 언어의 포스트 slug 목록 (sitemap 생성용)
export async function getAllPostSlugs(): Promise<
  Array<{ slug: string; locale: string }>
> {
  const locales = ["ko", "en"];
  const allSlugs: Array<{ slug: string; locale: string }> = [];

  for (const locale of locales) {
    try {
      const postsDir = path.join(process.cwd(), "src/posts", locale);
      const files = await fs.readdir(postsDir);
      const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

      mdxFiles.forEach((filename) => {
        const slug = filename.replace(/\.mdx$/, "");
        allSlugs.push({ slug, locale });
      });
    } catch {
      console.warn(`No posts directory for locale ${locale}`);
    }
  }

  return allSlugs;
}
