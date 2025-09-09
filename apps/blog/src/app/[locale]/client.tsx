"use client";

import AboutMe from "@/components/home/about-me";
import ContactCTA from "@/components/home/contact-cta";
import FeaturedProjects from "@/components/home/featured-projects";
import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";

export default function HomeClient() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Featured Projects */}
      <FeaturedProjects />

      {/* 3. Tech Stack */}
      <TechStack />

      {/* 4. About Me */}
      <AboutMe />

      {/* 5. Contact CTA */}
      <ContactCTA />
    </div>
  );
}
