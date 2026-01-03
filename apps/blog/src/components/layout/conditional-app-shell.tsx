"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment, usePathname } from "next/navigation";
import AppNavigation from "./app-navigation";
import ArchivesNavigation from "./archives-navigation";
import { ChatWidget } from "@/components/rag/chat-widget";

type ConditionalAppShellProps = {
  children: ReactNode;
};

export default function ConditionalAppShell({
  children,
}: ConditionalAppShellProps) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();

  const standaloneSegments = [null, "knowledge-shelf", "about", "threads", "profile", "catalog"];
  if (standaloneSegments.includes(segment as string | null) || pathname.includes("/catalog/")) {
    return <ArchivesNavigation>{children}</ArchivesNavigation>;
  }

  return (
    <>
      <AppNavigation>{children}</AppNavigation>
      <ChatWidget />
    </>
  );
}
