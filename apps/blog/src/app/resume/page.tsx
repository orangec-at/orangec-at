import type { Metadata } from "next";

import ResumeClient from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Resume | Jaeil Lee",
    description:
      "Jaeil Lee's resume covering professional experience, key projects, and technical strengths.",
    alternates: {
      canonical: "/resume",
    },
  };
}

export default function ResumePage() {
  return <ResumeClient />;
}
