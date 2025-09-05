import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { MusicPlayerItem } from "../types";

interface MusicPlayerItemProps {
  item: MusicPlayerItem;
  onAction?: (action: string, data?: unknown) => void;
}

export default function MusicPlayerItemComponent({ item, onAction }: MusicPlayerItemProps) {
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
    <div className="bg-card rounded-lg p-4 border transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95">
      <div className="space-y-3">
        {/* Track Info */}
        <div className="text-center">
          <div className="font-medium text-sm text-foreground truncate">
            {item.currentTrack}
          </div>
          {item.artist && (
            <div className="text-xs text-muted-foreground truncate">
              {item.artist}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            disabled={!item.onPrevious}
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={item.isPlaying ? handlePause : handlePlay}
            className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {item.isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            disabled={!item.onNext}
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar placeholder */}
        <div className="w-full bg-muted rounded-full h-1">
          <div className="bg-primary rounded-full h-1 w-1/3 transition-all duration-300"></div>
        </div>
      </div>
    </div>
  );
}