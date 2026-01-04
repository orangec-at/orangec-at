"use client";

import { Button } from "@orangec-at/design";
import { MediaItem } from "../types";

interface MediaItemProps {
  item: MediaItem;
}

export function MediaItemComponent({ item }: MediaItemProps) {
  return (
    <div className="col-span-2">
      <Button
        variant="secondary"
        className="w-full h-full flex-col py-6 hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 ease-out"
        onClick={item.onClick}
      >
        <svg className="h-6 w-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xs">{item.title}</span>
        {item.currentTrack && (
          <span className="text-[10px] text-muted-foreground mt-1 max-w-full truncate">
            {item.currentTrack}
          </span>
        )}
      </Button>
    </div>
  );
}
