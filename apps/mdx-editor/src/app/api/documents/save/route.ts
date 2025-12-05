import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // 개발 환경에서만 허용
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "File saving is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { filename, content } = await request.json();

    if (!filename || content === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: filename, content" },
        { status: 400 }
      );
    }

    // documents 폴더에 저장
    const documentsDir = path.join(process.cwd(), "documents");

    // documents 폴더가 없으면 생성
    try {
      await fs.access(documentsDir);
    } catch {
      await fs.mkdir(documentsDir, { recursive: true });
    }

    const filePath = path.join(documentsDir, filename);

    // 파일 저장
    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "Document saved successfully",
      path: `documents/${filename}`,
    });
  } catch (error) {
    console.error("Failed to save document:", error);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 }
    );
  }
}
