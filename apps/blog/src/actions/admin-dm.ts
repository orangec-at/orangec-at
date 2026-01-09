"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";

type ApiAdminDmResponse = {
  success: boolean;
  message: string;
  thread_id: string | null;
};

export async function sendAdminDM(content: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Login is required" };
  }

  if (!content || content.trim().length < 5) {
    return { success: false, message: "Message is too short" };
  }

  const res = await blogApiServerFetch("/api/admin-dm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ user_id: userId, content }),
  });

  const data = (await res.json()) as ApiAdminDmResponse;

  if (!res.ok || !data.success) {
    return { success: false, message: data?.message ?? "Failed to deliver message" };
  }

  return {
    success: true,
    message: data.message,
    data: { threadId: data.thread_id ?? undefined },
  };
}
