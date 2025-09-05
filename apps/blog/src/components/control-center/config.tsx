// Control center configuration - icons imported in individual components
import { ControlCenterConfig } from "./types";

export const defaultControlCenterConfig: ControlCenterConfig = {
  layout: {
    maxWidth: "380px",
    gap: "0.75rem",
    columns: 6,
  },
  items: [
    {
      id: "theme",
      type: "theme",
      size: "large",
      title: "테마",
      enabled: true,
      order: 1,
      currentTheme: "system" as const,
      onThemeChange: () => {}, // Will be injected by parent
    },
    {
      id: "music-player",
      type: "music-player",
      size: "wide",
      title: "음악재생",
      enabled: true,
      order: 2,
      isPlaying: false,
      currentTrack: "재생 중인 음악이 없습니다",
      artist: "",
      onPlay: () => console.log("Play clicked"),
      onPause: () => console.log("Pause clicked"),
      onNext: () => console.log("Next clicked"),
      onPrevious: () => console.log("Previous clicked"),
    },
  ],
};

// Web-optimized inline configuration
export const inlineControlCenterConfig: ControlCenterConfig = {
  layout: {
    maxWidth: "100%",
    gap: "1rem",
    columns: 4,
  },
  items: [
    {
      id: "theme",
      type: "theme",
      size: "medium",
      title: "테마",
      enabled: true,
      order: 1,
      currentTheme: "system" as const,
      onThemeChange: () => {}, // Will be injected by parent
    },
    {
      id: "music-player",
      type: "music-player",
      size: "wide",
      title: "음악재생",
      enabled: true,
      order: 2,
      isPlaying: false,
      currentTrack: "재생 중인 음악이 없습니다",
      artist: "",
      onPlay: () => console.log("Play clicked"),
      onPause: () => console.log("Pause clicked"),
      onNext: () => console.log("Next clicked"),
      onPrevious: () => console.log("Previous clicked"),
    },
  ],
};