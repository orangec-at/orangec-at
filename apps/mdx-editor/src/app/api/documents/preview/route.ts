import { serialize } from "next-mdx-remote/serialize";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (content === undefined) {
      return NextResponse.json(
        { error: "Missing required field: content" },
        { status: 400 }
      );
    }

    // MDX 컴파일
    const mdxSource = await serialize(content);

    return NextResponse.json({
      success: true,
      mdxSource,
    });
  } catch (error) {
    console.error("Failed to compile MDX:", error);
    return NextResponse.json(
      { error: "Failed to compile MDX", details: String(error) },
      { status: 500 }
    );
  }
}
