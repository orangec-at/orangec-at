import type { MDXFrontmatter } from "@/types/frontmatter";

export const meta: MDXFrontmatter = {
  title: "Custom Layout TSX Demo: Full-Page Product Brief",
  description:
    "A custom-layout TSX post that renders a complete full-page experience with a hero, feature cards, implementation snippet, and clear call to action.",
  date: "2026-02-14",
  tags: ["typescript", "nextjs", "tailwindcss", "development"],
  category: "technical",
  author: "Jaeil Lee",
  relatedProjects: ["orangec-at-blog"],
  featured: false,
  draft: false,
  layout: "custom",
  seo: {
    keywords: [
      "custom tsx blog layout",
      "nextjs custom post rendering",
      "full page tsx content",
    ],
  },
};

const highlights = [
  {
    title: "Composable Sections",
    description:
      "Each UI block is independently reusable, so the route can evolve without rewriting the entire page template.",
  },
  {
    title: "Route-Level Flexibility",
    description:
      "Using layout \"custom\" allows this post to bypass shared prose wrappers and render a dedicated page composition.",
  },
  {
    title: "Production-Friendly Defaults",
    description:
      "Semantic structure, constrained spacing, and clear typographic hierarchy keep the output readable on desktop and mobile.",
  },
] as const;

export default function Post() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-20 md:px-10 md:pt-24">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-zinc-700 bg-zinc-800/60 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
            Custom TSX Rendering Path
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            Full-Page Layout for Route-Level TSX Post Testing
          </h1>
          <p className="mt-6 text-base leading-7 text-zinc-300 md:text-lg">
            This page validates the custom post rendering path by composing a
            standalone UI instead of relying on shared markdown-like wrappers.
            The structure includes a hero, feature cards, implementation snippet,
            and a direct call to action.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-14 md:grid-cols-3 md:px-10">
        {highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          >
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:px-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white">Reference Snippet</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">
            Minimal pattern for exporting metadata with a custom layout option.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200">
            <code>{`export const meta: MDXFrontmatter = {
  title: "Custom Layout TSX Demo",
  layout: "custom",
  seo: { keywords: ["tsx", "custom", "nextjs"] },
};`}</code>
          </pre>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Ready to test another custom route?
            </h2>
            <p className="mt-2 text-sm leading-6 text-cyan-100/90">
              Reuse this structure as a baseline and swap sections to verify
              visual and rendering behavior quickly.
            </p>
          </div>
          <a
            href="mailto:jay@orangec.at"
            className="inline-flex items-center rounded-lg bg-cyan-400 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300"
          >
            Contact for integration support
          </a>
        </div>
      </section>
    </main>
  );
}
