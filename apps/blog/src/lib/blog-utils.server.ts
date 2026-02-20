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

// 지원하는 포스트 파일 확장자
const POST_EXTENSIONS = [".mdx", ".tsx"] as const;

// slug에 해당하는 포스트 파일 경로와 확장자를 찾는다
async function resolvePostFile(
  slug: string,
  locale: string
): Promise<{ filePath: string; ext: string } | null> {
  const postsDir = path.join(process.cwd(), "src/posts", locale);
  for (const ext of POST_EXTENSIONS) {
    const filePath = path.join(postsDir, `${slug}${ext}`);
    try {
      await fs.access(filePath);
      return { filePath, ext };
    } catch {
      // 다음 확장자 시도
    }
  }
  return null;
}

// TSX 파일에서 export const meta를 추출한다
async function extractTsxMeta(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const source = await fs.readFile(filePath, "utf-8");
    // meta 객체를 정규식으로 추출 (export const meta: MDXFrontmatter = { ... };)
    const metaMatch = source.match(
      /export\s+const\s+meta\s*(?::\s*MDXFrontmatter\s*)?=\s*(\{[\s\S]*?\n\});/
    );
    if (!metaMatch) return null;

    // JSON-like 객체를 파싱 (JS 객체 리터럴 → JSON 변환)
    const objStr = metaMatch[1]
      .replace(/\/\/.*$/gm, "")           // 한 줄 주석 제거
      .replace(/,(\s*[}\]])/g, "$1")      // trailing comma 제거
      .replace(/(\w+)\s*:/g, '"$1":')     // key를 따옴표로 감싸기
      .replace(/'/g, '"');                 // 작은따옴표 → 큰따옴표

    return JSON.parse(objStr);
  } catch {
    return null;
  }
}

export async function getBlogPostMeta(
  slug: string,
  locale: string = "ko"
): Promise<BlogPostMeta | null> {
  try {
    const resolved = await resolvePostFile(slug, locale);
    if (!resolved) return null;

    let data: Record<string, unknown>;

    if (resolved.ext === ".mdx") {
      const source = await fs.readFile(resolved.filePath, "utf-8");
      const parsed = matter(source);
      data = parsed.data;
    } else {
      // .tsx — export const meta에서 추출
      const tsxMeta = await extractTsxMeta(resolved.filePath);
      if (!tsxMeta) return null;
      data = tsxMeta;
    }

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
    const postFiles = files.filter((file) =>
      POST_EXTENSIONS.some((ext) => file.endsWith(ext))
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
    const resolved = await resolvePostFile(slug, locale);
    if (resolved) {
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
      const postFiles = files.filter((file) =>
        POST_EXTENSIONS.some((ext) => file.endsWith(ext))
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

// slug의 포스트 타입을 반환 (라우터에서 사용)
export async function getPostType(
  slug: string,
  locale: string
): Promise<"mdx" | "tsx" | null> {
  const resolved = await resolvePostFile(slug, locale);
  if (!resolved) return null;
  return resolved.ext === ".tsx" ? "tsx" : "mdx";
}
