"use client";

import React from "react";
import { Globe } from "lucide-react";
import { LanguageItem } from "../types";
import { useTranslations } from "next-intl";

interface LanguageItemComponentProps {
  item: LanguageItem;
  onAction?: (action: string, data?: unknown) => void;
}

export function LanguageItemComponent({
  item,
  onAction,
}: LanguageItemComponentProps) {
  const t = useTranslations("controlCenter");

  if (!item.enabled) return null;

  const getLanguageLabel = () => {
    switch (item.currentLocale) {
      case "ko":
        return t("koreanMode");
      case "en":
        return t("englishMode");
      default:
        return t("languageSettings");
    }
  };

  return (
    <div className="col-span-4 muji-control-card rounded-xl p-4">
      <div className="space-y-3">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-card-foreground">
              {t("language")}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {getLanguageLabel()}
            </div>
          </div>
        </div>

        {/* Language Button Row */}
        <div className="flex flex-wrap gap-2">
          {item.availableLanguages.map((language) => {
            const isActive = item.currentLocale === language.code;
            return (
              <button
                key={language.code}
                type="button"
                onClick={() => {
                  if (
                    language.code !== item.currentLocale &&
                    item.onLanguageChange
                  ) {
                    item.onLanguageChange(language.code);
                    onAction?.("language_changed", { locale: language.code });
                  }
                }}
                className="muji-radio"
                data-active={isActive}
                aria-pressed={isActive}
              >
                <span className="text-sm">{language.flag}</span>
                <span>{language.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
