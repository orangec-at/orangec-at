import AboutClient from "./client";

export async function generateMetadata() {
  return {
    title: "About | Jaeil Lee",
    description:
      "Full-stack developer & product builder. 4.5 years shipping web, mobile, and enterprise apps.",
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
