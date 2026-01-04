import Link from "next/link";

import { confirmNewsletterSubscription } from "@/actions/newsletter";
import { withLocalePath } from "@/lib/locale-path";

export default async function NewsletterConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;

  const result = await confirmNewsletterSubscription({ token: token ?? "" });

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a]">
      <div className="max-w-xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          {result.success
            ? locale === "ko"
              ? "구독 확인 완료"
              : "Subscription Confirmed"
            : locale === "ko"
              ? "구독 확인 실패"
              : "Confirmation Failed"}
        </h1>
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-400">
          {result.message}
        </p>

        <div className="mt-8">
          <Link
            href={withLocalePath(locale, "/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
          >
            {locale === "ko" ? "홈으로" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
