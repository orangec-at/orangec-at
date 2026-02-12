"use client";

import type { ReactNode } from "react";
import Footer from "@/components/layout/footer";
import ResponsiveHeader from "@/components/layout/responsive-header";

type ConditionalAppShellProps = {
  children: ReactNode;
};

export default function ConditionalAppShell({
  children,
}: ConditionalAppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-small focus:text-foreground focus:ring-2 focus:ring-ember-accent"
      >
        Skip to content
      </a>
      <ResponsiveHeader position="top" />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <ResponsiveHeader position="bottom" />
      <Footer />
    </div>
  );
}
