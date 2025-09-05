"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { ControlItemRenderer } from "./items";
import { defaultControlCenterConfig } from "./config";
import { ControlItem, ControlItemSize } from "./types";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ControlCenter({ isOpen, onClose }: ControlCenterProps) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Create config with injected theme functions
  const config = useMemo(() => {
    const configCopy = { ...defaultControlCenterConfig };
    configCopy.items = configCopy.items.map((item) => {
      if (item.type === "theme") {
        return {
          ...item,
          currentTheme: theme,
          onThemeChange: setTheme,
        };
      }
      return item;
    });
    return configCopy;
  }, [theme, setTheme]);

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

      // If adding this item would exceed 6 columns, start a new row
      if (currentRowSpan + span > 6) {
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
  }, [sortedItems]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Control Center Panel */}
      <div
        className={`fixed right-2 top-2 sm:right-4 sm:top-4 w-[calc(100vw-1rem)] max-w-[${
          config.layout.maxWidth
        }] sm:w-[${
          config.layout.maxWidth
        }] bg-popover border shadow-lg rounded-xl z-50 transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold text-popover-foreground">
            Control Center
          </h2>
          <Button
            onClick={onClose}
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
                  <ControlItemRenderer key={item.id} item={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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
