"use client";

import type { BlogPostMeta } from "@/lib/blog-utils.server";
import { FEATURED_PROJECTS } from "@/data/projects";
import Link from "next/link";
import { withLocalePath } from "@/lib/locale-path";

interface HomeClientProps {
  locale: "ko" | "en";
  recentPosts: BlogPostMeta[];
}

const copy = {
  en: {
    heroTitle: "I build products fast.",
    heroSubtitle:
      "Full-stack engineer shipping practical products for teams and founders.",
    ctaProjects: "See Projects",
    ctaContact: "Work With Me",
    featuredProjects: "Featured Projects",
    featuredProjectsSub: "Recent work across SaaS, mobile, and platform systems.",
    recentPosts: "Recent Posts",
    recentPostsSub: "Technical writing and field notes from real projects.",
    readPost: "Read post",
    viewAllPosts: "View all posts",
    finalCtaTitle: "Need a frontend/full-stack partner?",
    finalCtaBody:
      "I help teams ship quickly with clean architecture, reliable delivery, and product-focused execution.",
    finalCtaPrimary: "Contact",
    finalCtaSecondary: "Newsletter",
  },
  ko: {
    heroTitle: "빠르게 만들고, 실제로 배포합니다.",
    heroSubtitle:
      "팀과 창업가를 위해 실용적인 제품을 만드는 풀스택 엔지니어입니다.",
    ctaProjects: "프로젝트 보기",
    ctaContact: "협업 문의",
    featuredProjects: "주요 프로젝트",
    featuredProjectsSub: "SaaS, 모바일, 플랫폼 영역에서 진행한 최근 작업입니다.",
    recentPosts: "최근 글",
    recentPostsSub: "실무에서 얻은 기술 기록과 인사이트를 공유합니다.",
    readPost: "글 읽기",
    viewAllPosts: "전체 글 보기",
    finalCtaTitle: "프로덕트 개발 파트너가 필요하신가요?",
    finalCtaBody:
      "클린한 구조와 빠른 실행으로, 아이디어를 실제 서비스로 연결해 드립니다.",
    finalCtaPrimary: "문의하기",
    finalCtaSecondary: "뉴스레터",
  },
} as const;

export default function HomeClient({ locale, recentPosts }: HomeClientProps) {
  const t = copy[locale];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24 space-y-20">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
          {t.heroTitle}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
          {t.heroSubtitle}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocalePath(locale, "/projects")}
            className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t.ctaProjects}
          </Link>
          <Link
            href={withLocalePath(locale, "/contact")}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            {t.ctaContact}
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">{t.featuredProjects}</h2>
          <p className="text-muted-foreground">{t.featuredProjectsSub}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURED_PROJECTS.slice(0, 3).map((project) => {
            const title = locale === "ko" ? project.title : project.titleEn || project.title;
            const description =
              locale === "ko"
                ? project.description
                : project.descriptionEn || project.description;

            return (
              <Link
                key={project.id}
                href={withLocalePath(locale, `/projects/${project.id}`)}
                className="rounded-2xl border border-border p-5 hover:border-foreground/30 hover:bg-accent/40 transition-colors"
              >
                <h3 className="font-semibold text-lg text-foreground line-clamp-2">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">{t.recentPosts}</h2>
          <p className="text-muted-foreground">{t.recentPostsSub}</p>
        </div>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={withLocalePath(locale, `/blog/${post.slug}`)}
              className="block rounded-2xl border border-border p-5 hover:border-foreground/30 hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{post.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {post.date}
                </span>
              </div>
              <span className="mt-3 inline-block text-sm text-foreground/80">
                {t.readPost}
              </span>
            </Link>
          ))}
        </div>
        <Link
          href={withLocalePath(locale, "/blog")}
          className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground"
        >
          {t.viewAllPosts}
        </Link>
      </section>

      <section className="rounded-3xl border border-border p-8 md:p-10 bg-accent/30 space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">{t.finalCtaTitle}</h2>
        <p className="max-w-2xl text-muted-foreground">{t.finalCtaBody}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={withLocalePath(locale, "/contact")}
            className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t.finalCtaPrimary}
          </Link>
          <Link
            href={withLocalePath(locale, "/newsletter/confirm")}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-background transition-colors"
          >
            {t.finalCtaSecondary}
          </Link>
        </div>
      </section>
    </div>
  );
}
