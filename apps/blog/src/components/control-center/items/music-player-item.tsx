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
    <div className="col-span-4 muji-control-card rounded-xl p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={item.isPlaying ? handlePause : handlePlay}
            className="muji-pill-button flex-1 justify-between"
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
            className="muji-icon-button h-9 w-9"
            disabled={!item.onPrevious}
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="muji-icon-button h-9 w-9"
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
