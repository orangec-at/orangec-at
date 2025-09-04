"use client";

import { ReactNode } from "react";
import MobileHeader from "./mobile/header";
import MobileBottomNav from "./mobile/bottom-navigation";
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

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
