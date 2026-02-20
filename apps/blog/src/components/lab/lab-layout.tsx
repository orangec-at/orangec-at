"use client";

import { useState } from "react";

import type { MDXFrontmatter } from "@/types/frontmatter";

import type { LensData, LensId, DeviceType } from "./types";
import { DeviceFrame } from "./device-frame";
import { SectionHeading } from "./section-heading";
import { AnalysisCard } from "./analysis-card";
import { InsightCard } from "./insight-card";

interface LabLayoutProps {
  meta: MDXFrontmatter;
  lenses: LensData[];
  deviceType: DeviceType;
  screenshotSrc: string;
  screenshotAlt: string;
}

export function LabLayout({
  meta,
  lenses,
  deviceType,
  screenshotSrc,
  screenshotAlt,
}: LabLayoutProps) {
  const [activeLens, setActiveLens] = useState<LensId>("component");
  const currentLens = lenses.find((l) => l.id === activeLens)!;

  return (
    <article className="mx-auto w-full max-w-6xl px-4 pt-24 pb-8 md:px-6 md:pt-28 md:pb-12">
      <header className="mb-8 text-center lg:text-left">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
          Lab &mdash; 앱/웹 연구일지
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">{meta.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {deviceType} &middot; {meta.date}
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[auto_1fr] lg:gap-10">
        <div className="mb-8 flex justify-center lg:mb-0">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <DeviceFrame type={deviceType} src={screenshotSrc} alt={screenshotAlt} />
          </div>
        </div>

        <div className="min-w-0">
          <nav className="mb-8 border-b border-border">
            <ul className="flex overflow-x-auto">
              {lenses.map((lens) => {
                return (
                  <li key={lens.id}>
                    <button
                      type="button"
                      onClick={() => setActiveLens(lens.id)}
                      className={`relative px-4 py-3 text-sm font-medium transition-colors ${activeLens === lens.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {lens.label}
                      {activeLens === lens.id && (<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-10">
            <section>
              <SectionHeading>관찰 &mdash; What I See</SectionHeading>
              <div className="rounded-2xl border border-border bg-card p-5 md:p-7">{currentLens.observe}</div>
            </section>

            <section>
              <SectionHeading>분석 &mdash; What I Learn</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {currentLens.analysis.map((item, i) => (
                  <AnalysisCard key={`${item.title}-${i}`} index={i + 1} title={item.title} body={item.body} />
                ))}
              </div>
            </section>

            <section>
              <SectionHeading>인사이트 &mdash; What I Take</SectionHeading>
              <div className="space-y-3">
                {currentLens.insights.map((item, i) => (
                  <InsightCard key={`${item.title}-${i}`} index={i + 1} title={item.title} body={item.body} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
