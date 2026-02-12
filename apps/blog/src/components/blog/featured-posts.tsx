"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import type { Post } from "@/lib/types";

interface FeaturedPostsProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
  onCatalogClick?: () => void;
}

const toShortDate = (isoDate: string) => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return parsed
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
};

export function FeaturedPosts({ posts, onPostClick, onCatalogClick }: FeaturedPostsProps) {
  const router = useRouter();
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();

  const featuredPosts = (() => {
    const featured = posts.filter((post) => post.featured);
    if (featured.length > 0) return featured.slice(0, 4);
    return posts.slice(0, 4);
  })();

  const handlePostClick = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
      return;
    }

    router.push(withLocalePath(locale, `/blog/${post.slug}`));
  };

  const handleCatalogClick = () => {
    if (onCatalogClick) {
      onCatalogClick();
      return;
    }

    router.push(withLocalePath(locale, "/blog"));
  };

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container-wide">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-ember-accent">Featured</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Latest Posts
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCatalogClick}
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
          >
            Full Catalog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featuredPosts.map((post, idx) => (
            <motion.button
              key={post.id}
              type="button"
              onClick={() => handlePostClick(post)}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.25, delay: idx * 0.04 }
              }
              className="group flex min-h-[220px] flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-ember-accent/40 hover:bg-ember-accent-bg"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="line-clamp-1 text-xs uppercase tracking-[0.18em] text-ember-accent">
                  {post.category}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-accent" />
              </div>

              <div className="flex-1">
                <h3 className="line-clamp-2 text-2xl font-semibold tracking-tight text-foreground">
                  {post.title}
                </h3>
                {post.content && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.content.slice(0, 120)}...
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  {toShortDate(post.date)}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
