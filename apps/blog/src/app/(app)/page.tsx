import AboutMe from "@/components/home/about-me";
import ContactCTA from "@/components/home/contact-cta";
import FeaturedProjects from "@/components/home/featured-projects";
import HomeHero from "@/components/home/home-hero";
import TechStack from "@/components/home/tech-stack";

export default function HomePage() {
  return (
    <main className="px-4 py-8 md:px-16 md:py-12 space-y-16">
      <HomeHero />
      <FeaturedProjects />
      <TechStack />
      <AboutMe />
      <ContactCTA />
    </main>
  );
}
