"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { withLocalePath } from "@/lib/locale-path";
import { completeOnboarding } from "@/actions/onboarding";

export default function OnboardingClient({
  locale,
  email,
  from,
}: {
  locale: string;
  email: string;
  from: string | null;
}) {
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const target = useMemo(() => {
    if (from && from.startsWith("/") && !from.includes("/onboarding")) return from;
    return withLocalePath(locale, "/");
  }, [from, locale]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeOnboarding({
        acceptTerms,
        newsletterOptIn,
        locale,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push(target);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen paper-texture bg-[#fdfcf5] dark:bg-[#1a1a1a]">
      <div className="max-w-xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
          {locale === "ko" ? "회원가입 완료" : "Finish setup"}
        </h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          {locale === "ko"
            ? "계정을 사용하기 전에 필수 동의 항목을 확인해주세요."
            : "Review the required items to continue."}
        </p>

        <div className="mt-8 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
          <div className="text-xs tracking-widest text-stone-500">
            {locale === "ko" ? "로그인 이메일" : "Signed-in email"}
          </div>
          <div className="mt-2 text-sm font-medium text-stone-900 dark:text-stone-100">
            {email || "-"}
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {locale === "ko" ? (
                    <>
                      <Link
                        href={withLocalePath(locale, "/terms")}
                        className="underline underline-offset-4"
                      >
                        이용약관
                      </Link>
                      {" 및 "}
                      <Link
                        href={withLocalePath(locale, "/privacy")}
                        className="underline underline-offset-4"
                      >
                        개인정보처리방침
                      </Link>
                      {"에 동의합니다"}
                    </>
                  ) : (
                    <>
                      I agree to the {" "}
                      <Link
                        href={withLocalePath(locale, "/terms")}
                        className="underline underline-offset-4"
                      >
                        terms
                      </Link>
                      {" and "}
                      <Link
                        href={withLocalePath(locale, "/privacy")}
                        className="underline underline-offset-4"
                      >
                        privacy policy
                      </Link>
                    </>
                  )}
                </div>
                <div className="mt-1 text-xs text-stone-500">
                  {locale === "ko"
                    ? "서비스 이용을 위해 필수입니다."
                    : "Required to use the service."}
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  {locale === "ko" ? "뉴스레터를 받아볼게요" : "Subscribe to the newsletter"}
                </div>
                <div className="mt-1 text-xs text-stone-500">
                  {locale === "ko"
                    ? "기술 아카이브 업데이트를 이메일로 받아봅니다."
                    : "Get occasional updates by email."}
                </div>
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => void onSubmit()}
              disabled={isSubmitting || !acceptTerms}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
            >
              {isSubmitting
                ? locale === "ko"
                  ? "처리중..."
                  : "Saving..."
                : locale === "ko"
                  ? "계속"
                  : "Continue"}
            </button>
            <button
              onClick={() => void signOut({ callbackUrl: withLocalePath(locale, "/") })}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
            >
              {locale === "ko" ? "나중에" : "Not now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
