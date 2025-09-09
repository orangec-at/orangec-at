"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useMemo, useCallback } from "react";
import {
  defaultControlCenterConfig,
  inlineControlCenterConfig,
} from "./config";
import { ControlItemRenderer } from "./items";
import { ControlCenterConfig, ControlItem, ControlItemSize } from "./types";

interface ControlCenterProps {
  variant?: "inline" | "popup";
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onAction?: (action: string, data?: unknown) => void;
}

export function ControlCenter({
  variant = "inline",
  className = "",
  isOpen,
  onClose,
  onAction,
}: ControlCenterProps) {
  const { theme, setTheme } = useTheme();
  const currentLocale = useLocale();

  const switchLanguage = useCallback((newLocale: string) => {
    window.location.href = window.location.href.replace(/\/(ko|en)/, `/${newLocale}`);
  }, []);

  // Create config with injected functions
  const config = useMemo(() => {
    const baseConfig =
      variant === "inline"
        ? inlineControlCenterConfig
        : defaultControlCenterConfig;
    const configCopy = { ...baseConfig };
    configCopy.items = configCopy.items.map((item) => {
      if (item.type === "theme") {
        return {
          ...item,
          currentTheme: theme,
          onThemeChange: setTheme,
        };
      }
      if (item.type === "language") {
        return {
          ...item,
          currentLocale: currentLocale,
          onLanguageChange: switchLanguage,
        };
      }
      return item;
    });
    return configCopy;
  }, [theme, setTheme, currentLocale, switchLanguage, variant]);

  // Sort items by order and filter enabled ones
  const sortedItems = useMemo(
    () =>
      config.items
        .filter((item) => item.enabled)
        .sort((a, b) => a.order - b.order),
    [config.items]
  );

  // Group items by rows for layout
  const layoutRows = useMemo(() => {
    const rows: ControlItem[][] = [];
    let currentRow: ControlItem[] = [];
    let currentRowSpan = 0;

    sortedItems.forEach((item) => {
      const span = getItemSpan(item.size);

      // If adding this item would exceed columns limit, start a new row
      if (currentRowSpan + span > config.layout.columns) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [item];
        currentRowSpan = span;
      } else {
        currentRow.push(item);
        currentRowSpan += span;
      }
    });

    // Add the last row if it has items
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, [sortedItems, config.layout.columns]);

  if (variant === "popup") {
    if (!isOpen) return null;

    return (
      <>
        {/* Legacy popup backdrop - only for popup variant */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => {
            onClose?.();
            onAction?.("close");
          }}
        />

        {/* Legacy popup panel */}
        <div className="fixed right-2 top-2 sm:right-4 sm:top-4 w-[calc(100vw-1rem)] max-w-[380px] sm:w-[380px] bg-popover border shadow-lg rounded-xl z-50">
          <PopupContent
            config={config}
            layoutRows={layoutRows}
            onClose={onClose}
            onAction={onAction}
          />
        </div>
      </>
    );
  }

  return (
    <div className={`w-full max-w-none ${className}`}>
      {/* Inline Control Grid - No header needed */}
      <div className="space-y-4">
        {layoutRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid grid-cols-${config.layout.columns} gap-3`}
          >
            {row.map((item) => (
              <ControlItemRenderer
                key={item.id}
                item={item}
                onAction={onAction}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get grid span for different sizes
function getItemSpan(size: ControlItemSize): number {
  switch (size) {
    case "small":
      return 1;
    case "medium":
      return 2;
    case "large":
      return 4;
    case "wide":
      return 6;
    default:
      return 2;
  }
}

// Legacy popup content component
function PopupContent({
  config,
  layoutRows,
  onClose,
  onAction,
}: {
  config: ControlCenterConfig;
  layoutRows: ControlItem[][];
  onClose?: () => void;
  onAction?: (action: string, data?: unknown) => void;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b">
        <h2 className="text-base sm:text-lg font-semibold text-popover-foreground">
          Control Center
        </h2>
        <Button
          onClick={() => {
            onClose?.();
            onAction?.("close");
          }}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Dynamic Control Grid */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {layoutRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-${config.layout.columns} gap-2 sm:gap-3`}
            >
              {row.map((item) => (
                <ControlItemRenderer
                  key={item.id}
                  item={item}
                  onAction={onAction}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
