"use client";

import { InfoItem } from "../types";

interface InfoItemProps {
  item: InfoItem;
}

export function InfoItemComponent({ item }: InfoItemProps) {
  const spanClass = {
    small: "col-span-1",
    medium: "col-span-2", 
    large: "col-span-4",
    wide: "col-span-6"
  }[item.size] || "col-span-2";

  return (
    <div className={`${spanClass} p-3 bg-card border rounded-lg hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 ease-out`}>
      <div className="text-center">
        <div className="text-xs font-medium text-card-foreground">{item.title}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {item.content}
        </div>
      </div>
    </div>
  );
}