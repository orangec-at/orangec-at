"use client";

import { ReactNode } from "react";
import MobileBottom from "./mobile/bottom";
import DesktopHeader from "./desktop/header";
import DesktopFooter from "./desktop/footer";

interface AppNavigationProps {
  children: ReactNode;
}

export default function AppNavigation({ children }: AppNavigationProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* Main Content */}
      <main className="flex-1 pt-4 pb-20 md:pt-24 md:pb-0">{children}</main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>

      {/* Mobile Bottom Header Navigation */}
      <div className="md:hidden">
        <MobileBottom />
      </div>
    </div>
  );
}
