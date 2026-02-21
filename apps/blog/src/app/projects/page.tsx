import type { Metadata } from "next";

import ProjectsClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Projects | Jaeil Lee",
    description:
      "A curated set of product and engineering projects with practical trade-offs and outcomes.",
    alternates: {
      canonical: "/projects",
    },
  };
}

export default function ProjectsPage() {
  return <ProjectsClient />;
}
