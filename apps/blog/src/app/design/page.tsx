import type { Metadata } from "next";

import { DesignShowcase } from "@/components/design/design-showcase";

export const metadata: Metadata = {
  title: "Design Showcase | OrangeC-AT",
  description: "Living Ember design docs for colors, typography, components, and layout patterns.",
};

export default function DesignPage() {
  return <DesignShowcase />;
}
