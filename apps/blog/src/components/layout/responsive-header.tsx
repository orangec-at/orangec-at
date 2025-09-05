"use client";

import { MENU_ITEMS } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ControlCenter } from "@/components/control-center/control-center";
import { Settings } from "lucide-react";
import { ControlCenterTrigger } from "@/components/control-center/control-center-trigger";

interface ResponsiveHeaderProps {
  position: "top" | "bottom";
  enableScrollAnimation?: boolean;
  showSocialIcons?: boolean;
}

export default function ResponsiveHeader({
  position = "top",
  enableScrollAnimation = true,
  showSocialIcons = true,
}: ResponsiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isMobile = position === "bottom";

  useEffect(() => {
    if (!enableScrollAnimation) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setIsScrolled(scrollPosition > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableScrollAnimation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        setIsControlCenterOpen(!isControlCenterOpen);
      }
      if (e.key === "Escape" && isControlCenterOpen) {
        setIsControlCenterOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isControlCenterOpen]);

  const getMainHeaderClasses = () => {
    const baseClasses =
      "flex items-center fixed left-0 right-0 z-50 transition-all duration-500 ease-out";
    const positionClasses = position === "top" ? "top-0" : "bottom-0";
    const visibilityClasses = isMobile ? "md:hidden" : "hidden md:flex";

    if (isMobile) {
      // Mobile: bottom fixed, no animation
      return `${baseClasses} ${positionClasses} ${visibilityClasses} justify-between mx-4 mb-4 px-6 py-4 bg-background/90 backdrop-blur-md shadow-lg border-t border rounded-full`;
    }

    // Desktop: top with scroll animation
    if (isScrolled) {
      return `${baseClasses} ${positionClasses} ${visibilityClasses} max-w-fit rounded-full mt-4 py-3 px-4 md:px-6 bg-background/80 backdrop-blur-md shadow-lg justify-center gap-2 ml-4`;
    } else {
      return `${baseClasses} ${positionClasses} ${visibilityClasses} max-w-fit mt-4 py-3 rounded-full px-4 md:px-6 bg-background/60 backdrop-blur-md shadow-lg border-t border justify-center gap-6 ml-4`;
    }
  };

  const getControlCenterClasses = () => {
    if (isMobile) return "hidden";

    const baseClasses = "fixed z-50 transition-all duration-500 ease-out";
    const positionClasses = position === "top" ? "top-0" : "bottom-0";

    if (isScrolled) {
      return `${baseClasses} ${positionClasses} right-4 mt-4 py-3 px-3 bg-background/80 backdrop-blur-md shadow-lg rounded-full`;
    } else {
      return `${baseClasses} ${positionClasses} right-4 mt-4 py-3 px-3 bg-background/60 backdrop-blur-md shadow-lg border-t border rounded-full`;
    }
  };

  const getIconSize = () => {
    if (isMobile) return { width: 28, height: 28 };
    return {
      width: isScrolled ? 24 : 28,
      height: isScrolled ? 24 : 28,
    };
  };

  const getSocialIconSize = () => (isMobile ? 20 : 20);
  const getBackButtonSize = () => (isMobile ? 20 : 18);

  return (
    <>
      {/* Header Container */}
      <div
        className={`fixed ${
          position === "top" ? "top-0" : "bottom-0"
        } left-0 right-0 z-50 ${
          position === "top" ? "hidden md:flex" : "md:hidden"
        } ${position === "top" ? "justify-center mt-4" : "mb-4 mx-4"}`}
      >
        {position === "top" ? (
          <div className="flex items-center gap-2">
            {/* Desktop Main Header Group */}
            <header
              className={`flex items-center transition-all duration-500 ease-out rounded-full px-4 md:px-6 py-3 ${
                isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg gap-2 max-w-fit"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border gap-6 md:w-2xl lg:w-4xl"
              }`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                {!isHomePage && (
                  <button
                    onClick={() => window.history.back()}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-all duration-200"
                  >
                    <svg
                      width={getBackButtonSize()}
                      height={getBackButtonSize()}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="md:w-5 md:h-5"
                    >
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                )}
                <Link
                  href="/"
                  className="transition-all duration-200 hover:scale-110 hover:opacity-80"
                >
                  <Image
                    src="/svgs/logo.svg"
                    alt="Home"
                    {...getIconSize()}
                    className="rounded-full md:w-8 md:h-8 transition-all duration-500 ease-out"
                  />
                </Link>
              </div>

              <nav
                className={`flex items-center gap-2 ${
                  !isScrolled ? "flex-1 justify-center" : ""
                }`}
              >
                <div
                  className={`flex gap-3 ${
                    enableScrollAnimation
                      ? "transition-all duration-500 ease-out"
                      : ""
                  } ${isScrolled ? "text-sm" : "text-base"}`}
                >
                  {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`transition-all duration-200 font-medium px-3 py-2 rounded-full ${
                          isActive
                            ? "text-foreground font-semibold bg-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {showSocialIcons && (
                <div
                  className={`flex items-center gap-3 ${
                    !isScrolled ? "ml-auto" : ""
                  }`}
                >
                  {/* X (Twitter) */}
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="Twitter"
                  >
                    <svg
                      width={getSocialIconSize()}
                      height={getSocialIconSize()}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="LinkedIn"
                  >
                    <svg
                      width={getSocialIconSize()}
                      height={getSocialIconSize()}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/* GitHub */}
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label="GitHub"
                  >
                    <svg
                      width={getSocialIconSize()}
                      height={getSocialIconSize()}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              )}
            </header>

            {/* Desktop Control Center Group */}
            <div
              className={`transition-all duration-500 ease-out rounded-full px-3 py-3 ${
                isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border"
              }`}
            >
              <button
                onClick={() => setIsControlCenterOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-full"
                title="Control Center (⌘⇧C)"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            {/* Mobile Main Group */}
            <div
              className={`flex items-center flex-1 transition-all duration-500 ease-out rounded-full px-4 py-3 justify-between ${
                position === "bottom"
                  ? "bg-background/90 backdrop-blur-md shadow-lg border-t border"
                  : isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border"
              }`}
            >
              <div className="flex items-center gap-3 md:gap-4">
                {!isHomePage && (
                  <button
                    onClick={() => window.history.back()}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-all duration-200"
                  >
                    <svg
                      width={getBackButtonSize()}
                      height={getBackButtonSize()}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={position === "top" ? "md:w-5 md:h-5" : ""}
                    >
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                )}
                <Link
                  href="/"
                  className="transition-all duration-200 hover:scale-110 hover:opacity-80"
                >
                  <Image
                    src="/svgs/logo.svg"
                    alt="Home"
                    {...getIconSize()}
                    className={`rounded-full ${
                      position === "top"
                        ? "md:w-8 md:h-8 transition-all duration-500 ease-out"
                        : ""
                    }`}
                  />
                </Link>
              </div>

              <nav
                className={`flex items-center ${
                  position === "bottom" ? "flex-1 justify-center" : ""
                }`}
              >
                <div
                  className={`flex gap-2 ${
                    position === "top" && enableScrollAnimation
                      ? "transition-all duration-500 ease-out"
                      : ""
                  } ${
                    position === "top" && isScrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`transition-all duration-200 font-medium px-3 py-2 rounded-full ${
                          position === "bottom" ? "text-sm" : ""
                        } ${
                          isActive
                            ? "text-foreground font-semibold bg-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Mobile Control Center Group */}
            <div
              className={`transition-all duration-500 ease-out rounded-full px-3 py-3 ${
                position === "bottom"
                  ? "bg-background/90 backdrop-blur-md shadow-lg border-t border"
                  : isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border"
              }`}
            >
              <button
                onClick={() => setIsControlCenterOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 rounded-full"
                title="Control Center (⌘⇧C)"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />
    </>
  );
}
