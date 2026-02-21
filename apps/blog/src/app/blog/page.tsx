import { BlogCatalog } from "@/components/blog/blog-catalog";
import { getBlogPosts } from "@/lib/blog-utils.server";
import { buildKnowledgeShelfDataFromBlogMeta } from "@/lib/knowledge-shelf-utils.server";

export async function generateMetadata() {
  return {
    title: "Blog | OrangeCat",
    description: "Thoughts and archives of OrangeCat.",
  };
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  const { posts } = buildKnowledgeShelfDataFromBlogMeta(
    blogPosts,
    "en",
  );

  return <BlogCatalog posts={posts} />;
}
