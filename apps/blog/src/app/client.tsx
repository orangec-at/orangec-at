"use client";

import { HOMEPAGE_CONTENT } from "@/data/homepage-content";
import type { Project } from "@/data/projects";
import type { BlogPostMeta } from "@/lib/blog-utils.server";
import Link from "next/link";

interface HomeClientProps {
  recentPosts: BlogPostMeta[];
  featuredProjects: Project[];
}

export default function HomeClient({
  recentPosts,
  featuredProjects,
}: HomeClientProps) {
  const hero = HOMEPAGE_CONTENT.hero;
  const cta = HOMEPAGE_CONTENT.cta;

  return (
    <div className="container-narrow pb-section space-y-16 md:space-y-20">
      <section className="space-y-6">
        <div className="mb-8 border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.26em] text-ember-accent">Home</p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            {hero.subheadline}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={hero.cta.primary.href}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            {hero.cta.primary.label}
          </Link>
          <Link
            href={hero.cta.secondary.href}
            className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-small font-medium transition-colors hover:border-ember-accent hover:text-ember-accent"
          >
            {hero.cta.secondary.label}
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Social Proof
            </p>
            <h2 className="text-h2 font-serif text-foreground">
              Proof in Numbers
            </h2>
            <p className="text-body text-muted-foreground">
              Core metrics that quickly show product traction and delivery outcomes.
            </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOMEPAGE_CONTENT.socialProof.map((item) => (
            <article key={item.number} className="rounded-2xl border border-border p-5">
              <p className="text-h2 text-foreground">{item.number}</p>
              <p className="mt-1 text-small text-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-small text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.26em] text-ember-accent">
              Featured Collection
          </p>
          <h2 className="text-h2 font-serif text-foreground">Featured Projects</h2>
          <p className="text-body text-muted-foreground">
              Selected projects showing end-to-end product delivery.
          </p>
        </div>
        <div className="grid gap-4">
          {featuredProjects.map((project) => {
            const title = project.titleEn || project.title;
            const description = project.descriptionEn || project.description;
            const role = project.roleEn || project.role;
            const duration = project.durationEn || project.duration;
            const impacts = project.impactEn || project.impact || [];

            return (
              <article key={project.id} className="rounded-2xl border border-border p-5">
                <div className="space-y-2">
                  <h3 className="text-h3 text-foreground">{title}</h3>
                  <p className="text-small text-muted-foreground">{description}</p>
                   <p className="text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">
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
                  href={`/projects/${project.id}`}
                  className="mt-5 inline-flex text-small font-medium text-foreground transition-colors hover:text-ember-accent"
                >
                  View project
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Editorial
            </p>
            <h2 className="text-h2 font-serif text-foreground">
              Recent Posts
            </h2>
            <p className="text-body text-muted-foreground">
              Case studies and technical insights from real projects.
            </p>
        </div>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-border p-5 transition-colors hover:border-ember-accent/40"
            >
              <h3 className="text-h3 text-foreground">{post.title}</h3>
              <p className="mt-1 text-small text-muted-foreground">{post.description}</p>
               <p className="mt-2 text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <p className="text-micro font-mono uppercase tracking-[0.14em] text-ember-accent">
              Explore More
          </p>
          <h2 className="text-h2 font-serif text-foreground">
              Discover More Pages
          </h2>
          <p className="text-body text-muted-foreground">
              Public pages not surfaced in the header, gathered in one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/resume"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ember-accent/60"
          >
            <p className="text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">
              Career
            </p>
            <h3 className="mt-2 text-h3 text-foreground">Resume</h3>
            <p className="mt-2 text-body text-muted-foreground">
              Review experience, outcomes, and how I approach delivery.
            </p>
          </Link>

          <Link
            href="/design"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ember-accent/60"
          >
            <p className="text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">
              System
            </p>
            <h3 className="mt-2 text-h3 text-foreground">Design</h3>
            <p className="mt-2 text-body text-muted-foreground">
              Browse the design system and the UI decisions behind it.
            </p>
          </Link>

          <Link
            href="/privacy"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ember-accent/60"
          >
            <p className="text-micro font-mono uppercase tracking-[0.14em] text-muted-foreground">
              Policy
            </p>
            <h3 className="mt-2 text-h3 text-foreground">Privacy</h3>
            <p className="mt-2 text-body text-muted-foreground">
              Review how personal data is handled and protected.
            </p>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-accent/30 p-8 md:p-10">
        <h2 className="text-h2 font-serif">
          {cta.headline}
        </h2>
        <p className="mt-3 max-w-3xl text-body text-muted-foreground">
          {cta.subheadline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={cta.cta.primary.href}
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-small font-medium text-background transition-colors hover:bg-ember-accent hover:text-primary-foreground"
          >
            {cta.cta.primary.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
