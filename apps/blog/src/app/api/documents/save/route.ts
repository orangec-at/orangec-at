import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// 문서 타입별 폴더 매핑
const TYPE_FOLDER_MAP: Record<string, string> = {
  resume: "resumes",
  "cover-letter": "cover-letters",
  portfolio: "portfolio",
};

export async function POST(request: NextRequest) {
  // 개발 환경에서만 허용
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "File saving is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { type, slug, content } = await request.json();

    if (!type || !slug || content === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: type, slug, content" },
        { status: 400 }
      );
    }

    const folder = TYPE_FOLDER_MAP[type];
    if (!folder) {
      return NextResponse.json(
        { error: `Invalid document type: ${type}` },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "documents",
      folder,
      `${slug}.mdx`
    );

    // 파일이 존재하는지 확인
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: `Document not found: ${type}/${slug}` },
        { status: 404 }
      );
    }

    // 파일 저장
    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Document saved successfully",
      path: `documents/${folder}/${slug}.mdx`,
    });
  } catch (error) {
    console.error("Failed to save document:", error);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 }
    );
  }
}
