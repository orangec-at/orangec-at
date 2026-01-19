import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { withLocalePath } from "@/lib/locale-path";

const ADMIN_DM_THREAD_TITLE = "__ADMIN_DM__";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: locale === "ko" ? "관리자 서신함" : "Admin Inbox",
    robots: { index: false, follow: false },
  };
}

export default async function AdminInboxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect(withLocalePath(locale, "/"));
  }

  const messages = await prisma.message.findMany({
    where: {
      thread: {
        title: ADMIN_DM_THREAD_TITLE,
      },
    },
    include: {
      thread: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a] pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          {locale === "ko" ? "서신함" : "Inbox"}
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {locale === "ko"
            ? "회원이 보낸 메시지를 확인합니다."
            : "Review messages sent by members."}
        </p>

        <div className="mt-8 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <table className="w-full">
            <thead className="bg-stone-50 dark:bg-stone-800">
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                  {locale === "ko" ? "보낸 사람" : "Sender"}
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                  {locale === "ko" ? "메시지" : "Message"}
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-stone-500 px-6 py-4">
                  {locale === "ko" ? "일시" : "Date"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {messages.map((m) => {
                const sender = m.thread.user;
                const senderLabel =
                  sender?.name || sender?.email || (locale === "ko" ? "알 수 없음" : "Unknown");

                return (
                  <tr key={m.id} className="align-top">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {senderLabel}
                      </div>
                      {sender?.email && (
                        <div className="text-xs text-stone-500">{sender.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="whitespace-pre-wrap text-sm text-stone-800 dark:text-stone-200">
                        {m.content}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-stone-500">
                        {new Date(m.createdAt).toLocaleString(
                          locale === "ko" ? "ko-KR" : "en-US"
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {messages.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-sm text-stone-500" colSpan={3}>
                    {locale === "ko" ? "아직 서신이 없습니다." : "No messages yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
