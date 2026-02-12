"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, LayoutGrid, Search, SquareStack, Table } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { type ComponentType, useMemo, useState } from "react";
import { withLocalePath } from "@/lib/locale-path";
import type { Post } from "@/lib/types";

type ViewMode = "table" | "grid" | "card";

interface BlogCatalogProps {
  posts: Post[];
  onPostClick?: (post: Post) => void;
  onBack?: () => void;
  onSearchOpen?: () => void;
}

const viewModeOptions: Array<{ mode: ViewMode; label: string; icon: ComponentType<{ className?: string }> }> = [
  { mode: "table", label: "Table", icon: Table },
  { mode: "grid", label: "Grid", icon: LayoutGrid },
  { mode: "card", label: "Card", icon: SquareStack },
];

const toCatalogDate = (isoDate: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate.replace(/-/g, ".");
  }

  return isoDate;
};

const toShortDate = (isoDate: string) => {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return parsed
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
};

const getCategoryLabel = (category?: string) => {
  if (!category) return "Uncategorized";
  return category
    .split("-")
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join(" ");
};

export function BlogCatalog({
  posts,
  onPostClick,
  onBack,
  onSearchOpen,
}: BlogCatalogProps) {
  const router = useRouter();
  const locale = useLocale();
  const prefersReducedMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.push(withLocalePath(locale, "/"));
  };

  const handlePostClick = (post: Post) => {
    if (onPostClick) {
      onPostClick(post);
      return;
    }

    router.push(withLocalePath(locale, `/blog/${post.slug}`));
  };

  const categoryCount = useMemo(
    () => new Set(posts.map((post) => post.category).filter(Boolean)).size,
    [posts],
  );

  return (
    <section className="min-h-screen bg-background pt-28 pb-20 md:pt-32">
      <div className="container-wide">
        <motion.button
          type="button"
          onClick={handleBack}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
          className="group mb-10 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </motion.button>

        <div className="mb-8 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
          >
            <p className="text-xs uppercase tracking-[0.26em] text-ember-accent">Archive</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Blog Catalog
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {posts.length} articles and {categoryCount} categories
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25, delay: 0.05 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="inline-flex items-center rounded-lg border border-border bg-card p-1">
              {viewModeOptions.map(({ mode, label, icon: Icon }) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                    viewMode === mode
                      ? "bg-ember-accent text-white"
                      : "text-muted-foreground hover:text-ember-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {onSearchOpen && (
              <button
                type="button"
                onClick={onSearchOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-ember-accent/40 hover:text-ember-accent"
                aria-label="Open catalog search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "table" && (
            <motion.div
              key="table"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <th className="px-4 py-3 font-medium">No.</th>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post, idx) => (
                      <tr
                        key={post.id}
                        className="cursor-pointer border-b border-border/60 text-sm text-foreground transition-colors last:border-none hover:bg-ember-accent-bg"
                        onClick={() => handlePostClick(post)}
                      >
                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-4 font-medium">{post.title}</td>
                        <td className="px-4 py-4 text-muted-foreground">{getCategoryLabel(post.category)}</td>
                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                          {toCatalogDate(post.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {posts.map((post, idx) => (
                <motion.button
                  key={post.id}
                  type="button"
                  onClick={() => handlePostClick(post)}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.2, delay: idx * 0.02 }
                  }
                  className="group flex min-h-[220px] flex-col rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-ember-accent/40 hover:bg-ember-accent-bg"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-ember-accent">
                      Vol. {String(idx + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ember-accent" />
                  </div>
                  <h3 className="line-clamp-2 text-xl font-semibold text-foreground">{post.title}</h3>
                  <div className="mt-auto pt-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {getCategoryLabel(post.category)}
                    </p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">{toCatalogDate(post.date)}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {viewMode === "card" && (
            <motion.div
              key="card"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              className="space-y-3"
            >
              {posts.map((post, idx) => (
                <motion.button
                  key={post.id}
                  type="button"
                  onClick={() => handlePostClick(post)}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.2, delay: idx * 0.02 }
                  }
                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 text-left transition-colors hover:border-ember-accent/40 hover:bg-ember-accent-bg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {toShortDate(post.date)}
                    </p>
                    <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{post.title}</h3>
                    <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                      {getCategoryLabel(post.category)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-ember-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
