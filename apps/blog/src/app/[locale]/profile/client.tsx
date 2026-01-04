"use client";

import { Profile } from "@/components/knowledge-shelf/components/Profile";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { getNewsletterStatus, subscribeNewsletter, unsubscribeNewsletter } from "@/actions/newsletter";

export default function ProfileClient() {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "ACTIVE" | "PENDING" | "UNSUBSCRIBED"
  >("UNSUBSCRIBED");

  const themeMode = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (!session?.user?.email) return;

    let isCancelled = false;

    void (async () => {
      const current = await getNewsletterStatus();
      if (isCancelled) return;
      setSubscriptionStatus(current?.status ?? "UNSUBSCRIBED");
    })();

    return () => {
      isCancelled = true;
    };
  }, [session?.user?.email]);

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handleAdminClick = () => {
    router.push(withLocalePath(locale, "/dashboard"));
  };

  const handleLogout = () => {
    void signOut({ callbackUrl: withLocalePath(locale, "/") });
  };

  const handleSubscriptionToggle = async () => {
    if (!session) {
      await signIn();
      return;
    }

    if (subscriptionStatus === "ACTIVE" || subscriptionStatus === "PENDING") {
      const result = await unsubscribeNewsletter();
      if (result.success) setSubscriptionStatus("UNSUBSCRIBED");
      return;
    }

    const result = await subscribeNewsletter({ locale });
    if (result.success) {
      const isPending = result.message.toLowerCase().includes("confirm");
      setSubscriptionStatus(isPending ? "PENDING" : "ACTIVE");
    }
  };

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-8">
          <h1 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            {locale === "ko" ? "로그인이 필요합니다" : "Login required"}
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            {locale === "ko"
              ? "프로필과 구독 설정을 관리하려면 로그인하세요."
              : "Sign in to manage your profile and subscription settings."}
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => void signIn()}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-stone-900 text-white hover:bg-stone-700 dark:bg-red-900 dark:hover:bg-red-800 transition-colors"
            >
              {locale === "ko" ? "로그인" : "Sign in"}
            </button>
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
            >
              {locale === "ko" ? "홈" : "Home"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = session.user?.role === "ADMIN";

  return (
    <Profile
      onBack={handleBack}
      onAdminClick={handleAdminClick}
      isAdmin={isAdmin}
      inkPoints={session.user?.inkPoints ?? 0}
      highlightedTexts={new Set()}
      isSubscribed={subscriptionStatus === "ACTIVE"}
      subscriptionStatus={subscriptionStatus}
      onSubscriptionToggle={handleSubscriptionToggle}
      onLogout={handleLogout}
      theme={themeMode}
    />
  );
}
