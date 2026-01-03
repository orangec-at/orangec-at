import { prisma } from "@/lib/prisma";

import type { Fragment } from "@/components/knowledge-shelf/types";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
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
    const items = await prisma.marginalia.findMany({
      select: {
        id: true,
        content: true,
        tags: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return items.map((item, idx) => ({
      id: item.id,
      content: item.content,
      date: formatDate(item.createdAt),
      tags: item.tags.map(normalizeTag).filter((tag) => tag !== ""),
      rotation: ROTATIONS[idx % ROTATIONS.length],
    }));
  } catch {
    return [];
  }
}
