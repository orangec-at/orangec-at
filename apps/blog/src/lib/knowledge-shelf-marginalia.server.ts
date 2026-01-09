import type { Fragment } from "@/components/knowledge-shelf/types";

const BLOG_API_URL = process.env.NEXT_PUBLIC_BLOG_API_URL ?? "http://localhost:3001";
const INTERNAL_API_KEY = process.env.BLOG_API_INTERNAL_KEY ?? "";

interface MarginaliaItem {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
}

interface ListMarginaliaResponse {
  items: MarginaliaItem[];
}

function normalizeTag(tag: string): string {
  const trimmed = tag.trim();
  if (trimmed === "") return "";
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

const ROTATIONS = [-2, 1, -1, 2];

export async function getShelfMarginaliaFragments(
  limit: number
): Promise<Fragment[]> {
  try {
    const response = await fetch(
      `${BLOG_API_URL}/api/marginalia?limit=${limit}`,
      {
        headers: {
          "x-internal-api-key": INTERNAL_API_KEY,
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: ListMarginaliaResponse = await response.json();

    return data.items.map((item, idx) => ({
      id: item.id,
      content: item.content,
      date: item.created_at,
      tags: item.tags.map(normalizeTag).filter((tag) => tag !== ""),
      rotation: ROTATIONS[idx % ROTATIONS.length],
    }));
  } catch {
    return [];
  }
}
