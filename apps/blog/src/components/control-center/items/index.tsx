import { ControlItem } from "../types";
import { ConnectivityItemComponent } from "./connectivity-item";
import { MediaItemComponent } from "./media-item";
import { ThemeItemComponent } from "./theme-item";
import { QuickActionItemComponent } from "./quick-action-item";
import { SliderItemComponent } from "./slider-item";
import { InfoItemComponent } from "./info-item";
import MusicPlayerItemComponent from "./music-player-item";

interface ControlItemRendererProps {
  item: ControlItem;
  onAction?: (action: string, data?: any) => void;
}

export function ControlItemRenderer({ item, onAction }: ControlItemRendererProps) {
  if (!item.enabled) return null;

  switch (item.type) {
    case "connectivity":
      return <ConnectivityItemComponent item={item} />;
    case "media":
      return <MediaItemComponent item={item} />;
    case "theme":
      return <ThemeItemComponent item={item} />;
    case "quick-action":
      return <QuickActionItemComponent item={item} />;
    case "slider":
      return <SliderItemComponent item={item} />;
    case "info":
      return <InfoItemComponent item={item} />;
    case "music-player":
      return <MusicPlayerItemComponent item={item} onAction={onAction} />;
    default:
      return null;
  }
}

export * from "./connectivity-item";
export * from "./media-item";
export * from "./theme-item";
export * from "./quick-action-item";
export * from "./slider-item";
export * from "./info-item";