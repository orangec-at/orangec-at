"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type BackgroundMusicContextValue = {
  isPlaying: boolean;
  currentTrack: string;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(
  null
);

const STORAGE_KEY = "background-music-playing";
const STORAGE_TRACK_KEY = "background-music-track-index";

const PLAYLIST = [
  {
    title: "A Canoa Virou",
    src: "/audio/A Canoa Virou - MUJI BGM.mp3",
  },
  {
    title: "Cavalo Marinho",
    src: "/audio/Cavalo Marinho - MUJI BGM.mp3",
  },
  {
    title: "Sapo Cururu",
    src: "/audio/Sapo Cururu - MUJI BGM.mp3",
  },
  {
    title: "God Is",
    src: "/audio/god-is.mp3",
  },
];

export function BackgroundMusic({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(STORAGE_TRACK_KEY);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return Number.isNaN(parsed) ? 0 : Math.min(Math.max(parsed, 0), PLAYLIST.length - 1);
  });

  const currentTrack = PLAYLIST[currentIndex] || PLAYLIST[0];

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(
      () => {
        setIsPlaying(true);
        localStorage.setItem(STORAGE_KEY, "true");
      },
      () => {
        setIsPlaying(false);
      }
    );
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    localStorage.setItem(STORAGE_KEY, "false");
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  const previous = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? PLAYLIST.length - 1 : prev - 1
    );
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState === "true") {
      play();
    }
  }, [play]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TRACK_KEY, String(currentIndex));
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, currentTrack.src, isPlaying]);

  const value = useMemo(
    () => ({
      isPlaying,
      currentTrack: currentTrack.title,
      play,
      pause,
      toggle,
      next,
      previous,
    }),
    [isPlaying, play, pause, toggle, currentTrack.title, next, previous]
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          // Keep playing the next track when current one finishes
          setIsPlaying(true);
          next();
        }}
      />
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic() {
  const context = useContext(BackgroundMusicContext);
  if (!context) {
    throw new Error(
      "useBackgroundMusic must be used within BackgroundMusic provider."
    );
  }
  return context;
}
