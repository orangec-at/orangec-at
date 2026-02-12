"use client";

import { Moon, Sun } from "lucide-react";
import { ThemeItem } from "../types";
import { useTranslations } from "next-intl";

interface ThemeItemProps {
  item: ThemeItem;
}

export function ThemeItemComponent({ item }: ThemeItemProps) {
  const t = useTranslations("controlCenter");

  const normalizedTheme = item.currentTheme === "system" ? "light" : item.currentTheme;
  const nextTheme = normalizedTheme === "light" ? "dark" : "light";

  return (
    <div className="col-span-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          {normalizedTheme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-card-foreground">
              {t("theme")}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {normalizedTheme === "light" ? t("lightMode") : t("darkMode")}
            </div>
          </div>
        </div>

        {/* Single Toggle */}
        <button
          type="button"
          onClick={() => item.onThemeChange(nextTheme)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={`Toggle theme to ${nextTheme}`}
        >
          {normalizedTheme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="text-sm font-semibold">
            {normalizedTheme === "light" ? t("dark") : t("light")}
          </span>
        </button>
      </div>
    </div>
  );
}
