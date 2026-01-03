"use client";

import { ReactNode } from "react";
import ResponsiveHeader from "./responsive-header";
import Footer from "./footer";
import ControlCenterDock from "@/components/control-center/control-center-dock";
interface AppNavigationProps {
  children: ReactNode;
}

export default function AppNavigation({ children }: AppNavigationProps) {
  return (
    <div className="min-h-screen flex flex-col muji-gallery-bg">
      {/* Desktop Header */}
      <div className="flex items-center gap-4">
        <ResponsiveHeader
          position="top"
          enableScrollAnimation={true}
          showSocialIcons={false}
        />
      </div>
      {/* Main Content */}
      <main className="flex-1 pt-4 pb-20 md:pt-24 md:pb-0 w-full min-h-screen bg-transparent">
        {children}
      </main>

      <ControlCenterDock />

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
