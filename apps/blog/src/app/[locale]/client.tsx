"use client";

import { HOMEPAGE_CONTENT } from "@/data/homepage-content";
import type { Project } from "@/data/projects";
import type { BlogPostMeta } from "@/lib/blog-utils.server";
import { withLocalePath } from "@/lib/locale-path";
import Link from "next/link";

interface HomeClientProps {
  locale: "ko" | "en";
  recentPosts: BlogPostMeta[];
  featuredProjects: Project[];
}

export default function HomeClient({
  locale,
  recentPosts,
  featuredProjects,
}: HomeClientProps) {
  const isKo = locale === "ko";
  const hero = HOMEPAGE_CONTENT.hero;
  const cta = HOMEPAGE_CONTENT.cta;

  return (
    <div className="container-narrow py-section space-y-16 md:space-y-20">
      <section className="space-y-6">
        <h1 className="text-display font-serif tracking-tight text-foreground">
          {isKo ? hero.headlineKo : hero.headline}
        </h1>
        <p className="max-w-3xl text-body leading-relaxed text-muted-foreground">
          {isKo ? hero.subheadlineKo : hero.subheadline}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocalePath(locale, hero.cta.primary.href)}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            {isKo ? hero.cta.primary.labelKo : hero.cta.primary.label}
          </Link>
          <Link
            href={withLocalePath(locale, hero.cta.secondary.href)}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-small font-medium transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {isKo ? hero.cta.secondary.labelKo : hero.cta.secondary.label}
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOMEPAGE_CONTENT.socialProof.map((item) => (
            <article key={item.number} className="rounded-2xl border border-border p-5">
              <p className="text-h2 text-foreground">{item.number}</p>
              <p className="mt-1 text-small font-medium text-foreground">
                {isKo ? item.labelKo : item.label}
              </p>
              <p className="mt-2 text-small text-muted-foreground">
                {isKo ? item.descriptionKo : item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-h2 font-serif">Featured Projects</h2>
          <p className="text-body text-muted-foreground">
            {isKo
              ? "문제를 정의하고 실제 제품으로 전달한 대표 작업입니다."
              : "Selected projects showing end-to-end product delivery."}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project) => {
            const title = isKo ? project.title : project.titleEn || project.title;
            const description = isKo
              ? project.description
              : project.descriptionEn || project.description;
            const role = isKo ? project.role : project.roleEn || project.role;
            const duration = isKo
              ? project.duration
              : project.durationEn || project.duration;
            const impacts = (isKo ? project.impact : project.impactEn || project.impact) || [];

            return (
              <article key={project.id} className="rounded-2xl border border-border p-5">
                <div className="space-y-2">
                  <h3 className="text-h3 text-foreground">{title}</h3>
                  <p className="text-small text-muted-foreground">{description}</p>
                  <p className="text-micro font-mono uppercase tracking-wide text-muted-foreground">
                    {[role, duration].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <ul className="mt-4 space-y-2 text-small text-muted-foreground">
                  {impacts.slice(0, 3).map((impact) => (
                    <li key={impact} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ember-accent" />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={withLocalePath(locale, `/projects/${project.id}`)}
                  className="mt-5 inline-flex text-small font-medium text-foreground transition-colors hover:text-ember-accent"
                >
                  {isKo ? "프로젝트 자세히" : "View project"}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-h2 font-serif">
            {isKo ? "최근 글" : "Recent Posts"}
          </h2>
          <p className="text-body text-muted-foreground">
            {isKo
              ? "사례 중심 글과 기술 인사이트를 공유합니다."
              : "Case studies and technical insights from real projects."}
          </p>
        </div>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={withLocalePath(locale, `/blog/${post.slug}`)}
              className="block rounded-2xl border border-border p-5 transition-colors hover:border-ember-accent/40"
            >
              <h3 className="text-h3 text-foreground">{post.title}</h3>
              <p className="mt-1 text-small text-muted-foreground">{post.description}</p>
              <p className="mt-2 text-micro font-mono text-muted-foreground">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-accent/30 p-8 md:p-10">
        <h2 className="text-h2 font-serif">
          {isKo ? cta.headlineKo : cta.headline}
        </h2>
        <p className="mt-3 max-w-3xl text-body text-muted-foreground">
          {isKo ? cta.subheadlineKo : cta.subheadline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLocalePath(locale, cta.cta.primary.href)}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            {isKo ? cta.cta.primary.labelKo : cta.cta.primary.label}
          </Link>
          <Link
            href={withLocalePath(locale, "/newsletter/confirm")}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-small font-medium transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {isKo ? cta.cta.secondary.labelKo : cta.cta.secondary.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
