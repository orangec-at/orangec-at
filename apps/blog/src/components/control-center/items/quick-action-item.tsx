"use client";

import { Button } from "@/components/ui/button";
import { QuickActionItem } from "../types";

interface QuickActionItemProps {
  item: QuickActionItem;
}

export function QuickActionItemComponent({ item }: QuickActionItemProps) {
  return (
    <Button
      variant={item.active ? "default" : "outline"}
      className="flex-col py-6 hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 ease-out"
      onClick={item.onClick}
    >
      {item.icon}
      <span className="text-xs mt-2">{item.title}</span>
    </Button>
  );
}
