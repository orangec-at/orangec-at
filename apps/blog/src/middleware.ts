// middleware.ts
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth"; // Check if this alias works, or use relative import
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["ko", "en"],
  defaultLocale: "ko",
});

function getLocaleFromPathname(pathname: string) {
  return pathname.startsWith("/en") ? "en" : "ko";
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const hasAuthenticatedUser = Boolean(req.auth?.user?.id);

  const locale = getLocaleFromPathname(pathname);
  const onboardingPath = locale === "en" ? "/en/onboarding" : "/onboarding";

  const isOnboardingRoute = /\/(en\/)?onboarding(\/|$)/.test(pathname);
  const isLegalRoute = /\/(en\/)?(terms|privacy)(\/|$)/.test(pathname);
  const isNewsletterRoute = /\/(en\/)?newsletter\/(confirm|unsubscribe)(\/|$)/.test(pathname);

  if (!req.auth && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  const isDashboardRoute = /\/dashboard(\/|$)/.test(pathname);
  const isShopRoute = /\/shop(\/|$)/.test(pathname);

  if ((isDashboardRoute || isShopRoute) && !req.auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (isDashboardRoute && req.auth && req.auth.user?.role !== "ADMIN") {
    const aboutPath = locale === "en" ? "/en/about" : "/about";
    return NextResponse.redirect(new URL(aboutPath, req.url));
  }

  if (
    hasAuthenticatedUser &&
    req.auth?.user?.onboardingCompleted === false &&
    !isOnboardingRoute &&
    !isLegalRoute &&
    !isNewsletterRoute
  ) {
    const url = new URL(onboardingPath, req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req);
});

export const config = {
  // Ensure we don't match static files or API routes unless intended
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
