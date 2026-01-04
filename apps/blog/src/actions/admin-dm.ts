"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_DM_THREAD_TITLE = "__ADMIN_DM__";

export async function sendAdminDM(content: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Login is required" };
  }

  if (!content || content.trim().length < 5) {
    return { success: false, message: "Message is too short" };
  }

  const thread =
    (await prisma.thread.findFirst({
      where: { userId, title: ADMIN_DM_THREAD_TITLE },
    })) ??
    (await prisma.thread.create({
      data: {
        userId,
        title: ADMIN_DM_THREAD_TITLE,
      },
    }));

  await prisma.message.create({
    data: {
      role: "user",
      content,
      threadId: thread.id,
    },
  });

  return {
    success: true,
    message: "Your message has been delivered to the Master's inbox.",
    data: { threadId: thread.id },
  };
}
