import Link from "next/link";

import { withLocalePath } from "@/lib/locale-path";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="container-narrow py-section">
      <div className="space-y-8">
        <h1 className="text-h2 font-serif text-foreground">
          {locale === "ko" ? "개인정보처리방침" : "Privacy"}
        </h1>
        <p className="text-body text-muted-foreground">
          {locale === "ko"
            ? "이 페이지는 개인정보처리방침을 안내합니다."
            : "This page describes the privacy policy."}
        </p>

        <div className="space-y-4 text-small text-muted-foreground">
          <p>
            {locale === "ko"
              ? "현재는 초기 구축 단계이며, 정식 문서는 추후 업데이트됩니다."
              : "This project is in early stage; full policy will be published later."}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={withLocalePath(locale, "/")}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-small font-medium text-muted-foreground transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {locale === "ko" ? "홈" : "Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
