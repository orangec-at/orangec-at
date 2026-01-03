"use client";

import { Profile } from "@/components/knowledge-shelf/components/Profile";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState } from "react";

export default function ProfileClient() {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handleAdminClick = () => {
    router.push(withLocalePath(locale, "/dashboard"));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push(withLocalePath(locale, "/"));
  };

  const themeMode = theme === "dark" ? "dark" : "light";

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Profile
      onBack={handleBack}
      onAdminClick={handleAdminClick}
      isAdmin={isAdmin}
      inkPoints={450}
      highlightedTexts={new Set()}
      isSubscribed={isSubscribed}
      onSubscriptionToggle={() => setIsSubscribed(!isSubscribed)}
      onLogout={handleLogout}
      theme={themeMode}
    />
  );
}
