"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { LanguageItem } from "../types";

interface LanguageItemComponentProps {
  item: LanguageItem;
  onAction?: (action: string, data?: unknown) => void;
}

export function LanguageItemComponent({ item, onAction }: LanguageItemComponentProps) {
  if (!item.enabled) return null;
  
  const getLanguageLabel = () => {
    switch (item.currentLocale) {
      case "ko": return "한국어 모드";
      case "en": return "영어 모드";
      default: return "언어 설정";
    }
  };

  return (
    <div className="col-span-4 bg-card border rounded-lg p-4 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out">
      <div className="space-y-3">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-card-foreground">{item.title}</div>
            <div className="text-xs text-muted-foreground truncate">{getLanguageLabel()}</div>
          </div>
        </div>
        
        {/* Language Button Row */}
        <div className="flex gap-2 justify-center">
          {item.availableLanguages.map((language) => (
            <Button
              key={language.code}
              onClick={() => {
                if (language.code !== item.currentLocale && item.onLanguageChange) {
                  item.onLanguageChange(language.code);
                  onAction?.("language_changed", { locale: language.code });
                }
              }}
              variant={item.currentLocale === language.code ? "default" : "ghost"}
              size="sm"
              className="h-9 px-3 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center gap-2"
            >
              <span className="text-sm">{language.flag}</span>
              <span className="text-xs">{language.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}