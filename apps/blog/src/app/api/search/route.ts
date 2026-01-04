import { NextResponse } from "next/server";

function getRagOrigin() {
  const fallback = "http://localhost:7073";
  const raw = process.env.RAG_SERVICE_URL;

  if (!raw) return fallback;

  try {
    return new URL(raw).origin;
  } catch {
    return fallback;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query") ?? url.searchParams.get("q") ?? "";
  const locale = url.searchParams.get("locale") ?? "ko";
  const topK = url.searchParams.get("top_k") ?? "10";
  const minSimilarity = url.searchParams.get("min_similarity") ?? "0.3";

  if (!query.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const ragOrigin = getRagOrigin();
  const ragUrl = new URL("/api/search", ragOrigin);
  ragUrl.searchParams.set("query", query);
  ragUrl.searchParams.set("locale", locale);
  ragUrl.searchParams.set("top_k", topK);
  ragUrl.searchParams.set("min_similarity", minSimilarity);

  const ragResponse = await fetch(ragUrl.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!ragResponse.ok) {
    const errorText = await ragResponse.text();
    return NextResponse.json(
      { error: "RAG Service Error", details: errorText },
      { status: ragResponse.status }
    );
  }

  const data = await ragResponse.json();
  return NextResponse.json(data);
}
