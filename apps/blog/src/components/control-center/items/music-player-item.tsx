import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { MusicPlayerItem } from "../types";
import { useTranslations } from "next-intl";

interface MusicPlayerItemProps {
  item: MusicPlayerItem;
  onAction?: (action: string, data?: unknown) => void;
}

export default function MusicPlayerItemComponent({
  item,
  onAction,
}: MusicPlayerItemProps) {
  const t = useTranslations("controlCenter");
  const trackLabel =
    item.currentTrack?.trim().length > 0 ? item.currentTrack : t("noMusic");

  const handlePlay = () => {
    item.onPlay?.();
    onAction?.("music-play", { id: item.id });
  };

  const handlePause = () => {
    item.onPause?.();
    onAction?.("music-pause", { id: item.id });
  };

  const handleNext = () => {
    item.onNext?.();
    onAction?.("music-next", { id: item.id });
  };

  const handlePrevious = () => {
    item.onPrevious?.();
    onAction?.("music-previous", { id: item.id });
  };

  return (
    <div className="col-span-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={item.isPlaying ? handlePause : handlePlay}
            className="inline-flex flex-1 items-center justify-between gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent"
            data-active={item.isPlaying}
          >
            <span className="flex items-center gap-2 min-w-0">
              {item.isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
              <span className="truncate">{trackLabel}</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">
              {item.isPlaying ? "On" : "Off"}
            </span>
          </button>
          <button
            type="button"
            onClick={handlePrevious}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            disabled={!item.onPrevious}
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            disabled={!item.onNext}
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
