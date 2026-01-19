"use client";

import { KineticThreads } from "@/components/kinetic/kinetic-threads";
import { Fragment } from "@/lib/types";
import { useTheme } from "@/contexts/theme-context";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import { useState } from "react";

interface ThreadsClientProps {
  initialFragments: Fragment[];
}

export default function ThreadsClient({ initialFragments }: ThreadsClientProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const locale = useLocale();
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  const handleBack = () => {
    router.push(withLocalePath(locale, "/"));
  };

  const handleHighlight = (text: string) => {
    setHighlightedTexts((prev) => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  const themeMode = theme === "dark" ? "dark" : "light";

  return (
    <KineticThreads
      threads={initialFragments}
      onBack={handleBack}
      onSearchOpen={() => {}} 
      highlightedTexts={highlightedTexts}
      onHighlight={handleHighlight}
      theme={themeMode}
    />
  );
}
