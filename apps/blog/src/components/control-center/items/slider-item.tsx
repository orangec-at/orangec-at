"use client";

import { SliderItem } from "../types";

interface SliderItemProps {
  item: SliderItem;
}

export function SliderItemComponent({ item }: SliderItemProps) {
  const percentage = (item.value / item.max) * 100;

  return (
    <div className="col-span-2 bg-card border rounded-lg p-3 sm:p-4 flex items-center gap-3 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 ease-out cursor-default">
      {item.icon}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground font-medium mb-1">{item.title}</div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 hover:shadow-glow ${item.color || 'bg-primary'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {item.unit && (
            <span className="text-xs text-card-foreground font-medium">
              {item.value}{item.unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}