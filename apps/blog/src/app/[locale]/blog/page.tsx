import BlogCard from "@/components/blog/blog-card";
import fs from "fs";
import path from "path";

interface PostMeta {
  title: string;
  date: string;
  slug: string;
}

export default function BlogPage() {
  const postsDir = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDir);

  const posts: PostMeta[] = filenames.map((filename) => {
    const file = fs.readFileSync(path.join(postsDir, filename), "utf-8");
    const match = file.match(/title: "(.+)"\s+date: "(.+)"/);
    const title = match ? match[1] : "Untitled";
    const date = match ? match[2] : "Unknown";
    const slug = filename.replace(/\.mdx?$/, "");
    return { title, date, slug };
  });

  return (
    <main className="px-4 py-8 md:px-16 md:py-12 space-y-8">
      <h1 className="text-3xl font-bold">Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </main>
  );
}