"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import {
  CodeBlock,
  ColorSwatch,
  LabLayout,
  StateMachineFlow,
} from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "YES24 — Bookshelf Grid",
  date: "2026-02-19",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "mobile"],
  description:
    "Research log analyzing the YES24 mobile bookshelf grid view through five lenses: component, business logic, design, UX, and tech.",
  author: "Jaeil Lee",
  category: "lab",
  layout: "custom",
  relatedProjects: [],
  featured: false,
  draft: false,
};

/* ------------------------------------------------------------------ */
/*  Lens: Component                                                    */
/* ------------------------------------------------------------------ */

function ComponentObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Component Tree
        </p>
        <CodeBlock>
          {`BookshelfScreen
├── ScreenHeader (Title + IconButton[])
├── TabNavigation (3 tabs, active underline)
├── ListToolbar (count + viewToggle + filter + edit)
├── BookGrid (3-column)
│   └── BookCard
│       ├── CoverImage
│       ├── DownloadOverlay? (conditional)
│       ├── StackBadge? (conditional)
│       └── StatusFooter (OwnershipBadge | SubscriptionBadge)
└── BottomTabBar (3 tabs)`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          BookCard Props Interface
        </p>
        <CodeBlock>
          {`interface BookCardProps {
  coverUrl: string
  ownership: 'owned' | 'subscription'
  subscriptionDaysLeft?: number
  isDownloaded: boolean
  stackCount?: number
  onPress: () => void
}`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Conditional Rendering Patterns
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">boolean</span>{" "}
            &mdash; DownloadOverlay (isDownloaded)
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">optional number</span>{" "}
            &mdash; StackBadge (stackCount?)
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">union</span>{" "}
            &mdash; OwnershipBadge | SubscriptionBadge (ownership)
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Business Logic                                               */
/* ------------------------------------------------------------------ */

function BusinessObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Domain Entities
        </p>
        <CodeBlock>
          {`Book {
  id, title, coverUrl
  ownership: Owned | Subscription
  downloadStatus
  seriesInfo
  bookshelf
}

Bookshelf { id, type, name, books }

User { ownedBooks, subscriptionBooks, bookshelves }`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ownership State Machine
        </p>
        <StateMachineFlow
          states={[
            ["Unowned", "Purchase", "Owned"],
            ["Unowned", "Subscribe", "Subscribed", "Expired", "Resubscribe"],
            ["Subscribed", "Purchase", "Owned"],
          ]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Download State Machine
        </p>
        <StateMachineFlow
          states={[["Not Downloaded", "Downloading", "Downloaded", "Delete", "Not Downloaded"]]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Data Flow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Enter Bookshelf",
            "API GET /bookshelf/{type}",
            "Book[] + ownership + downloadStatus",
            "Client calculates daysLeft",
            "Conditional render paths",
          ].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                {step}
              </span>
              {i < 4 && (
                <span className="text-sm text-muted-foreground">&rarr;</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Design                                                       */
/* ------------------------------------------------------------------ */

function DesignObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Color Palette
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ColorSwatch color="#FFFFFF" label="Background" />
          <ColorSwatch color="#F5F5F5" label="Header Background" />
          <ColorSwatch color="#000000" label="Active Tab" />
          <ColorSwatch color="#999999" label="Inactive Tab" />
          <ColorSwatch color="#666666" label="Owned Text" />
          <ColorSwatch color="#4CAF50" label="sam Badge" />
          <ColorSwatch color="rgba(0,0,0,0.3)" label="Download Overlay" />
          <ColorSwatch color="#E0E0E0" label="Button Border" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Typography Spec
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Element</th>
                <th className="pb-2 pr-4 font-medium">Weight</th>
                <th className="pb-2 font-medium">Size</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Bookshelf Header</td>
                <td className="py-2 pr-4">Bold</td>
                <td className="py-2">18-20px</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Tab Label</td>
                <td className="py-2 pr-4">Medium</td>
                <td className="py-2">14-15px</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Count</td>
                <td className="py-2 pr-4">Regular</td>
                <td className="py-2">13px</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Badge</td>
                <td className="py-2 pr-4">Regular / Bold</td>
                <td className="py-2">11-12px</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Grid Layout Spec
        </p>
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex aspect-[1/1.4] items-center justify-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground"
              >
                1:1.4
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>3-column</span>
            <span>~8px col gap</span>
            <span>~12px row gap</span>
            <span>~16px padding</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: UX                                                           */
/* ------------------------------------------------------------------ */

function UxObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">User Flow</p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Open app",
            'Bottom tab "Bookshelf"',
            "Default shelf",
            "Scroll and browse",
          ].map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
                {step}
              </span>
              {i < 3 && (
                <span className="text-sm text-muted-foreground">&rarr;</span>
              )}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 pl-4">
          {["Tap book (Read)", "Download", "Filter", "Edit"].map((action) => (
            <span
              key={action}
              className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground"
            >
              {action}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Nudge Analysis
        </p>
        <div className="space-y-3">
          {[
            {
              nudge: 'Days-left display ("sam 163 days left")',
              mechanism: "Time constraint",
              goal: "Encourage reading",
            },
            {
              nudge: "Download overlay",
              mechanism: "Visual barrier",
              goal: "Drive downloads",
            },
            {
              nudge: "Default shelf as the default tab",
              mechanism: "Creates a rich-library impression",
              goal: "Build satisfaction",
            },
            {
              nudge: "10-book count",
              mechanism: "Makes collection size visible",
              goal: "Trigger collecting motivation",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30"
            >
              <p className="text-sm font-medium text-foreground">
                {item.nudge}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium">{item.mechanism}</span>
                {" "}
                &rarr; {item.goal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens: Tech                                                         */
/* ------------------------------------------------------------------ */

function TechObserve() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          API Structure (Inferred)
        </p>
        <CodeBlock>
          {`GET /api/bookshelf?type=default&page=1&size=20
{
  totalCount: 10,
  books: [{
    id: "book_123",
    coverUrl: "https://cdn.yes24.com/...",
    ownership: {
      type: "owned" | "subscription",
      provider?: "sam",
      expiresAt?: "..."
    },
    downloadStatus: "downloaded" | "not_downloaded",
    series?: { id: "series_456", bookCount: 2 }
  }]
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Merge Logic
        </p>
        <CodeBlock>
          {`function mergeBookData(serverBook, localStore) {
  const localData = localStore.find(
    l => l.bookId === serverBook.id
  )
  return {
    ...serverBook,
    isDownloaded: !!localData,
    daysLeft:
      serverBook.ownership.type === 'subscription'
        ? daysBetween(new Date(), serverBook.ownership.expiresAt)
        : undefined
  }
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          3-Tier Image Caching
        </p>
        <div className="flex items-center gap-3">
          {[
            { label: "L1 Memory Cache", sub: "fastest" },
            { label: "L2 Disk Cache", sub: "persistent" },
            { label: "L3 CDN", sub: "origin" },
          ].map((tier, i) => (
            <span key={i} className="flex items-center gap-3">
              <div className="rounded-lg border border-border bg-card px-3 py-2 text-center shadow-sm">
                <p className="text-xs font-medium text-foreground">
                  {tier.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{tier.sub}</p>
              </div>
              {i < 2 && (
                <span className="text-sm text-muted-foreground">&rarr;</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lens data                                                          */
/* ------------------------------------------------------------------ */

const lenses: LensData[] = [
  {
    id: "component",
    label: "Component",
    observe: <ComponentObserve />,
    analysis: [
      {
        title: "BookCard conditional rendering design",
        body: "It separates four conditional elements into boolean, optional, and union paths, making prop intent explicit and predictable.",
      },
      {
        title: "ListToolbar as a reusable pattern",
        body: "The count + viewToggle + filter + edit composition is a transferable structure for almost any list-based screen.",
      },
      {
        title: "Discriminated union for status badges",
        body: "The footer branches into OwnershipBadge or SubscriptionBadge by ownership type, mirroring a clean discriminated-union model.",
      },
      {
        title: "Overlay layer ordering",
        body: "Information stacks in a stable sequence (CoverImage -> DownloadOverlay -> StackBadge) without z-index conflicts.",
      },
    ],
    insights: [
      {
        title: "ListToolbar pattern",
        body: "You can extract this into a universal one-line list toolbar that combines count, viewToggle, filter, and edit actions.",
      },
      {
        title: "Conditional overlay design",
        body: "Clear boolean/optional/union boundaries make props easier to reason about and significantly easier to test.",
      },
      {
        title: "Status badges with discriminated unions",
        body: "A union-driven status model secures type safety today while keeping room for future badge variants.",
      },
      {
        title: "Domain card over generic card",
        body: "When domain logic is dense, a dedicated card component stays cleaner than over-customizing a generic card.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "Complex ownership model",
        body: "Ownership state x download state yields four key combinations, resolved cleanly through independent UI layers.",
      },
      {
        title: "Business role of daysLeft",
        body: "daysLeft is not just metadata; it acts as a business driver for renewal and conversion to purchase.",
      },
      {
        title: "Domain logic behind shelf classification",
        body: "Only the third tab is grouped by device state, showing a deliberate trade-off toward user scenarios over domain purity.",
      },
      {
        title: "Filter and edit as domain actions",
        body: "Filter and edit are governance tools that reduce management complexity as the library grows.",
      },
    ],
    insights: [
      {
        title: "Layer independent state axes",
        body: "Placing ownership and download in separate visual layers makes cross-combinations legible without overwhelming the card.",
      },
      {
        title: "Computed fields as business drivers",
        body: "Server source -> client-side computation -> user behavior: computed values like daysLeft can directly shape action.",
      },
      {
        title: "Domain purity vs user scenario",
        body: "It can be better to relax strict domain purity when doing so better supports a core user scenario.",
      },
      {
        title: "When to surface batch actions",
        body: "Introduce tools like filter and edit at the point where collection scale creates real management overhead.",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "Cover-first visual design",
        body: "A restrained neutral UI frame lets book covers remain the primary visual focus of the screen.",
      },
      {
        title: "Psychological color mapping for badges",
        body: "Owned = gray (stable/completed), sam = green (active/actionable), mapping emotional cues to state.",
      },
      {
        title: "Density and whitespace balance",
        body: "Showing 6-9 books per screen while preserving breathing room balances scan speed and readability.",
      },
      {
        title: "Three-level button hierarchy",
        body: "Icon-only (primary) -> outlined + label (secondary) -> outlined + icon (toggle) creates clear visual priority.",
      },
    ],
    insights: [
      {
        title: "Color restraint in content-first UI",
        body: "Keep the frame neutral and reserve saturated colors for system-state communication only.",
      },
      {
        title: "Emotional mapping of status colors",
        body: "Gray = completed, green = active, red = warning; color semantics help users prioritize attention quickly.",
      },
      {
        title: "3-column grid + 1:1.4 ratio",
        body: "A broadly reusable mobile thumbnail pattern that works well for books, apps, and product cards alike.",
      },
      {
        title: "Three-level button hierarchy",
        body: "A practical baseline hierarchy to start from when defining button systems in a new design language.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "Time-based nudge",
        body: "Loss aversion plus perceived-value reinforcement increases engagement and reading intent.",
      },
      {
        title: "Soft barrier",
        body: 'Instead of hard blocking, it communicates "one more step" with a translucent overlay that still nudges action.',
      },
      {
        title: "Emotional strategy for the default tab",
        body: "The order favors emotional payoff over pure frequency: satisfaction -> organization -> utility.",
      },
      {
        title: "Entry cost for edit mode",
        body: "Isolating destructive actions behind an explicit mode transition lowers accidental-error risk.",
      },
    ],
    insights: [
      {
        title: "Time-based nudge pattern",
        body: "Displaying remaining time drives usage and generalizes well to subscriptions, coupons, and trial products.",
      },
      {
        title: "Soft barrier",
        body: 'A translucent layer communicates "one more step," applicable to login-gated and premium-only experiences.',
      },
      {
        title: "Emotional default-tab design",
        body: "Set the first tab to deliver the strongest positive impression, not merely the highest usage frequency.",
      },
      {
        title: "Prevent mistakes through mode separation",
        body: "Keep destructive actions in a dedicated mode, separated from everyday browsing interactions.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "Dual data-source pattern",
        body: "Merge server ownership data with local download state to produce a unified ViewModel for rendering.",
      },
      {
        title: "Image caching strategy",
        body: "A memory -> disk -> CDN cache chain secures responsive performance for image-heavy grids.",
      },
      {
        title: "Data sharing across tabs",
        body: "Client-side filtering over one dataset enables instant tab switching without repeated network fetches.",
      },
      {
        title: "Complexity of download management",
        body: "Background jobs, queues, storage limits, and state sync make download handling a distinct technical domain.",
      },
    ],
    insights: [
      {
        title: "Dual data-source merge",
        body: "Server + local -> ViewModel is a standard pattern for offline-capable applications.",
      },
      {
        title: "Three-tier image caching",
        body: "Memory -> disk -> CDN remains a practical default strategy for image-grid interfaces.",
      },
      {
        title: "Client-side filtering",
        body: "For small datasets, local filtering provides immediate tab transitions without additional server requests.",
      },
      {
        title: "Technical cost of offline features",
        body: "Download and offline capabilities are complex enough to justify separate management concerns.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabYes24BookshelfGrid() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="mobile"
      screenshots={[
        {
          src: "/images/lab/yes24-bookshelf-grid/01-main.png",
          alt: "YES24 mobile bookshelf grid view screenshot",
        },
      ]}
    />
  );
}
