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
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      <ResponsiveHeader position="top" />
      <main className="flex-1 w-full">{children}</main>
      <ResponsiveHeader position="bottom" />
      <Footer />
    </div>
  );
}
