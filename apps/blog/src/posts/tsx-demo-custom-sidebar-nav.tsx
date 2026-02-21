import type { MDXFrontmatter } from "@/types/frontmatter";
import Link from "next/link";

export const meta: MDXFrontmatter = {
  title: "Custom Layout Test: Sidebar Navigation Mode",
  description:
    "A custom TSX page that hides global headers and uses a built-in sidebar navigation layout.",
  date: "2026-02-14",
  tags: ["TSX", "Custom Layout", "Sidebar", "Navigation", "Test"],
  category: "technical",
  author: "Jaeil Lee",
  relatedProjects: [],
  featured: false,
  draft: false,
  layout: "custom",
  shellMode: "sidebar-nav",
  seo: {
    keywords: [
      "custom sidebar tsx",
      "header hidden mode",
      "nextjs custom blog shell",
    ],
  },
};

const sections = [
  { id: "overview", label: "Overview" },
  { id: "layout", label: "Layout Strategy" },
  { id: "checks", label: "Validation Checks" },
] as const;

export default function Post() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 md:hidden">
          <nav className="flex items-center gap-2 overflow-x-auto">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_260px]">
          <aside className="sticky top-6 hidden h-fit rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 md:block">
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-zinc-400">
              Local Sidebar
            </p>
            <nav className="space-y-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800 hover:text-cyan-200"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:p-8">
            <header id="overview" className="mb-8">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">
                Header Hidden Test
              </p>
              <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
                Sidebar Navigation Mode
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                This route verifies a custom shell mode where the global top and
                bottom headers are removed and navigation is provided inside the
                page as a local sidebar.
              </p>
            </header>

            <section id="layout" className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-white">Layout Strategy</h2>
              <ul className="space-y-2 text-sm leading-7 text-zinc-300">
                <li>- Hide global headers only for this exact slug.</li>
                <li>- Keep the shared footer so global exit path remains consistent.</li>
                <li>- Use mobile top chip nav and desktop sticky sidebar.</li>
              </ul>
            </section>

            <section id="checks">
              <h2 className="mb-3 text-xl font-semibold text-white">Validation Checks</h2>
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <div className="grid grid-cols-3 bg-zinc-800/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  <span>Check</span>
                  <span>Expected</span>
                  <span>Status</span>
                </div>
                <div className="grid grid-cols-3 border-t border-zinc-800 px-4 py-2 text-sm text-zinc-200">
                  <span>Top Header</span>
                  <span>Hidden</span>
                  <span>Pass</span>
                </div>
                <div className="grid grid-cols-3 border-t border-zinc-800 px-4 py-2 text-sm text-zinc-200">
                  <span>Bottom Header</span>
                  <span>Hidden</span>
                  <span>Pass</span>
                </div>
                <div className="grid grid-cols-3 border-t border-zinc-800 px-4 py-2 text-sm text-zinc-200">
                  <span>Local Sidebar Nav</span>
                  <span>Visible</span>
                  <span>Pass</span>
                </div>
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Utility Panel</p>
            <p className="mt-3 text-sm leading-6 text-cyan-100/90">
              This right panel simulates context tools while the left sidebar
              handles primary navigation.
            </p>
            <Link
              href="/en/blog"
              className="mt-4 inline-flex rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-200"
            >
              Back to Blog
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
