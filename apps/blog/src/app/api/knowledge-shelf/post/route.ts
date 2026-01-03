import { promises as fs } from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const locale = searchParams.get("locale") ?? "ko";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const resolvedLocale = locale === "en" ? "en" : "ko";
  const filePath = path.join(
    process.cwd(),
    "src/posts",
    resolvedLocale,
    `${slug}.mdx`
  );

  try {
    const source = await fs.readFile(filePath, "utf-8");
    const { content } = matter(source);
    const mdxSource = await serialize(content);

    return NextResponse.json({ mdxSource });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
