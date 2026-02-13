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
    <div className="container-narrow py-section">
      <div className="space-y-8">
        <h1 className="text-h2 font-serif text-foreground">
          {result.success
            ? locale === "ko"
              ? "구독 확인 완료"
              : "Subscription Confirmed"
            : locale === "ko"
              ? "구독 확인 실패"
              : "Confirmation Failed"}
        </h1>
        <p className="text-body text-muted-foreground">
          {result.message}
        </p>

        <div>
          <Link
            href={withLocalePath(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-small font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {locale === "ko" ? "홈으로" : "Back to home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
