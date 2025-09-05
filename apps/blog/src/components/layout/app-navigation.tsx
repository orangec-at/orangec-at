"use client";

import { ReactNode } from "react";
import ResponsiveHeader from "./responsive-header";
import Footer from "./footer";
import { ControlCenterTrigger } from "@/components/control-center/control-center-trigger";

interface AppNavigationProps {
  children: ReactNode;
}

export default function AppNavigation({ children }: AppNavigationProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <div className="flex items-center gap-4">
        <ResponsiveHeader
          position="top"
          enableScrollAnimation={true}
          showSocialIcons={true}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 pt-4 pb-20 md:pt-24 md:pb-0">{children}</main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <ResponsiveHeader
          position="bottom"
          enableScrollAnimation={false}
          showSocialIcons={false}
        />
      </div>
    </div>
  );
}
