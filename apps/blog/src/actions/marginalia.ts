"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveMarginalia(content: string, tags: string[] = []) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Authentication required" };
  }

  try {
    // 1. Create Marginalia record
    await prisma.marginalia.create({
      data: {
        content,
        tags,
        userId: session.user.id,
      },
    });

    // 2. Award Ink Points (e.g., 15 points per fragment)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        inkPoints: {
          increment: 15,
        },
      },
    });

    revalidatePath("/profile");
    return { success: true, message: "Fragment saved and Ink points awarded!" };
  } catch (error) {
    console.error("Failed to save marginalia:", error);
    return { success: false, message: "Failed to save fragment" };
  }
}
