"use client";

import * as React from "react";
import { cn } from "@orangec-at/design/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  activationMode: "auto" | "manual";
}

const TabsContext = React.createContext<TabsContextValue | undefined>(
  undefined
);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs component");
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
  /**
   * 탭 활성화 모드
   * - "auto": 포커스 시 자동 활성화 (콘텐츠 탭에 적합)
   * - "manual": 클릭/Enter/Space 시에만 활성화 (폼이 있는 탭에 적합)
   * @default "auto"
   */
  activationMode?: "auto" | "manual";
}

function Tabs({
  value,
  onValueChange,
  className,
  children,
  activationMode = "auto",
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange, activationMode }}>
      <div data-slot="tabs" className={cn("flex flex-col gap-2", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        "overflow-x-auto gap-0",
        "text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function TabsTrigger({
  value,
  className,
  children,
  disabled,
}: TabsTriggerProps) {
  const {
    value: activeValue,
    onValueChange,
    activationMode,
  } = useTabsContext();
  const isActive = activeValue === value;
  const buttonId = `tab-${value}`;
  const panelId = `panel-${value}`;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleFocus = () => {
    // auto 모드일 때만 포커스 시 자동 활성화
    if (!disabled && activationMode === "auto") {
      onValueChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // manual 모드에서는 Enter/Space로 명시적 활성화
    if (
      !disabled &&
      activationMode === "manual" &&
      (e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={buttonId}
      aria-controls={panelId}
      aria-selected={isActive}
      tabIndex={0}
      disabled={disabled}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "flex flex-1",
        // Layout & spacing
        "inline-flex flex-1 items-center justify-center gap-1.5 px-2 py-1 border border-transparent",
        "px-(--padding-5)",
        // Typography
        "text-sm font-medium whitespace-nowrap",
        "hover:bg-(--krds-secondary-5) hover:cursor-pointer",

        // Colors (base)
        "text-foreground dark:text-muted-foreground",

        // State: active
        "data-[state=active]:bg-(--krds-secondary-70) data-[state=active]:border-(--krds-secondary-70) data-[state=active]:text-white data-[state=active]:shadow-sm",

        // State: active (dark)
        "dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30",

        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",

        // Transitions
        "transition-[color,box-shadow]",

        // Icon children
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "h-(--size-height-8)",
        "focus-ring",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: activeValue } = useTabsContext();
  const isActive = activeValue === value;
  const panelId = `panel-${value}`;
  const buttonId = `tab-${value}`;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={buttonId}
      hidden={!isActive}
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", !isActive && "hidden", className)}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
