"use client";

import { About } from "@/components/knowledge-shelf/components/About";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

export default function AboutClient() {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const themeMode = theme === "dark" ? "dark" : "light";

  return <About onBack={handleBack} theme={themeMode} />;
}
