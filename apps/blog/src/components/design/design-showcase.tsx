"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@orangec-at/design";
import Link from "next/link";

const sections = [
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "cards", label: "Cards" },
  { id: "badges", label: "Badges" },
  { id: "forms", label: "Forms" },
  { id: "layout", label: "Layout" },
  { id: "blog", label: "Blog" },
] as const;

const colorSwatches = [
  { name: "Background", className: "bg-background", token: "bg-background" },
  { name: "Card", className: "bg-card", token: "bg-card" },
  { name: "Surface", className: "bg-surface", token: "bg-surface" },
  { name: "Accent", className: "bg-ember-accent", token: "bg-ember-accent" },
] as const;

export function DesignShowcase() {
  return (
    <main className="container-default py-section">
      <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5">
            <p className="text-micro uppercase tracking-[0.16em] text-muted-foreground">On This Page</p>
            <nav className="mt-4 flex flex-col gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-md px-2 py-1 text-small text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="space-y-16">
          <header className="space-y-4">
            <p className="text-micro uppercase tracking-[0.16em] text-muted-foreground">Ember System</p>
            <h1 className="text-display font-serif tracking-tight text-foreground">Design Showcase</h1>
            <p className="max-w-3xl text-body text-muted-foreground">
              Living docs for Ember-styled building blocks. Use this page to preview tokens and reusable UI patterns
              before shipping features.
            </p>
          </header>

          <section id="colors" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Colors</h2>
            <p className="text-small text-muted-foreground">Foundation palette used across surfaces and emphasis states.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {colorSwatches.map((swatch) => (
                <Card key={swatch.name} className="overflow-hidden border-border bg-card">
                  <CardContent className="p-0">
                    <div className={`h-20 border-b border-border ${swatch.className}`} />
                    <div className="space-y-1 p-4">
                      <p className="text-small font-medium text-foreground">{swatch.name}</p>
                      <p className="text-micro text-muted-foreground">{swatch.token}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="typography" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Typography</h2>
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <p className="text-display font-serif tracking-tight">Display / text-display</p>
              <p className="text-h2 font-serif">Heading / text-h2</p>
              <p className="text-h3">Subheading / text-h3</p>
              <p className="text-body">Body / text-body for readable content blocks.</p>
              <p className="text-small text-muted-foreground">Small / text-small with muted context.</p>
              <p className="text-micro text-muted-foreground">Micro / text-micro for utility labels.</p>
            </div>
          </section>

          <section id="buttons" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Buttons</h2>
            <div className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-6">
              <Button variant="default">Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </section>

          <section id="cards" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Cards</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-h3 text-foreground">Informational Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-small text-muted-foreground">
                    Use cards for grouped content and meaningful hierarchy inside dashboards and content pages.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-h3 text-foreground">Action Card</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-small text-muted-foreground">Pair concise copy with one primary action.</p>
                  <Button variant="primary" size="small">
                    Open Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="badges" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Badges</h2>
            <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-6">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </section>

          <section id="forms" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Forms</h2>
            <form className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-small text-muted-foreground">Name</span>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-small text-muted-foreground">Email</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
                  />
                </label>
              </div>
              <label className="block space-y-2">
                <span className="text-small text-muted-foreground">Message</span>
                <textarea
                  rows={4}
                  placeholder="Tell us what you are building"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-small text-foreground placeholder:text-muted-foreground focus:border-ember-accent focus:outline-none"
                />
              </label>
              <Button variant="primary" size="small" type="button">
                Submit
              </Button>
            </form>
          </section>

          <section id="layout" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Layout</h2>
            <p className="text-small text-muted-foreground">
              Combine `container-default` with `py-section` for predictable spacing and readable line lengths.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-small font-medium text-foreground">Sidebar Slot</p>
                <p className="mt-2 text-small text-muted-foreground">Navigation, filters, or local table of contents.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
                <p className="text-small font-medium text-foreground">Content Slot</p>
                <p className="mt-2 text-small text-muted-foreground">
                  Primary content region with dense information, long-form docs, or editorial sections.
                </p>
              </div>
            </div>
          </section>

          <section id="blog" className="scroll-mt-24 space-y-5">
            <h2 className="text-h2 font-serif text-foreground">Blog</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {["Designing with Tokens", "Shipping Better UI Docs"].map((title) => (
                <article key={title} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground">Engineering Blog</p>
                  <h3 className="mt-2 text-h3 text-foreground">{title}</h3>
                  <p className="mt-2 text-small text-muted-foreground">
                    Practical notes on scaling component systems with consistent naming, spacing, and documentation.
                  </p>
                  <Link href="/blog" className="mt-4 inline-block text-small text-muted-foreground transition-colors hover:text-foreground">
                    Read article
                  </Link>
                </article>
              ))}
            </div>
            <p className="text-small text-muted-foreground">
              Need details? Check component docs and implementation notes through the
              <Link href="/blog" className="ember-link ml-1">
                blog index
              </Link>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
