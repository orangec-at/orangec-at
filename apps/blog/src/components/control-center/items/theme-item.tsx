"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { ThemeItem } from "../types";
import { useTranslations } from "next-intl";

interface ThemeItemProps {
  item: ThemeItem;
}

export function ThemeItemComponent({ item }: ThemeItemProps) {
  const t = useTranslations("controlCenter");

  const getThemeIcon = () => {
    switch (item.currentTheme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getThemeLabel = () => {
    switch (item.currentTheme) {
      case "light":
        return t("lightMode");
      case "dark":
        return t("darkMode");
      default:
        return t("systemMode");
    }
  };

  return (
    <div className="col-span-4 bg-card border rounded-lg p-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer">
      <div className="space-y-3">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          {getThemeIcon()}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-card-foreground">{t("theme")}</div>
            <div className="text-xs text-muted-foreground truncate">{getThemeLabel()}</div>
          </div>
        </div>

        {/* Button Row */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => item.onThemeChange("light")}
            variant={item.currentTheme === "light" ? "default" : "ghost"}
            size="sm"
            className="h-9 px-3 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            <span className="text-xs">{t("light")}</span>
          </Button>
          <Button
            onClick={() => item.onThemeChange("system")}
            variant={item.currentTheme === "system" ? "default" : "ghost"}
            size="sm"
            className="h-9 px-3 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            <span className="text-xs">{t("system")}</span>
          </Button>
          <Button
            onClick={() => item.onThemeChange("dark")}
            variant={item.currentTheme === "dark" ? "default" : "ghost"}
            size="sm"
            className="h-9 px-3 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            <span className="text-xs">{t("dark")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}