"use client";

import { ABOUT_CONTENT } from "@/data/about-content";
import { withLocalePath } from "@/lib/locale-path";
import Link from "next/link";

interface AboutClientProps {
  locale: "ko" | "en";
}

const stackLabels = {
  en: {
    frontend: "Frontend",
    backend: "Backend",
    infrastructure: "Infrastructure",
    ai: "AI",
    timeline: "Career Timeline",
    availability: "Availability",
    ctaResume: "Download Resume",
    ctaContact: "Contact Me",
  },
  ko: {
    frontend: "프론트엔드",
    backend: "백엔드",
    infrastructure: "인프라",
    ai: "AI",
    timeline: "경력 타임라인",
    availability: "가용성",
    ctaResume: "이력서 보기",
    ctaContact: "문의하기",
  },
} as const;

export default function AboutClient({ locale }: AboutClientProps) {
  const isKo = locale === "ko";
  const labels = stackLabels[locale];

  return (
    <div className="container-narrow pb-section space-y-16 md:space-y-20">
      <section className="space-y-6">
        <div className="mb-8 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.26em] text-ember-accent">About</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {isKo ? ABOUT_CONTENT.titleKo : ABOUT_CONTENT.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {(isKo ? ABOUT_CONTENT.storyKo : ABOUT_CONTENT.story)[0]}
          </p>
        </div>

        <div className="space-y-4 text-body leading-relaxed text-muted-foreground">
          {(isKo ? ABOUT_CONTENT.storyKo : ABOUT_CONTENT.story).slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-micro font-mono uppercase tracking-wide text-foreground">{labels.frontend}</h2>
            <p className="mt-2 text-small text-muted-foreground">
              {ABOUT_CONTENT.techStack.frontend.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-micro font-mono uppercase tracking-wide text-foreground">{labels.backend}</h2>
            <p className="mt-2 text-small text-muted-foreground">
              {ABOUT_CONTENT.techStack.backend.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-micro font-mono uppercase tracking-wide text-foreground">{labels.infrastructure}</h2>
            <p className="mt-2 text-small text-muted-foreground">
              {ABOUT_CONTENT.techStack.infrastructure.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-micro font-mono uppercase tracking-wide text-foreground">{labels.ai}</h2>
            <p className="mt-2 text-small text-muted-foreground">
              {ABOUT_CONTENT.techStack.ai.join(" · ")}
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-h2 font-serif text-foreground">
          {labels.timeline}
        </h2>
        <div className="space-y-4 border-l border-border pl-6">
          {ABOUT_CONTENT.career.map((item) => (
            <article key={`${item.year}-${item.company}`} className="relative rounded-xl border border-border p-4">
              <span className="absolute -left-[1.72rem] top-5 h-2.5 w-2.5 rounded-full bg-ember-accent" />
              <p className="text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">{item.year}</p>
              <h3 className="mt-1 text-h3 text-foreground">
                {isKo ? item.roleKo : item.role} - {item.company}
              </h3>
              <p className="mt-1 text-small text-muted-foreground">
                {isKo ? item.descriptionKo : item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-h2 font-serif text-foreground">
          {labels.availability}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-4 text-small text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.typeKo : ABOUT_CONTENT.availability.type}
          </article>
          <article className="rounded-xl border border-border bg-card p-4 text-small text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.startKo : ABOUT_CONTENT.availability.start}
          </article>
          <article className="rounded-xl border border-border bg-card p-4 text-small text-muted-foreground">
            {isKo
              ? ABOUT_CONTENT.availability.timezoneKo
              : ABOUT_CONTENT.availability.timezone}
          </article>
          <article className="rounded-xl border border-border bg-card p-4 text-small text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.styleKo : ABOUT_CONTENT.availability.style}
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-accent/30 p-8 md:p-10">
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocalePath(locale, "/resume")}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            {labels.ctaResume}
          </Link>
          <Link
            href={withLocalePath(locale, "/contact")}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-small font-medium transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {labels.ctaContact}
          </Link>
        </div>
      </section>
    </div>
  );
}
