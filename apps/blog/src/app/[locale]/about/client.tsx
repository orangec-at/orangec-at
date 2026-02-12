"use client";

import Link from "next/link";
import { withLocalePath } from "@/lib/locale-path";

interface AboutClientProps {
  locale: "ko" | "en";
}

const content = {
  en: {
    headline: "Full-stack Developer & Product Builder",
    intro: [
      "I build and ship web/mobile products with a strong bias for execution. My focus is turning ambiguous product goals into stable, usable systems.",
      "Over the last 4.5 years, I have worked across SaaS admin platforms, authentication systems, and collaboration tools using React, Next.js, and TypeScript.",
      "I value fast iteration, clear architecture, and practical outcomes over unnecessary complexity.",
    ],
    stackTitle: "Tech Stack",
    stack: {
      Frontend: ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS"],
      Backend: ["NestJS", "REST API", "Prisma", "PostgreSQL", "Supabase"],
      Infrastructure: ["Docker", "Vercel", "Oracle Cloud", "AWS", "GitHub Actions"],
      "AI/Productivity": ["Claude Code", "RAG", "Monorepo", "pnpm", "Turborepo"],
    },
    timelineTitle: "Career Timeline",
    timeline: [
      "2025.09 - 2026.01: Freelance Frontend Developer, DPP Platform",
      "2022.10 - 2024.03: Frontend Developer, MIDAS IT",
      "2022.03 - 2022.09: Frontend Developer, pikurate",
    ],
    availabilityTitle: "Availability",
    availability: [
      "Type: Part-time (20h/week) or Full-time",
      "Start: Immediate",
      "Timezone: UTC+9, flexible for US/EU",
      "Work style: Remote, async-friendly",
    ],
    cta: "Let's discuss your project",
    ctaButton: "Contact",
  },
  ko: {
    headline: "풀스택 개발자 & 프로덕트 빌더",
    intro: [
      "실행 중심으로 웹/모바일 제품을 빠르게 만들고 배포합니다. 모호한 요구사항을 실제로 동작하는 시스템으로 바꾸는 일을 좋아합니다.",
      "지난 4.5년 동안 React, Next.js, TypeScript 기반으로 SaaS 백오피스, 인증 시스템, 협업 도구를 개발해왔습니다.",
      "복잡함을 늘리기보다 빠른 반복, 명확한 구조, 실질적인 결과를 우선합니다.",
    ],
    stackTitle: "기술 스택",
    stack: {
      "Frontend": ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS"],
      "Backend": ["NestJS", "REST API", "Prisma", "PostgreSQL", "Supabase"],
      "Infrastructure": ["Docker", "Vercel", "Oracle Cloud", "AWS", "GitHub Actions"],
      "AI/Productivity": ["Claude Code", "RAG", "Monorepo", "pnpm", "Turborepo"],
    },
    timelineTitle: "경력 타임라인",
    timeline: [
      "2025.09 - 2026.01: 프리랜서 프론트엔드 개발자 (DPP 플랫폼)",
      "2022.10 - 2024.03: MIDAS IT 프론트엔드 개발자",
      "2022.03 - 2022.09: pikurate 프론트엔드 개발자",
    ],
    availabilityTitle: "가용성",
    availability: [
      "근무 형태: 파트타임(주 20시간) 또는 풀타임",
      "시작 가능 시점: 즉시",
      "시간대: UTC+9 (미국/유럽 협업 가능)",
      "업무 방식: 원격, 비동기 친화",
    ],
    cta: "프로젝트 이야기를 나눠보세요",
    ctaButton: "문의하기",
  },
} as const;

export default function AboutClient({ locale }: AboutClientProps) {
  const t = content[locale];

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 md:py-24 space-y-16">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          {t.headline}
        </h1>
        <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          {t.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl md:text-3xl font-semibold">{t.stackTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(t.stack).map(([group, skills]) => (
            <div key={group} className="rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-foreground">{group}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{skills.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl md:text-3xl font-semibold">{t.timelineTitle}</h2>
        <ul className="space-y-3">
          {t.timeline.map((item) => (
            <li key={item} className="rounded-xl border border-border px-4 py-3 text-sm md:text-base text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl md:text-3xl font-semibold">{t.availabilityTitle}</h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {t.availability.map((item) => (
            <li key={item} className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-border bg-accent/30 p-8 md:p-10 space-y-4">
        <p className="text-lg md:text-xl font-medium text-foreground">{t.cta}</p>
        <Link
          href={withLocalePath(locale, "/contact")}
          className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {t.ctaButton}
        </Link>
      </section>
    </div>
  );
}
