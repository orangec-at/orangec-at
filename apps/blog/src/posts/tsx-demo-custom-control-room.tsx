import type { MDXFrontmatter } from "@/types/frontmatter";
import Link from "next/link";

export const meta: MDXFrontmatter = {
  title: "Custom Layout Test: Control Room Dashboard",
  description:
    "A second full-page TSX test route with a dashboard-style visual language for custom layout validation.",
  date: "2026-02-14",
  tags: ["TSX", "Custom Layout", "Dashboard", "Test"],
  category: "technical",
  author: "Jaeil Lee",
  relatedProjects: [],
  featured: false,
  draft: false,
  layout: "custom",
  seo: {
    keywords: [
      "control room dashboard",
      "custom tsx layout test",
      "nextjs full page route",
      "technical blog rendering",
    ],
  },
};

const metrics = [
  {
    label: "System Health",
    value: "99.92%",
    change: "+0.21%",
    tone: "text-emerald-300",
  },
  {
    label: "Active Streams",
    value: "18",
    change: "+3",
    tone: "text-sky-300",
  },
  {
    label: "Pending Alerts",
    value: "07",
    change: "-2",
    tone: "text-amber-300",
  },
  {
    label: "Ops Throughput",
    value: "142/h",
    change: "+11%",
    tone: "text-fuchsia-300",
  },
] as const;

const timelineEvents = [
  {
    time: "09:10",
    event: "Shift handoff complete",
    detail: "Night queue archived and cleared.",
  },
  {
    time: "09:28",
    event: "Sensor cluster calibrated",
    detail: "Latency variance normalized.",
  },
  {
    time: "10:02",
    event: "Payload scan approved",
    detail: "No anomalies detected.",
  },
  {
    time: "10:31",
    event: "Dispatch batch started",
    detail: "North zone route locked.",
  },
] as const;

const queueRows = [
  {
    id: "AQ-231",
    task: "Verify camera ring",
    owner: "Mina",
    eta: "04m",
    priority: "High",
  },
  {
    id: "AQ-232",
    task: "Refresh edge cache",
    owner: "Noah",
    eta: "09m",
    priority: "Med",
  },
  {
    id: "AQ-233",
    task: "Approve drone lane",
    owner: "Iris",
    eta: "13m",
    priority: "High",
  },
  {
    id: "AQ-234",
    task: "Issue health digest",
    owner: "Joon",
    eta: "18m",
    priority: "Low",
  },
] as const;

export default function Post() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <section className="rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.45)] md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Control Room Live
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="rounded-md bg-slate-800 px-2 py-1">Zone A Stable</span>
              <span className="rounded-md bg-slate-800 px-2 py-1">Queue Load 67%</span>
              <span className="rounded-md bg-slate-800 px-2 py-1">Sync 11:42:08 UTC</span>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
              <p className={`mt-2 text-sm font-medium ${item.tone}`}>
                {item.change} from baseline
              </p>
            </article>
          ))}
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_2fr]">
          <aside className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 md:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
              Timeline Rail
            </h2>
            <ol className="mt-4 space-y-4 border-l border-slate-700 pl-4">
              {timelineEvents.map((entry) => (
                <li key={entry.time + entry.event} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-xs font-semibold tracking-wide text-cyan-300">{entry.time}</p>
                  <p className="mt-1 text-sm font-medium text-slate-100">{entry.event}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{entry.detail}</p>
                </li>
              ))}
            </ol>
          </aside>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 md:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
                Action Queue
              </h2>
              <div className="mt-4 overflow-x-auto">
                <div className="min-w-[620px] rounded-xl border border-slate-700">
                  <div className="grid grid-cols-5 bg-slate-800/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                    <span>Task ID</span>
                    <span>Action</span>
                    <span>Owner</span>
                    <span>ETA</span>
                    <span>Priority</span>
                  </div>
                  {queueRows.map((row) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-5 border-t border-slate-700 px-3 py-2 text-sm text-slate-200"
                    >
                      <span className="font-mono text-xs text-slate-300">{row.id}</span>
                      <span>{row.task}</span>
                      <span>{row.owner}</span>
                      <span>{row.eta}</span>
                      <span>{row.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-4 md:p-5">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              <p className="mt-2 text-sm text-cyan-100/90">
                Trigger common control-room tasks during custom route validation.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/en/blog"
                  className="inline-flex items-center justify-center rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-cyan-200"
                >
                  Open Test Feed
                </Link>
                <a
                  href="mailto:jay@orangec.at"
                  className="inline-flex items-center justify-center rounded-lg border border-cyan-200/70 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/10"
                >
                  Notify Operations
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
