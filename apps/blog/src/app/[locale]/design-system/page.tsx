"use client";

import { 
  KineticHero, 
  MarqueeSection, 
  KineticServices, 
  KineticFooter,
  KineticNavbar,
  Marquee,
  KineticPosts,
  KineticMarginalia,
} from "@/components/kinetic";
import { useState } from "react";
import type { Post, Fragment } from "@/lib/types";

const MOCK_POSTS: Post[] = [
  { id: "1", title: "Building Design Systems at Scale", slug: "design-systems", category: "Engineering", date: "2024-12-15", featured: true, content: "A deep dive into creating maintainable design systems...", locale: "en", color: "#FF4D00" },
  { id: "2", title: "The Future of Frontend Development", slug: "frontend-future", category: "Opinion", date: "2024-12-10", featured: true, content: "Where is frontend development heading in 2025?", locale: "en", color: "#FF4D00" },
];

const MOCK_FRAGMENTS: Fragment[] = [
  { id: "1", content: "React 19의 use() 훅은 게임체인저다", tags: ["#react", "#frontend"], date: "Dec 15" },
  { id: "2", content: "디자인 시스템은 제품이다, 프로젝트가 아니다", tags: ["#design", "#product"], date: "Dec 12" },
];

export default function DesignSystemPage() {
  const [highlightedTexts, setHighlightedTexts] = useState<Set<string>>(new Set());

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur border-b border-stone-800">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Kinetic Orange Design System</h1>
          <p className="text-stone-400 text-sm">Component Showcase</p>
        </div>
        <nav className="container mx-auto px-4 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
          {["Navbar", "Hero", "Marquee", "Services", "Posts", "Marginalia", "Footer"].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 bg-stone-800 rounded-full text-sm whitespace-nowrap hover:bg-[#FF4D00] hover:text-black transition-colors font-mono"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <Section id="navbar" title="KineticNavbar" code="<KineticNavbar brand='...' items={[...]} />">
          <div className="relative h-[200px] bg-[#FF4D00] overflow-hidden">
            <KineticNavbar 
              brand="Demo®"
              items={[
                { href: "#", label: "Home" },
                { href: "#", label: "Work" },
                { href: "#", label: "About" },
              ]}
            />
            <div className="flex items-center justify-center h-full pt-16">
              <p className="text-black font-mono text-lg">Floating pill navigation</p>
            </div>
          </div>
        </Section>

        <Section id="hero" title="KineticHero" code="<KineticHero title='...' location='...' role='...' />">
          <KineticHero 
            title="Orange\nCat"
            location="Seoul, Korea"
            role="Frontend Dev\nSince 2019"
          />
        </Section>

        <Section id="marquee" title="Marquee & MarqueeSection" code="<MarqueeSection line1='...' line2='...' />">
          <div className="bg-black py-4">
            <Marquee text="SINGLE LINE MARQUEE *" direction={1} className="text-[#FF4D00]" />
          </div>
          <MarqueeSection 
            line1="STRATEGY * DESIGN * CODE *"
            line2="FRONTEND * PRODUCT * AI *"
          />
        </Section>

        <Section id="services" title="KineticServices" code="<KineticServices title='...' services={[...]} />">
          <KineticServices 
            title="Skills"
            services={[
              { title: "Frontend", tags: ["React", "TypeScript", "Next.js"] },
              { title: "Design", tags: ["Figma", "Design System", "Motion"] },
            ]}
          />
        </Section>

        <Section id="posts" title="KineticPosts" code="<KineticPosts posts={[...]} onPostClick={fn} onCatalogClick={fn} />">
          <KineticPosts 
            posts={MOCK_POSTS}
            onPostClick={() => alert("Post clicked!")}
            onCatalogClick={() => alert("Catalog clicked!")}
          />
        </Section>

        <Section id="marginalia" title="KineticMarginalia" code="<KineticMarginalia snippets={[...]} onViewAll={fn} />">
          <KineticMarginalia 
            snippets={MOCK_FRAGMENTS}
            onViewAll={() => alert("View all clicked!")}
            onLike={() => {}}
            highlightedTexts={highlightedTexts}
            onHighlight={(text) => setHighlightedTexts(prev => new Set(prev).add(text))}
          />
        </Section>

        <Section id="footer" title="KineticFooter" code="<KineticFooter title='...' email='...' />">
          <KineticFooter 
            title="Contact"
            email="hello@example.com"
            copyright="2024 Demo"
            socialLinks={["GitHub", "Twitter", "LinkedIn"]}
          />
        </Section>
      </main>

      <footer className="bg-stone-900 py-8 text-center text-stone-500 font-mono text-sm">
        <p>End of Design System Showcase</p>
        <p className="mt-2 text-stone-600">8 Components • Kinetic Orange Theme • #FF4D00</p>
      </footer>
    </div>
  );
}

function Section({ 
  id, 
  title, 
  code, 
  children 
}: { 
  id: string; 
  title: string; 
  code: string; 
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="bg-stone-900 border-b border-stone-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#FF4D00]" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <code className="text-sm text-[#FF4D00] font-mono">{code}</code>
        </div>
      </div>
      <div className="overflow-hidden">
        {children}
      </div>
    </section>
  );
}
