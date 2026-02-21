"use client";

import { MENU_ITEMS } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

interface ResponsiveHeaderProps {
  position: "top" | "bottom";
  enableScrollAnimation?: boolean;
  showSocialIcons?: boolean;
}

export default function ResponsiveHeader({
  position = "top",
  enableScrollAnimation = true,
}: ResponsiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const homeHref = "/";
  const isMobile = position === "bottom";
  const isDark = theme === "dark";
  const pillClass = "bg-surface/80 backdrop-blur-md border border-border";

  useEffect(() => {
    let handleScroll: (() => void) | null = null;

    // Handle scroll animation
    if (enableScrollAnimation) {
      let ticking = false;

      handleScroll = () => {
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
    }

    // Handle screen size detection for very small screens
    const handleResize = () => {
      setIsVerySmallScreen(window.innerWidth <= 474);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (handleScroll && enableScrollAnimation) {
        window.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [enableScrollAnimation]);

  const getIconSize = () => {
    if (isMobile) return { width: 28, height: 28 };
    return {
      width: isScrolled ? 24 : 28,
      height: isScrolled ? 24 : 28,
    };
  };

  const getNavLinkClass = (isActive: boolean) =>
    `transition-all duration-200 font-medium rounded-full ${
      isActive
        ? "text-ember-accent font-semibold bg-ember-accent-bg border border-ember-accent/20"
        : "text-muted-foreground hover:text-ember-accent hover:bg-ember-accent-bg"
    }`;

  return (
    <div
      className={`fixed ${
        !isMobile ? "top-0" : "bottom-0"
      } left-0 right-0 z-50 ${!isMobile ? "hidden md:flex" : "md:hidden"} ${
        !isMobile ? "justify-center mt-4" : "mb-4 mx-4"
      }`}
    >
      {!isMobile ? (
        <div className="flex items-center gap-2">
          <header
            className={`flex items-center transition-all duration-300 ease-out rounded-full px-3 py-2 shadow-sm ${pillClass} ${
              isScrolled ? "max-w-fit gap-3" : "gap-4 md:gap-6"
            }`}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href={homeHref}
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
                  enableScrollAnimation ? "transition-all duration-500 ease-out" : ""
                } ${isScrolled ? "text-sm" : "text-base"}`}
              >
                {MENU_ITEMS.map((item) => {
                  const itemHref = item.href;
                  const isActive = pathname === itemHref;
                  return (
                    <Link
                      key={item.href}
                      href={itemHref}
                      className={`${getNavLinkClass(isActive)} px-3 py-3`}
                    >
                      {getMenuLabel(item.translationKey)}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </header>
        </div>
      ) : (
        <div
          className={`flex items-center justify-between w-full ${
            isVerySmallScreen ? "gap-1" : "gap-2"
          }`}
        >
          <div
            className={`flex items-center flex-1 transition-all duration-500 ease-out rounded-full justify-between shadow-lg ${pillClass} ${
              isVerySmallScreen ? "px-3 py-2" : "px-4 py-3"
            }`}
          >
            <div
              className={`flex items-center ${
                isVerySmallScreen ? "gap-1" : "gap-2 md:gap-3"
              }`}
            >
              <Link
                href={homeHref}
                className="transition-all duration-200 hover:scale-110 hover:opacity-80"
              >
                <Image
                  src="/svgs/logo.svg"
                  alt="Home"
                  width={isVerySmallScreen ? 24 : getIconSize().width}
                  height={isVerySmallScreen ? 24 : getIconSize().height}
                  className={`rounded-full ${
                    !isMobile ? "md:w-8 md:h-8 transition-all duration-500 ease-out" : ""
                  }`}
                />
              </Link>
            </div>

            <nav
              className={`flex items-center ${
                position === "bottom" ? "flex-1 justify-center" : ""
              }`}
            >
              {isVerySmallScreen ? (
                <div className="flex items-center overflow-x-auto mobile-nav-container">
                  <div className="flex gap-1 min-w-max">
                    {MENU_ITEMS.map((item) => {
                      const itemHref = item.href;
                      const isActive = pathname === itemHref;
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={itemHref}
                          className={`${getNavLinkClass(isActive)} px-3 py-3 flex items-center justify-center min-w-[48px] min-h-[48px]`}
                          aria-label={getMenuLabel(item.translationKey)}
                        >
                          <IconComponent className="h-5 w-5" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 text-sm">
                  {MENU_ITEMS.map((item) => {
                    const itemHref = item.href;
                    const isActive = pathname === itemHref;
                    return (
                      <Link
                        key={item.href}
                        href={itemHref}
                        className={`${getNavLinkClass(isActive)} px-3 py-3 touch-target`}
                      >
                        {getMenuLabel(item.translationKey)}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>

          <div
            className={`transition-all duration-500 ease-out rounded-full shadow-lg ${pillClass} ${
              isVerySmallScreen ? "px-2 py-2" : "px-3 py-3"
            }`}
          >
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`flex items-center justify-center text-muted-foreground hover:text-ember-accent hover:bg-ember-accent-bg hover:scale-110 active:scale-95 transition-all duration-200 rounded-full ${
                isVerySmallScreen ? "w-11 h-11" : "w-12 h-12"
              }`}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className={isVerySmallScreen ? "h-5 w-5" : "h-6 w-6"} />
              ) : (
                <Moon className={isVerySmallScreen ? "h-5 w-5" : "h-6 w-6"} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function getMenuLabel(translationKey: string): string {
  switch (translationKey) {
    case "navigation.home":
      return "Home";
    case "navigation.projects":
      return "Projects";
    case "navigation.blog":
      return "Blog";
    case "navigation.about":
      return "About";
    case "navigation.contact":
      return "Contact";
    default:
      return "Menu";
  }
}
