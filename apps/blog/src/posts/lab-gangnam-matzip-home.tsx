"use client";

import type { MDXFrontmatter } from "@/types/frontmatter";
import { LabLayout, CodeBlock, ColorSwatch, StateMachineFlow } from "@/components/lab";
import type { LensData } from "@/components/lab";

export const meta: MDXFrontmatter = {
  title: "Gangnam Matzip (Restaurant Review Platform) - Home",
  date: "2026-02-20",
  tags: ["lab", "component", "business-logic", "design", "UIUX", "web"],
  description:
    "A lab study of the Gangnam Matzip (Restaurant Review Platform) home screen through five lenses.",
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
          {`HomePage
├── Header
│   ├── UtilityBar (Help Center, Ad Inquiry, Login, Sign Up)
│   └── MainGNB
│       ├── Logo
│       ├── SearchBar ("Smart review life, conveniently without in-person visits")
│       └── NavMenu (Home, Local, Products, Press Corps, Clips, Special, ...)
├── InlineBanner ("Notice: point cancellation and refund policy update")
├── HeroBannerSection (3-column)
│   ├── PromoBanner ("Promote your store")
│   ├── CampaignBanner ("Special Campaign")
│   └── GuideBanner ("Reviewer Guide")
└── PopularCampaignSection
    ├── SectionHeader ("Popular Campaigns")
    └── CampaignGrid (n-column)
        └── CampaignCard
            ├── RankBadge (ribbon style, top-left)
            ├── Thumbnail (real-world image)
            └── TagBadge? ("Special Campaign", etc.)`}
        </CodeBlock>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Components
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            <span className="font-mono text-xs text-blue-600 dark:text-blue-400">SearchBar</span>{" "}
            &mdash; Search + value proposition hint text
          </li>
          <li>
            <span className="font-mono text-xs text-green-600 dark:text-green-400">CampaignCard</span>{" "}
            &mdash; Ranking badge + thumbnail + tags, information-dense layout
          </li>
          <li>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400">HeroBanner</span>{" "}
            &mdash; Three fixed slots (advertisers, reviewers, onboarding)
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
          Two-sided Market
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs font-semibold text-foreground">Advertisers</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Local businesses, brands</p>
            <p className="mt-1 text-[11px] text-muted-foreground">&ldquo;Promote your store&rdquo;</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs font-semibold text-foreground">Reviewers</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Bloggers, influencers</p>
            <p className="mt-1 text-[11px] text-muted-foreground">&ldquo;High-selection-probability campaigns&rdquo;</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Value Flow
        </p>
        <StateMachineFlow
          states={[
            ["Advertiser campaign listing", "Platform curation", "Reviewer application"],
            ["Reviewer selection", "Review content production", "Advertiser exposure"],
          ]}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ranking & Curation
        </p>
        <div className="space-y-2">
          {[
            { label: "Popular Campaigns", detail: "View-based ranking with top exposure" },
            { label: "Special Campaign", detail: "Premium, higher-budget campaign inventory" },
            { label: "High-selection-probability campaigns", detail: "Maximizes reviewer conversion" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            </div>
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
          <ColorSwatch color="#FF6000" label="Brand orange (accent)" />
          <ColorSwatch color="#FFFFFF" label="Background" />
          <ColorSwatch color="#F5F5F5" label="Section background (light gray)" />
          <ColorSwatch color="#333333" label="Body text" />
          <ColorSwatch color="#999999" label="Secondary text" />
          <ColorSwatch color="#E53935" label="Ranking badge (ribbon)" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Design Principles
        </p>
        <div className="space-y-2">
          {[
            { title: "Neutral base + single accent color", desc: "Vivid thumbnails lead, UI steps back" },
            { title: "Flat and clean", desc: "Minimal shadow/3D, sections divided by lines and spacing" },
            { title: "Image-dominant (70%+)", desc: "Real food photos occupy most UI surface area" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ribbon Badge
        </p>
        <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="inline-flex flex-col items-start">
              <div className="relative rounded-r-md bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
              #1
              <div className="absolute -bottom-1 left-0 border-l-[6px] border-t-[4px] border-l-transparent border-t-red-700" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Folded-corner ribbon style &mdash; adds depth to a flat card UI
            </p>
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
          2-Tier Header
        </p>
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-md border border-dashed border-border bg-card px-3 py-1.5">
              <span className="text-[10px] text-muted-foreground">Logo</span>
              <span className="flex-1 mx-3 rounded border border-dashed border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground text-center">
                Search Bar
              </span>
              <span className="text-[10px] text-muted-foreground">Help Center | Ad Inquiry | Login</span>
            </div>
            <div className="flex gap-2 rounded-md border border-dashed border-border bg-card px-3 py-1.5">
              {["Home", "Local", "Products", "Press Corps", "Clips", "Special", "High Selection Odds"].map((tab) => (
                <span key={tab} className="text-[10px] text-muted-foreground">{tab}</span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Utility bar + main GNB in a two-tier structure &mdash; exposes many categories at once
          </p>
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Multi-axis Browse
        </p>
        <div className="space-y-2">
          {[
            { axis: "Experience mode", examples: "Local (offline visit) vs Products (delivery)" },
            { axis: "Capability tier", examples: "Press Corps (premium reviewer tier) vs general campaigns" },
            { axis: "Campaign characteristic", examples: "Special, high-selection-probability, popular" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.axis}</p>
              <p className="text-[11px] text-muted-foreground">{item.examples}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Onboarding in Banner
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-foreground">
            &ldquo;Reviewer Guide&rdquo; banner
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            One of three main banners is dedicated to onboarding &mdash; reducing first-time friction and support inquiries
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
          Image Pipeline (Inferred)
        </p>
        <CodeBlock>
          {`// Optimization pipeline for a large volume of campaign thumbnails
Upload → CDN → On-the-fly Resize
  ├── WebP conversion (when browser-supported)
  ├── Lazy loading (on viewport entry)
  └── Skeleton placeholder (during loading)`}
        </CodeBlock>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Ranking Architecture (Inferred)
        </p>
        <StateMachineFlow
          states={[
            ["View/click events", "Aggregation (time window)", "Redis cache"],
            ["Redis cache", "API serving", "Client rendering"],
          ]}
        />
        <p className="mt-2 text-[11px] text-muted-foreground">
          CQRS/Cache-Aside pattern &mdash; prevents direct DB hits for high-volume public traffic
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Performance Considerations
        </p>
        <div className="space-y-2">
          {[
            { label: "FCP optimization", detail: "Skeleton UI + image lazy loading" },
            { label: "CDN Resize", detail: "Original to thumbnail on-the-fly conversion" },
            { label: "Caching strategy", detail: "Popular ranking refreshed every 10 minutes to 1 hour" },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            </div>
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
        title: "Two-tier header structure",
        body: "A utility menu plus main GNB exposes many portal-style categories at once while preserving visual hierarchy.",
      },
      {
        title: "Information-dense CampaignCard",
        body: "Ranking badges, deadline urgency, and campaign type are compacted into intuitive labels so each card carries core decision info.",
      },
    ],
    insights: [
      {
        title: "Funnel separation by banner slot",
        body: "For a platform serving multiple stakeholders, main-banner slots clearly separate key funnels: advertiser acquisition, special campaign intake, and new reviewer education.",
      },
    ],
  },
  {
    id: "business",
    label: "Business",
    observe: <BusinessObserve />,
    analysis: [
      {
        title: "Two-sided market",
        body: "An intermediary model that serves both advertisers (local businesses) and reviewers (bloggers and influencers) at the same time.",
      },
      {
        title: "Campaign ranking curation",
        body: "Differentiated exposure across Popular, Special, and high-selection-probability campaigns highlights premium inventory in top positions.",
      },
    ],
    insights: [
      {
        title: "Search hint as value proposition",
        body: "The search-bar hint communicates the product's core promise naturally to new visitors without interrupting their browsing flow.",
      },
      {
        title: "Anxiety-reducing filter",
        body: "A dedicated GNB tab for high-selection-probability campaigns reduces reviewer anxiety about getting chosen and improves conversion (CVR).",
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    observe: <DesignObserve />,
    analysis: [
      {
        title: "Applied color psychology",
        body: "Orange tones stimulate appetite and signal energy, matching the identity of a restaurant-discovery domain.",
      },
      {
        title: "Focus-guiding background",
        body: "A white and light-gray neutral background keeps visual attention on vivid campaign thumbnails.",
      },
    ],
    insights: [
      {
        title: "Neutral base + single accent color",
        body: "In thumbnail-heavy platforms, the UI frame should stay neutral while a single brand accent color provides controlled emphasis.",
      },
      {
        title: "Depth from ribbon badges",
        body: "Folded-corner ribbon ranking badges add dimensional contrast to otherwise flat card components.",
      },
    ],
  },
  {
    id: "ux",
    label: "UX",
    observe: <UxObserve />,
    analysis: [
      {
        title: "Reduced onboarding friction",
        body: "Allocating one of three hero banners to a usage guide lowers first-time barriers and support inquiries.",
      },
      {
        title: "Multi-axis browse",
        body: "Navigation combines axes like experience mode (Local/Products), capability tier (Press Corps premium reviewers), and campaign type (Special) for tailored discovery.",
      },
    ],
    insights: [
      {
        title: "Inline notice pattern",
        body: "Instead of disruptive modals, a single text line under the GNB delivers mandatory notices without breaking user flow.",
      },
    ],
  },
  {
    id: "tech",
    label: "Tech",
    observe: <TechObserve />,
    analysis: [
      {
        title: "Image optimization pipeline",
        body: "At thumbnail-heavy scale, WebP conversion plus CDN on-the-fly resize and lazy loading reduces network bottlenecks.",
      },
      {
        title: "CQRS/Cache-Aside ranking",
        body: "Popular rankings for broad public traffic are computed per time window and served from Redis to avoid direct DB pressure.",
      },
    ],
    insights: [
      {
        title: "FCP-first architecture",
        body: "In image-centric platforms, lazy loading and skeleton UI should be baked into early architecture to achieve fast First Contentful Paint.",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function LabGangnamMatzipHome() {
  return (
    <LabLayout
      meta={meta}
      lenses={lenses}
      deviceType="desktop"
      screenshots={[
        {
          src: "/images/lab/gangnam-matzip-home/01-main.png",
          alt: "Gangnam Matzip home page screenshot",
        },
      ]}
    />
  );
}
