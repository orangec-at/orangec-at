"use client";

import { MENU_ITEMS } from "@/constant/layout";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { withLocalePath } from "@/lib/locale-path";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Sliders } from "lucide-react";
import { ControlCenter } from "@/components/control-center/control-center";

interface ResponsiveHeaderProps {
  position: "top" | "bottom";
  enableScrollAnimation?: boolean;
  showSocialIcons?: boolean;
}

export default function ResponsiveHeader({
  position = "top",
  enableScrollAnimation = true,
  showSocialIcons = false,
}: ResponsiveHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const homeHref = withLocalePath(locale, "/");
  const isHomePage = pathname === homeHref;
  const isMobile = position === "bottom";

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

  const getSocialIconSize = () => (isMobile ? 20 : 20);
  const getBackButtonSize = () => (isMobile ? 20 : 18);
  const getDropdownSide = (): "top" | "bottom" =>
    position === "top" ? "bottom" : "top";

  return (
    <>
      {/* Header Container */}
      <div
        className={`fixed ${
          !isMobile ? "top-0" : "bottom-0"
        } left-0 right-0 z-50 ${!isMobile ? "hidden md:flex" : "md:hidden"} ${
          !isMobile ? "justify-center mt-4" : "mb-4 mx-4"
        }`}
      >
        {!isMobile ? (
          <div className="flex items-center gap-2">
            {/* Desktop Main Header Group */}
            <header
              className={`flex items-center transition-all duration-300 ease-out rounded-full px-3 py-2 border bg-background/80 backdrop-blur-md shadow-sm ${
                isScrolled ? "max-w-fit gap-3" : "gap-4 md:gap-6"
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
                    enableScrollAnimation
                      ? "transition-all duration-500 ease-out"
                      : ""
                  } ${isScrolled ? "text-sm" : "text-base"}`}
                >
                  {MENU_ITEMS.map((item) => {
                    const itemHref = withLocalePath(locale, item.href);
                    const isActive = pathname === itemHref;
                    return (
                      <Link
                        key={item.href}
                        href={itemHref}
                        className={`transition-all duration-200 font-medium px-3 py-3 rounded-full ${
                          isActive
                            ? "text-foreground font-semibold bg-accent"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        {t(item.translationKey)}
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
            {/* Mobile Main Group */}
            <div
              className={`flex items-center flex-1 transition-all duration-500 ease-out rounded-full justify-between ${
                isVerySmallScreen ? "px-3 py-2" : "px-4 py-3"
              } ${
                position === "bottom"
                  ? "bg-background/90 backdrop-blur-md shadow-lg border-t border"
                  : isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border"
              }`}
            >
              <div
                className={`flex items-center ${
                  isVerySmallScreen ? "gap-2" : "gap-3 md:gap-4"
                }`}
              >
                {!isHomePage && (
                  <button
                    onClick={() => window.history.back()}
                    className={`text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all duration-200 ${
                      isVerySmallScreen ? "p-1" : "p-2"
                    }`}
                  >
                    <svg
                      width={isVerySmallScreen ? 16 : getBackButtonSize()}
                      height={isVerySmallScreen ? 16 : getBackButtonSize()}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={!isMobile ? "md:w-5 md:h-5" : ""}
                    >
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                )}
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
                      !isMobile
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
                {isVerySmallScreen ? (
                  // Compact navigation for very small screens
                  <div className="flex items-center overflow-x-auto mobile-nav-container">
                    <div
                      className={`flex gap-1 min-w-max ${
                        !isMobile && enableScrollAnimation
                          ? "transition-all duration-500 ease-out"
                          : ""
                      }`}
                    >
                      {MENU_ITEMS.map((item) => {
                        const itemHref = withLocalePath(locale, item.href);
                        const isActive = pathname === itemHref;
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={itemHref}
                            className={`transition-all duration-200 font-medium px-3 py-3 rounded-full flex items-center justify-center min-w-[48px] min-h-[48px] ${
                              isActive
                                ? "text-foreground font-semibold bg-accent"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                            title={t(item.translationKey)}
                          >
                            <IconComponent className="h-5 w-5" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // Standard mobile navigation
                  <div
                    className={`flex gap-2 ${
                      !isMobile && enableScrollAnimation
                        ? "transition-all duration-500 ease-out"
                        : ""
                    } ${!isMobile && isScrolled ? "text-sm" : "text-base"}`}
                  >
                    {MENU_ITEMS.map((item) => {
                      const itemHref = withLocalePath(locale, item.href);
                      const isActive = pathname === itemHref;
                      return (
                        <Link
                          key={item.href}
                          href={itemHref}
                          className={`transition-all duration-200 font-medium px-3 py-3 rounded-full touch-target ${
                            position === "bottom" ? "text-sm" : ""
                          } ${
                            isActive
                              ? "text-foreground font-semibold bg-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {t(item.translationKey)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </nav>
            </div>

            {/* Mobile Control Center Group */}
            <div
              className={`transition-all duration-500 ease-out rounded-full ${
                isVerySmallScreen ? "px-2 py-2" : "px-3 py-3"
              } ${
                position === "bottom"
                  ? "bg-background/90 backdrop-blur-md shadow-lg border-t border"
                  : isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-lg"
                  : "bg-background/60 backdrop-blur-md shadow-lg border-t border"
              }`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center justify-center text-muted-foreground hover:text-foreground hover:scale-110 active:scale-95 transition-all duration-200 rounded-full ${
                      isVerySmallScreen ? "w-11 h-11" : "w-12 h-12"
                    }`}
                    title="Control Panel (⌘⇧C)"
                  >
                    <Sliders
                      className={`${isVerySmallScreen ? "h-5 w-5" : "h-6 w-6"}`}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="p-0 border-0 bg-transparent shadow-none"
                  side={getDropdownSide()}
                  align="center"
                  sideOffset={12}
                >
                  <ControlCenter
                    variant="inline"
                    className="bg-background/95 backdrop-blur-md shadow-lg border rounded-xl p-4"
                    onAction={(action, data) => console.log(action, data)}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
