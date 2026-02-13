// 서버 전용 블로그 유틸리티
import type React from "react";
import { promises as fs } from "fs";
import matter from "gray-matter";
import path from "path";
import {
  type MDXFrontmatter,
  type TsxPostModule,
  validateAndParseFrontmatter,
} from "../types/frontmatter";

// 블로그 포스트 메타데이터 (slug 포함)
export interface BlogPostMeta extends MDXFrontmatter {
  slug: string;
  locale: string;
}

// TSX 포스트에서 meta 추출 (서버 전용)
async function getTsxModuleMeta(
  slug: string,
  locale: string
): Promise<BlogPostMeta | null> {
  try {
    const mod: TsxPostModule = await import(`../posts/${locale}/${slug}`);
    if (!mod.meta) return null;
    const frontmatter = validateAndParseFrontmatter(mod.meta);
    return { ...frontmatter, slug, locale };
  } catch {
    return null;
  }
}

export async function getBlogPostMeta(
  slug: string,
  locale: string = "ko"
): Promise<BlogPostMeta | null> {
  // 1. Try MDX first
  try {
    const filePath = path.join(
      process.cwd(),
      "src/posts",
      locale,
      `${slug}.mdx`
    );
    const source = await fs.readFile(filePath, "utf-8");
    const { data } = matter(source);

    const frontmatter = validateAndParseFrontmatter(data);

    return { ...frontmatter, slug, locale };
  } catch {
    // MDX not found, try TSX
  }

  // 2. Try TSX
  return getTsxModuleMeta(slug, locale);
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
    const postFiles = files.filter(
      (file) => file.endsWith(".mdx") || file.endsWith(".tsx")
    );

    const posts = await Promise.all(
      postFiles.map(async (filename) => {
        const slug = filename.replace(/\.(mdx|tsx)$/, "");
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
    const postsDir = path.join(process.cwd(), "src/posts", locale);
    const mdxExists = await fs
      .access(path.join(postsDir, `${slug}.mdx`))
      .then(() => true)
      .catch(() => false);
    const tsxExists = await fs
      .access(path.join(postsDir, `${slug}.tsx`))
      .then(() => true)
      .catch(() => false);
    if (mdxExists || tsxExists) {
      availableLocales.push(locale);
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
      const postFiles = files.filter(
        (file) => file.endsWith(".mdx") || file.endsWith(".tsx")
      );

      postFiles.forEach((filename) => {
        const slug = filename.replace(/\.(mdx|tsx)$/, "");
        allSlugs.push({ slug, locale });
      });
    } catch {
      console.warn(`No posts directory for locale ${locale}`);
    }
  }

  return allSlugs;
}

// TSX 포스트 컴포넌트 로드 (page route에서 사용)
export async function getTsxPostComponent(
  slug: string,
  locale: string
): Promise<React.ComponentType | null> {
  try {
    const mod: TsxPostModule = await import(`../posts/${locale}/${slug}`);
    return mod.default ?? null;
  } catch {
    return null;
  }
}
