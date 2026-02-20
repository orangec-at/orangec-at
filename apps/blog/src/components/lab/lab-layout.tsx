"use client";

import { useState, useRef, useEffect } from "react";

import type { MDXFrontmatter } from "@/types/frontmatter";

import type { LensData, LensId, DeviceType, Screenshot } from "./types";
import { ScreenshotCarousel } from "./screenshot-carousel";
import { SectionHeading } from "./section-heading";
import { AnalysisCard } from "./analysis-card";
import { InsightCard } from "./insight-card";

interface LabLayoutProps {
  meta: MDXFrontmatter;
  lenses: LensData[];
  deviceType: DeviceType;
  screenshots: Screenshot[];
}

export function LabLayout({
  meta,
  lenses,
  deviceType,
  screenshots,
}: LabLayoutProps) {
  const [activeLens, setActiveLens] = useState<LensId>("component");
  const currentLens = lenses.find((l) => l.id === activeLens)!;

  // Floating mini thumbnail
  const heroRef = useRef<HTMLDivElement>(null);
  const [showMini, setShowMini] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMini(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article className="mx-auto w-full max-w-6xl px-4 pt-24 pb-8 md:px-6 md:pt-28 md:pb-12">
      {/* Header */}
      <header className="mb-10 text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          Lab &mdash; App/Web Research Journal
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {deviceType} &middot; {meta.date}
        </p>
      </header>

      {/* Hero Screenshot */}
      <div ref={heroRef} className="mb-10">
        <ScreenshotCarousel screenshots={screenshots} deviceType={deviceType} />
      </div>

      {/* Lens Tabs */}
      <nav className="mb-8 border-b border-border">
        <ul className="flex overflow-x-auto">
          {lenses.map((lens) => (
            <li key={lens.id}>
              <button
                type="button"
                onClick={() => setActiveLens(lens.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                  activeLens === lens.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lens.label}
                {activeLens === lens.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Lens Content */}
      <div className="space-y-10">
        <section>
          <SectionHeading>Observations</SectionHeading>
          <div className="rounded-2xl border border-border bg-card p-5 md:p-7">
            {currentLens.observe}
          </div>
        </section>

        <section>
          <SectionHeading>Analysis</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {currentLens.analysis.map((item, i) => (
              <AnalysisCard
                key={`${item.title}-${i}`}
                index={i + 1}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading>Insights</SectionHeading>
          <div className="space-y-3">
            {currentLens.insights.map((item, i) => (
              <InsightCard
                key={`${item.title}-${i}`}
                index={i + 1}
                title={item.title}
                body={item.body}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Floating Mini Thumbnail */}
      <button
        type="button"
        onClick={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-300 hover:scale-105 ${
          showMini
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        aria-label="View screenshot"
      >
        <img
          src={screenshots[0].src}
          alt={screenshots[0].alt}
          className={
            deviceType === "mobile"
              ? "h-[140px] w-auto object-cover"
              : "h-[80px] w-auto object-cover"
          }
        />
      </button>
    </article>
  );
}
