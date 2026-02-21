import { ReactNode } from "react";

export type ControlItemSize = "small" | "medium" | "large" | "wide";

export type ControlItemType = 
  | "connectivity"
  | "media"
  | "theme"
  | "quick-action" 
  | "slider"
  | "info"
  | "music-player";

export interface BaseControlItem {
  id: string;
  type: ControlItemType;
  size: ControlItemSize;
  title: string;
  enabled: boolean;
  order: number;
}

export interface ConnectivityItem extends BaseControlItem {
  type: "connectivity";
  items: {
    id: string;
    name: string;
    icon: ReactNode;
    connected: boolean;
    onClick?: () => void;
  }[];
}

export interface MediaItem extends BaseControlItem {
  type: "media";
  isPlaying: boolean;
  currentTrack?: string;
  onClick?: () => void;
}

export interface ThemeItem extends BaseControlItem {
  type: "theme";
  currentTheme: "light" | "dark" | "system";
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export interface QuickActionItem extends BaseControlItem {
  type: "quick-action";
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface SliderItem extends BaseControlItem {
  type: "slider";
  icon: ReactNode;
  value: number;
  max: number;
  unit?: string;
  color?: string;
  onChange?: (value: number) => void;
}

export interface InfoItem extends BaseControlItem {
  type: "info";
  content: string;
}

export interface MusicPlayerItem extends BaseControlItem {
  type: "music-player";
  isPlaying: boolean;
  currentTrack: string;
  artist?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export type ControlItem = 
  | ConnectivityItem 
  | MediaItem 
  | ThemeItem 
  | QuickActionItem 
  | SliderItem 
  | InfoItem
  | MusicPlayerItem;

export interface ControlCenterConfig {
  items: ControlItem[];
  layout: {
    maxWidth: string;
    gap: string;
    columns: number;
  };
}
