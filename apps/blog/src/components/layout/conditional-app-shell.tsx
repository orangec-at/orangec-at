"use client";

import type { ReactNode } from "react";
import { KineticNavbar, KineticGadgetToolbar } from "@/components/kinetic";
import { BackgroundMusic } from "@/components/layout/background-music";

type ConditionalAppShellProps = {
  children: ReactNode;
};

export default function ConditionalAppShell({
  children,
}: ConditionalAppShellProps) {
  return (
    <BackgroundMusic>
      <div className="min-h-screen bg-[#f4f1ea] dark:bg-black">
        <KineticNavbar />
        <main className="flex-1 w-full">{children}</main>
        <KineticGadgetToolbar />
      </div>
    </BackgroundMusic>
  );
}
