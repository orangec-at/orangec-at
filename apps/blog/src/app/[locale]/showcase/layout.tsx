import { ReactNode } from "react";

interface ShowcaseLayoutProps {
  children: ReactNode;
}

export default function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  return (
    <div className="w-full h-screen overflow-hidden">
      {children}
    </div>
  );
}
