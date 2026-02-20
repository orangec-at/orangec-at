"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Screenshot, DeviceType } from "./types";
import { DeviceFrame } from "./device-frame";

interface ScreenshotCarouselProps {
  screenshots: Screenshot[];
  deviceType: DeviceType;
}

export function ScreenshotCarousel({
  screenshots,
  deviceType,
}: ScreenshotCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const scrollTo = useCallback((index: number) => {
    const target = slideRefs.current[index];
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  useEffect(() => {
    if (screenshots.length <= 1) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) => Math.min(prev, screenshots.length - 1));
  }, [screenshots.length]);

  useEffect(() => {
    if (screenshots.length <= 1) {
      return;
    }

    const root = scrollRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible: { index: number; ratio: number } | null = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const rawIndex = entry.target.getAttribute("data-index");
          if (rawIndex === null) {
            continue;
          }

          const index = Number(rawIndex);
          if (Number.isNaN(index)) {
            continue;
          }

          if (!mostVisible || entry.intersectionRatio > mostVisible.ratio) {
            mostVisible = { index, ratio: entry.intersectionRatio };
          }
        }

        if (mostVisible) {
          setActiveIndex(mostVisible.index);
        }
      },
      { root, threshold: 0.6 }
    );

    slideRefs.current.forEach((item) => {
      if (item) {
        observer.observe(item);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [screenshots.length]);

  if (screenshots.length === 0) {
    return null;
  }

  if (screenshots.length === 1) {
    const only = screenshots[0];

    return (
      <div className="flex justify-center">
        <DeviceFrame type={deviceType} src={only.src} alt={only.alt} />
      </div>
    );
  }

  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= screenshots.length - 1;
  const activeLabel = screenshots[activeIndex]?.label;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        >
          {screenshots.map((screenshot, index) => (
            <div
              key={`${screenshot.src}-${screenshot.alt}`}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              data-index={index}
              className="flex w-full shrink-0 snap-center justify-center"
            >
              <DeviceFrame type={deviceType} src={screenshot.src} alt={screenshot.alt} />
            </div>
          ))}
        </div>

        {isFirst ? null : (
          <button
            type="button"
            aria-label="이전 스크린샷"
            onClick={() => scrollTo(Math.max(activeIndex - 1, 0))}
            className="absolute top-1/2 left-0 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition hover:bg-muted"
          >
            <span aria-hidden>←</span>
          </button>
        )}

        {isLast ? null : (
          <button
            type="button"
            aria-label="다음 스크린샷"
            onClick={() => scrollTo(Math.min(activeIndex + 1, screenshots.length - 1))}
            className="absolute top-1/2 right-0 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition hover:bg-muted"
          >
            <span aria-hidden>→</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          {screenshots.map((screenshot, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${screenshot.src}-${screenshot.alt}-dot`}
                type="button"
                aria-label={`스크린샷 ${index + 1}`}
                aria-current={isActive}
                onClick={() => scrollTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  isActive ? "bg-foreground" : "bg-muted-foreground/40 hover:bg-muted-foreground/70"
                }`}
              />
            );
          })}
        </div>

        {activeLabel ? <p className="text-center text-sm text-muted-foreground">{activeLabel}</p> : null}
      </div>
    </div>
  );
}
