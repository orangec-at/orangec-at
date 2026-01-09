"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";
import { revalidatePath } from "next/cache";

type ApiSaveMarginaliaResponse = {
  success: boolean;
  message: string;
};

export async function saveMarginalia(content: string, tags: string[] = []) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Authentication required" };
  }

  const res = await blogApiServerFetch("/api/marginalia", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_id: userId, content, tags }),
  });

  const data = (await res.json()) as ApiSaveMarginaliaResponse;

  if (!res.ok || !data.success) {
    return { success: false, message: data?.message ?? "Failed to save fragment" };
  }

  revalidatePath("/profile");
  return { success: true, message: data.message };
}
