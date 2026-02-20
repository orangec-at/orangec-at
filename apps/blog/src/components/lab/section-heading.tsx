import type React from "react";

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-lg font-semibold text-foreground">{children}</h3>;
}
