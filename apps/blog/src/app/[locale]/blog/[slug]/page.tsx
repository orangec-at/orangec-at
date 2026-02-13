import {
  getBlogPostMeta,
  getBlogPostsByLocale,
  getTsxPostComponent,
} from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";
import { PROJECTS } from "@/data/projects";
import { getRelatedProjectIds } from "@/data/connections";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
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

// Detect content type: "mdx" | "tsx" | null
async function detectContentType(
  slug: string,
  locale: string
): Promise<"mdx" | "tsx" | null> {
  const postsDir = path.join(process.cwd(), "src/posts", locale);

  const mdxExists = await fs
    .access(path.join(postsDir, `${slug}.mdx`))
    .then(() => true)
    .catch(() => false);
  if (mdxExists) return "mdx";

  const tsxExists = await fs
    .access(path.join(postsDir, `${slug}.tsx`))
    .then(() => true)
    .catch(() => false);
  if (tsxExists) return "tsx";

  return null;
}

// Shared: get related posts and project for blog chrome
async function getRelatedContent(slug: string, locale: string, category?: string) {
  const allPostsMeta = await getBlogPostsByLocale(locale);
  const otherPostsMeta = allPostsMeta.filter((p) => p.slug !== slug);

  const relatedPostsMeta = category
    ? otherPostsMeta.filter((p) => p.category === category).slice(0, 3)
    : [];

  const fallbackPostsMeta =
    relatedPostsMeta.length < 3
      ? otherPostsMeta
          .filter((p) => p.category !== category)
          .slice(0, 3 - relatedPostsMeta.length)
      : [];

  const finalRelatedMeta = [...relatedPostsMeta, ...fallbackPostsMeta];
  const { posts: relatedPosts } = buildKnowledgeShelfDataFromBlogMeta(
    finalRelatedMeta,
    locale
  );

  const relatedProjectId = getRelatedProjectIds(slug)[0];
  const relatedProject = PROJECTS.find(
    (project) => project.id === relatedProjectId
  );

  return { relatedPosts, relatedProject };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug, locale } = await params;
  const resolvedLocale = locale === "en" ? "en" : "ko";

  const contentType = await detectContentType(slug, resolvedLocale);
  if (!contentType) notFound();

  const blogMeta = await getBlogPostMeta(slug, resolvedLocale);
  if (!blogMeta) notFound();

  // === MDX Post (existing flow) ===
  if (contentType === "mdx") {
    const filePath = path.join(
      process.cwd(),
      "src/posts",
      resolvedLocale,
      `${slug}.mdx`
    );
    const source = await fs.readFile(filePath, "utf-8");
    const { content } = matter(source);
    const mdxSource = await serialize(content);

    const { posts } = buildKnowledgeShelfDataFromBlogMeta(
      [blogMeta],
      resolvedLocale
    );
    const shelfPost = posts[0];
    const { relatedPosts, relatedProject } = await getRelatedContent(
      slug,
      resolvedLocale,
      blogMeta.category
    );

    return (
      <BlogDetailClient
        post={shelfPost}
        mdxSource={mdxSource}
        relatedPosts={relatedPosts}
        relatedProject={relatedProject}
      />
    );
  }

  // === TSX Post ===
  const PostComponent = await getTsxPostComponent(slug, resolvedLocale);
  if (!PostComponent) notFound();

  const layout = blogMeta.layout ?? "shared";
  const shellMode = blogMeta.shellMode ?? "default";

  // Custom layout: component renders everything
  if (layout === "custom") {
    return (
      <div data-shell-mode={shellMode}>
        <PostComponent />
      </div>
    );
  }

  // Shared layout: wrap in blog chrome
  const { posts } = buildKnowledgeShelfDataFromBlogMeta(
    [blogMeta],
    resolvedLocale
  );
  const shelfPost = posts[0];
  const { relatedPosts, relatedProject } = await getRelatedContent(
    slug,
    resolvedLocale,
    blogMeta.category
  );

  return (
    <BlogDetailClient
      post={shelfPost}
      mdxSource={null}
      relatedPosts={relatedPosts}
      relatedProject={relatedProject}
    >
      <PostComponent />
    </BlogDetailClient>
  );
}
