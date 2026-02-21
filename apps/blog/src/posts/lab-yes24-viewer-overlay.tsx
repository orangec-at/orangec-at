"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import { CodeBlock, ColorSwatch, LabLayout, LayerStack } from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "YES24 — eBook Viewer Overlay",
  date: "2026-02-20",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "mobile"],
  description:
    "A lab study analyzing the YES24 mobile eBook viewer overlay UI through five lenses.",
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
          {`ViewerScreen
├── StatusBar (System)
├── HeaderOverlay (Top Bar)
│   ├── BackButton (← icon)
│   ├── TitleLabel ("Self-Trust")
│   └── ActionGroup
│       ├── CommentButton (chat bubble)
│       ├── SearchButton (magnifying glass)
│       └── BookmarkButton (ribbon)
├── ContentArea (Scrollable/Paginated)
│   └── RenderedText (HTML/Canvas)
└── FooterOverlay (Bottom Bar)
    ├── ProgressBar (Slider + 62%)
    └── ControlBar
        ├── TOCButton (list icon)
        ├── HighlightButton (pen icon)
        ├── SettingsButton (Aa icon)
        ├── RotationLock (lock icon)
        └── MoreButton (gear icon)`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Atomic Components
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">IconButton</span>{" "}
            &mdash; 44x44pt touch target, reused across multiple icons
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">Slider</span>{" "}
            &mdash; full-width progress indicator with thumb interaction
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">OverlayPanel</span>{" "}
            &mdash; header/footer container, toggled by `isVisible`
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
        <p className="mb-3 text-sm font-medium text-foreground">
          Key Features
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Reading Progress", detail: "62% slider" },
            { label: "Comments/Reviews", detail: "Social reading" },
            { label: "Highlights/Notes", detail: "User-generated data" },
            { label: "DRM Viewer", detail: "Content protection" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card px-3 py-2 text-center shadow-sm"
            >
              <p className="text-xs font-medium text-foreground">
                {item.label}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Value Flow
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            "Comfortable reading experience",
            "Higher completion rate",
            "Accumulated comments/notes",
            "Platform lock-in",
            "Next purchase",
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
          <ColorSwatch color="#333333" label="Body text" />
          <ColorSwatch color="#4A90D9" label="Progress bar" />
          <ColorSwatch color="#888888" label="UI icons (thin line)" />
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
                <th className="pb-2 pr-4 font-medium">Style</th>
                <th className="pb-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">Body text</td>
                <td className="py-2 pr-4">Serif</td>
                <td className="py-2">Classic book feel</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 pr-4">UI labels</td>
                <td className="py-2 pr-4">Sans-serif</td>
                <td className="py-2">Modern app interface feel</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Progress</td>
                <td className="py-2 pr-4">Sans-serif, Medium</td>
                <td className="py-2">Status information display</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Layout Spec
        </p>
        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex flex-col gap-2">
            {/* Header */}
            <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-card px-3 py-2">
              <span className="text-[10px] text-muted-foreground">&larr;</span>
              <span className="text-xs text-muted-foreground">Title</span>
              <span className="flex gap-1.5">
                {["chat", "search", "bookmark"].map((icon) => (
                  <span
                    key={icon}
                    className="inline-flex h-5 w-5 items-center justify-center rounded border border-dashed border-border text-[8px] text-muted-foreground"
                  >
                    {icon[0]}
                  </span>
                ))}
              </span>
            </div>
            {/* Content */}
            <div className="flex aspect-[3/4] items-center justify-center rounded-md border border-dashed border-border bg-card text-xs text-muted-foreground">
              Content Area
            </div>
            {/* Footer */}
            <div className="space-y-1 rounded-md border border-dashed border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 rounded-full bg-blue-400/40">
                  <div className="h-1 w-3/5 rounded-full bg-blue-500" />
                </div>
                <span className="text-[10px] text-muted-foreground">62%</span>
              </div>
              <div className="flex justify-between">
                {["TOC", "pen", "Aa", "lock", "gear"].map((icon) => (
                  <span
                    key={icon}
                    className="text-[9px] text-muted-foreground"
                  >
                    {icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Header 44-56pt</span>
            <span>Footer 2-row</span>
            <span>Generous side margins</span>
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
        <p className="mb-3 text-sm font-medium text-foreground">
          Interaction Model
        </p>
        <div className="space-y-3">
          {[
            {
              gesture: "Center tap on screen",
              result: "Toggle overlay (show/hide)",
            },
            {
              gesture: "Slider drag",
              result: "Rapid page navigation",
            },
            {
              gesture: "Horizontal swipe",
              result: "Page turn (default mode)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-3"
            >
              <p className="text-sm font-medium text-foreground">
                {item.gesture}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                &rarr; {item.result}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Mode Switching
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-foreground">
            Highlight mode (pen icon active)
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium">Default mode</span>: swipe = page turn
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Highlight mode</span>: drag = text selection
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground italic">
            The same gesture (drag) produces different outcomes by mode
          </p>
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
          Key State (Inferred)
        </p>
        <CodeBlock>
          {`interface ViewerState {
  isOverlayVisible: boolean
  currentLocation: string   // CFI or percentage
  fontSize: number
  themeMode: 'light' | 'sepia' | 'dark'
  isHighlightMode: boolean
}`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Rendering (Inferred)
        </p>
        <CodeBlock>
          {`// WebView-based ePub rendering
// ePub = HTML/CSS -> rendered in WebView
// Justified text layout + custom fonts
// Full reflow required when font size changes`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          4-Layer View Architecture
        </p>
        <LayerStack
          layers={[
            { label: "Layer 4: UI Overlay", sub: "Header + Footer (toggleable)", color: "border-blue-400 bg-blue-50 dark:bg-blue-950/30" },
            { label: "Layer 3: Touch", sub: "Gesture recognizers (tap, swipe, drag)", color: "border-amber-400 bg-amber-50 dark:bg-amber-950/30" },
            { label: "Layer 2: Content", sub: "WebView / ePub renderer", color: "border-green-400 bg-green-50 dark:bg-green-950/30" },
            { label: "Layer 1: Background", sub: "Theme color (white / sepia / dark)", color: "border-zinc-400 bg-zinc-50 dark:bg-zinc-800/30" },
          ]}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          * z-index order from top to bottom. A common pattern in canvas-based apps such as reader, map, and drawing apps.
        </p>
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
        title: "Overlay vs. content separation",
        body: "A strict split between overlay and content enables an immersive mode. The full chrome toggles through a single `isOverlayVisible` state.",
      },
      {
        title: "Header = book actions / Footer = viewer settings",
        body: "The header handles content metadata (back, search, bookmark), while the footer handles viewer controls (progress, settings). Separation of concerns is clear.",
      },
      {
        title: "IconButton reuse",
        body: "A single reusable component used with multiple icons, consistently preserving a 44x44pt touch target.",
      },
    ],
    insights: [
      {
        title: "Transient Chrome pattern",
        body: "Separate the UI chrome from the content canvas and toggle via an `isOverlayVisible` boolean. This is a core reader-app pattern that also applies to video players and map apps.",
      },
      {
        title: "Header/Footer separation of concerns",
        body: "The header owns content metadata (back, search, bookmark), while the footer owns viewer controls (progress, settings). As features grow, each zone remains clear and scalable.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "Retention strategy",
        body: "Comments connect the solitary act of reading to the platform community, increasing time in app and social stickiness.",
      },
      {
        title: "Highlights = switching cost",
        body: "As user-generated data (notes/highlights) accumulates, the cost of leaving the platform rises.",
      },
      {
        title: "Reading convenience = conversion",
        body: "A comfortable reading experience increases completion rates and drives follow-up purchases as a core funnel.",
      },
    ],
    insights: [
      {
        title: "Social Reading vs Deep Reading",
        body: "Placing the comment button in the top primary action area reflects a business decision that prioritizes participation over pure immersion. It suggests YES24 treats its social ecosystem as a key differentiator and retention metric.",
      },
      {
        title: "Lock-in by Content Creation",
        body: "Highlights and notes bind users' intellectual assets to the platform. This pattern appears across SaaS products: when users create data, switching costs rise.",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "Visual hierarchy",
        body: "Body text (priority 1) > blue slider (priority 2, status) > UI icons (priority 3, uniform weight). The hierarchy clearly favors content first.",
      },
      {
        title: "Content First, UI Second",
        body: "The UI acts as a frame around content. Thin line icons and neutral colors minimize interference.",
      },
      {
        title: "Affordance",
        body: "The slider thumb (circle) invites interaction, while standard icon metaphors reduce cognitive load.",
      },
    ],
    insights: [
      {
        title: "Content frame design",
        body: "In apps where user content is the protagonist, UI should function as a frame. A practical rule is to reserve saturated color for status signals (the blue slider).",
      },
      {
        title: "Serif/sans-serif dual typography",
        body: "Separating body text (serif) from UI text (sans-serif) creates an implicit boundary: this is the book, this is the app. It reinforces cognitive separation between content and interface.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "Control Paradox",
        body: "Users need controls, but controls disrupt reading. The solution is an on-demand overlay that appears only when needed.",
      },
      {
        title: "Mode switching prevents errors",
        body: "Explicitly separating highlight mode helps prevent accidental marking while users are trying to turn pages.",
      },
      {
        title: "Accessible settings",
        body: "Placing Aa (font), brightness, and screen lock controls in the footer minimizes reading friction.",
      },
    ],
    insights: [
      {
        title: "User Control vs Simplicity",
        body: "By hiding complex features (search, TOC, settings, highlights) behind the overlay, the viewer preserves the simplicity of a physical book while delivering digital power.",
      },
      {
        title: "Mode switching as a safety mechanism",
        body: "When the same gesture (drag) yields different outcomes by context, explicit mode switching is a key UX safety pattern.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "Reflow engine",
        body: "Changing font size requires full page recalculation. Processing this in a background thread helps prevent UI blocking.",
      },
      {
        title: "Layered view architecture",
        body: "A four-layer stack (Background -> Content -> Touch -> UI) separates concerns, allowing each layer to evolve independently.",
      },
      {
        title: "Real-time slider binding",
        body: "Bi-directional binding between slider position and scrollOffset/currentPage is essential for real-time page preview during drag.",
      },
    ],
    insights: [
      {
        title: "Reflow Logic",
        body: "Dynamic pagination is a core technical challenge in eBook readers. Unlike fixed-layout PDFs, total page count must be recalculated whenever font settings change.",
      },
      {
        title: "4-Layer View Architecture",
        body: "The layer order Background -> Content -> Touch -> UI is a general pattern not only for reader apps, but also for canvas-based apps like map and drawing tools.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabYes24ViewerOverlay() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="mobile"
      screenshots={[
        {
          src: "/images/lab/yes24-viewer-overlay/01-main.png",
          alt: "YES24 mobile eBook viewer overlay screenshot",
        },
      ]}
    />
  );
}
