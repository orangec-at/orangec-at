"use client";

import { ReactNode } from "react";
import ResponsiveHeader from "./responsive-header";
import Footer from "./footer";

interface AppNavigationProps {
  children: ReactNode;
}

export default function AppNavigation({ children }: AppNavigationProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header */}
      <ResponsiveHeader
        position="top"
        enableScrollAnimation={true}
        showSocialIcons={true}
      />

      {/* Main Content */}
      <main className="flex-1 pt-4 pb-20 md:pt-24 md:pb-0">{children}</main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <ResponsiveHeader
        position="bottom"
        enableScrollAnimation={false}
        showSocialIcons={false}
      />
    </div>
  );
}
