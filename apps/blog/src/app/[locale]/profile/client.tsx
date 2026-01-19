"use client";

import { KineticProfile } from "@/components/kinetic/kinetic-profile";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { getNewsletterStatus, subscribeNewsletter, unsubscribeNewsletter } from "@/actions/newsletter";

export default function ProfileClient() {
  const router = useRouter();
  const locale = useLocale();
  const { data: session, status } = useSession();

  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "ACTIVE" | "PENDING" | "UNSUBSCRIBED"
  >("UNSUBSCRIBED");

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
      router.push(withLocalePath(locale, "/login"));
      return;
    }

    if (subscriptionStatus === "ACTIVE" || subscriptionStatus === "PENDING") {
      const result = await unsubscribeNewsletter();
      if (result.success) setSubscriptionStatus(result.status);
      return;
    }

    const result = await subscribeNewsletter({ locale });
    if (result.success) {
      setSubscriptionStatus(result.status);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-zinc-900 border-2 border-white/10 p-8 relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-kinetic-orange" />
          <h1 className="font-serif text-3xl font-black uppercase tracking-tighter text-white">
            {locale === "ko" ? "로그인이 필요합니다" : "Login Required"}
          </h1>
          <p className="mt-3 font-mono text-sm text-white/60">
            {locale === "ko"
              ? "프로필과 구독 설정을 관리하려면 로그인하세요."
              : "Sign in to manage your profile and subscription settings."}
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => router.push(withLocalePath(locale, "/login"))}
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest bg-kinetic-orange text-black hover:bg-white transition-colors"
            >
              {locale === "ko" ? "로그인" : "Sign in"}
            </button>
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest bg-transparent border-2 border-white/20 text-white hover:border-kinetic-orange hover:text-kinetic-orange transition-colors"
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
    <KineticProfile
      onBack={handleBack}
      onAdminClick={handleAdminClick}
      isAdmin={isAdmin}
      inkPoints={session.user?.inkPoints ?? 0}
      highlightedTexts={new Set()}
      isSubscribed={subscriptionStatus === "ACTIVE"}
      subscriptionStatus={subscriptionStatus}
      onSubscriptionToggle={handleSubscriptionToggle}
      onLogout={handleLogout}
    />
  );
}
