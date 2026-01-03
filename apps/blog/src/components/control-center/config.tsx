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
      id: "language",
      type: "language",
      size: "large",
      title: "언어",
      enabled: true,
      order: 2,
      currentLocale: "ko", // Will be injected by parent
      availableLanguages: [
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "en", name: "English", flag: "🇺🇸" },
      ],
      onLanguageChange: () => {}, // Will be injected by parent
    },
    {
      id: "music-player",
      type: "music-player",
      size: "wide",
      title: "음악재생",
      enabled: true,
      order: 3,
      isPlaying: false,
      currentTrack: "God Is",
      artist: "",
      onPlay: () => console.log("Play clicked"),
      onPause: () => console.log("Pause clicked"),
      onNext: () => console.log("Next clicked"),
      onPrevious: () => console.log("Previous clicked"),
    },
    {
      id: "language",
      type: "language",
      size: "large",
      title: "언어",
      enabled: true,
      order: 3,
      currentLocale: "ko",
      availableLanguages: [
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "en", name: "English", flag: "🇺🇸" },
      ],
      onLanguageChange: () => {}, // Will be injected by parent
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
      id: "language",
      type: "language",
      size: "medium",
      title: "언어",
      enabled: true,
      order: 2,
      currentLocale: "ko", // Will be injected by parent
      availableLanguages: [
        { code: "ko", name: "한국어", flag: "🇰🇷" },
        { code: "en", name: "English", flag: "🇺🇸" },
      ],
      onLanguageChange: () => {}, // Will be injected by parent
    },
    {
      id: "music-player",
      type: "music-player",
      size: "wide",
      title: "음악재생",
      enabled: true,
      order: 3,
      isPlaying: false,
      currentTrack: "God Is",
      artist: "",
      onPlay: () => console.log("Play clicked"),
      onPause: () => console.log("Pause clicked"),
      onNext: () => console.log("Next clicked"),
      onPrevious: () => console.log("Previous clicked"),
    },
  ],
};
