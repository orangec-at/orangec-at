import type { Metadata } from "next";
import HomeClient from "./client";
import { FEATURED_PROJECTS } from "@/data/projects";
import { getBlogPosts } from "@/lib/blog-utils.server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home | Jaeil Lee",
    description:
      "Explore Jaeil Lee's product engineering portfolio, recent writings, and featured projects.",
    alternates: {
      canonical: "/",
    },
  };
}

export default async function HomePage() {
  const blogPosts = await getBlogPosts();

  return (
    <HomeClient
      recentPosts={blogPosts.slice(0, 3)}
      featuredProjects={FEATURED_PROJECTS}
    />
  );
}
