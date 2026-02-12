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
    <div className="mx-auto w-full max-w-5xl space-y-16 px-6 py-16 md:py-24">
      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">{ABOUT_CONTENT.name}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {isKo ? ABOUT_CONTENT.titleKo : ABOUT_CONTENT.title}
        </h1>
        <div className="max-w-4xl space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {(isKo ? ABOUT_CONTENT.storyKo : ABOUT_CONTENT.story).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">{labels.frontend}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {ABOUT_CONTENT.techStack.frontend.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">{labels.backend}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {ABOUT_CONTENT.techStack.backend.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">{labels.infrastructure}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {ABOUT_CONTENT.techStack.infrastructure.join(" · ")}
            </p>
          </article>
          <article className="rounded-2xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground">{labels.ai}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {ABOUT_CONTENT.techStack.ai.join(" · ")}
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          {labels.timeline}
        </h2>
        <div className="space-y-4 border-l border-border pl-6">
          {ABOUT_CONTENT.career.map((item) => (
            <article key={`${item.year}-${item.company}`} className="relative rounded-xl border border-border p-4">
              <span className="absolute -left-[1.72rem] top-5 h-2.5 w-2.5 rounded-full bg-[#FF4D00]" />
              <p className="text-xs text-muted-foreground">{item.year}</p>
              <h3 className="mt-1 text-base font-semibold text-foreground">
                {isKo ? item.roleKo : item.role} - {item.company}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {isKo ? item.descriptionKo : item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
          {labels.availability}
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.typeKo : ABOUT_CONTENT.availability.type}
          </article>
          <article className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.startKo : ABOUT_CONTENT.availability.start}
          </article>
          <article className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {isKo
              ? ABOUT_CONTENT.availability.timezoneKo
              : ABOUT_CONTENT.availability.timezone}
          </article>
          <article className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            {isKo ? ABOUT_CONTENT.availability.styleKo : ABOUT_CONTENT.availability.style}
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-accent/30 p-8 md:p-10">
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocalePath(locale, "/resume")}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[#FF4D00]"
          >
            {labels.ctaResume}
          </Link>
          <Link
            href={withLocalePath(locale, "/contact")}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[#FF4D00] hover:text-[#FF4D00]"
          >
            {labels.ctaContact}
          </Link>
        </div>
      </section>
    </div>
  );
}
