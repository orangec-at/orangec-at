"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer";
import ResponsiveHeader from "@/components/layout/responsive-header";

type ConditionalAppShellProps = {
  children: ReactNode;
};

export default function ConditionalAppShell({
  children,
}: ConditionalAppShellProps) {
  const pathname = usePathname();
  const isBlogRoute = /^\/(ko|en)\/blog(?:\/.*)?$/.test(pathname ?? "");
  const mainContentClassName = isBlogRoute
    ? "flex-1 w-full"
    : "flex-1 w-full pt-24 md:pt-28 pb-24 md:pb-12";

  return (
    <div className="app-shell min-h-screen flex flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-small focus:text-foreground focus:ring-2 focus:ring-ember-accent"
      >
        Skip to content
      </a>
      <div data-global-header="top">
        <ResponsiveHeader position="top" />
      </div>
      <main id="main-content" className={mainContentClassName}>
        {children}
      </main>
      <div data-global-header="bottom">
        <ResponsiveHeader position="bottom" />
      </div>
      <Footer />

      <style jsx global>{`
        .app-shell:has(#main-content [data-shell-mode="sidebar-nav"]) [data-global-header="top"],
        .app-shell:has(#main-content [data-shell-mode="sidebar-nav"]) [data-global-header="bottom"] {
          display: none;
        }
      `}</style>
    </div>
  );
}
