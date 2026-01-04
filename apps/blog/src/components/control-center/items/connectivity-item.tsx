"use client";

import { Button } from "@orangec-at/design";
import { ConnectivityItem } from "../types";

interface ConnectivityItemProps {
  item: ConnectivityItem;
}

export function ConnectivityItemComponent({ item }: ConnectivityItemProps) {
  return (
    <div className="col-span-4 bg-card border rounded-lg p-3 sm:p-4">
      <h3 className="text-sm font-medium text-card-foreground mb-3">
        {item.title}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {item.items.map((connectItem) => (
          <Button
            key={connectItem.id}
            variant={connectItem.connected ? "secondary" : "outline"}
            size="sm"
            className="h-auto flex-col py-3 hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 ease-out"
            onClick={connectItem.onClick}
          >
            {connectItem.icon}
            <span className="text-xs mt-1.5">{connectItem.name}</span>
            <div
              className={`w-1.5 h-1.5 rounded-full mt-1 ${
                connectItem.connected ? "bg-green-500" : "bg-muted-foreground"
              }`}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
