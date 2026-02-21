"use client";

import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";

export default function AboutMe() {
  const paragraphs = [
    "I help startups and teams bring their ideas to life as actual products.",
    "Through experience with various projects including SaaS platforms, data dashboards, and mobile apps, I can quickly design and develop user-friendly interfaces using React and Next.js.",
    "I value not only coding but also smooth communication, working closely with planners, designers, and backend developers to deliver valuable features.",
    "If your project requires fast execution and quality, I'm ready to collaborate.",
  ];

  return (
    <section className="py-section space-y-8">
      <div className="container-narrow">
        <h2 className="text-h2 font-serif text-center text-foreground">
          About Me
        </h2>
      </div>

      <HomeHero />

      <div className="container-narrow rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="space-y-4">
          {paragraphs.map((text) => (
            <p key={text} className="text-body leading-relaxed text-muted-foreground">
              {text}
            </p>
          ))}
        </div>
      </div>

      <TechStack />
    </section>
  );
}
