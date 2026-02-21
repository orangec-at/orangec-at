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
  locale: "en";
}

// 지원하는 포스트 파일 확장자
const POST_EXTENSIONS = [".mdx", ".tsx"] as const;

// slug에 해당하는 포스트 파일 경로와 확장자를 찾는다
async function resolvePostFile(
  slug: string
): Promise<{ filePath: string; ext: string } | null> {
  const postsDir = path.join(process.cwd(), "src/posts");
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
  slug: string
): Promise<BlogPostMeta | null> {
  try {
    const resolved = await resolvePostFile(slug);
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
      locale: "en",
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

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  try {
    const postsDir = path.join(process.cwd(), "src/posts");
    const files = await fs.readdir(postsDir);
    const postFiles = files.filter((file) =>
      POST_EXTENSIONS.some((ext) => file.endsWith(ext))
    );

    const posts = await Promise.all(
      postFiles.map(async (filename) => {
        const slug = filename.replace(/\.(mdx|tsx)$/, "");
        return await getBlogPostMeta(slug);
      })
    );

    return posts.filter((post): post is BlogPostMeta => post !== null);
  } catch (error) {
    console.error("Failed to get posts:", error);
    return [];
  }
}

// 동일한 slug의 다른 언어 버전들 찾기
export async function getAvailableTranslations(
  slug: string
): Promise<string[]> {
  const resolved = await resolvePostFile(slug);
  return resolved ? ["en"] : [];
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const postsDir = path.join(process.cwd(), "src/posts");
    const files = await fs.readdir(postsDir);
    const postFiles = files.filter((file) =>
      POST_EXTENSIONS.some((ext) => file.endsWith(ext))
    );

    return postFiles.map((filename) => filename.replace(/\.(mdx|tsx)$/, ""));
  } catch {
    console.warn("No posts directory");
    return [];
  }
}

// slug의 포스트 타입을 반환 (라우터에서 사용)
export async function getPostType(
  slug: string
): Promise<"mdx" | "tsx" | null> {
  const resolved = await resolvePostFile(slug);
  if (!resolved) return null;
  return resolved.ext === ".tsx" ? "tsx" : "mdx";
}
