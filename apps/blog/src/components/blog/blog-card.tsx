"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";

interface BlogCardProps {
  title: string;
  date: string;
  slug: string;
  description?: string;
  author: string;
  category?: string;
  thumbnail?: string;
  readTime?: string;
  tags?: string[];
  featured?: boolean;
}

export default function BlogCard({
  title,
  date,
  slug,
  description,
  category,
  thumbnail,
  readTime,
  tags = [],
  featured = false,
}: BlogCardProps) {
  const t = useTranslations("blog");
  const locale = useLocale();

  return (
    <Link href={withLocalePath(locale, `/blog/${slug}`)} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-ember-accent/40 hover:bg-ember-accent-bg">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
              <div className="text-center">
                <p className="text-2xl opacity-45" aria-hidden>
                  📝
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {category || t("defaultCategory")}
                </p>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {category && (
              <span className="inline-flex rounded-full border border-ember-accent/30 bg-ember-accent-bg px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ember-accent">
                {category}
              </span>
            )}
            {readTime && (
              <span className="inline-flex rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {readTime}
              </span>
            )}
          </div>

          {featured && (
            <div className="absolute right-3 top-3">
              <span className="inline-flex rounded-full border border-ember-accent/30 bg-ember-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                {t("featured")}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground">{title}</h3>

          {description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-md border border-border bg-surface px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex rounded-md border border-border bg-surface px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-5">
            <time className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{date}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
