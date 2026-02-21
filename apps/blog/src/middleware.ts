import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const hasAuthenticatedUser = Boolean(req.auth?.user?.id);

  if (pathname.startsWith("/en/") || pathname.startsWith("/ko/")) {
    const stripped = pathname.replace(/^\/(en|ko)/, "") || "/";
    return NextResponse.redirect(new URL(stripped, req.url), 301);
  }
  if (pathname === "/en" || pathname === "/ko") {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  const isOnboardingRoute = /\/onboarding(\/|$)/.test(pathname);
  const isLegalRoute = /\/(terms|privacy)(\/|$)/.test(pathname);
  const isNewsletterRoute = /\/newsletter\/(confirm|unsubscribe)(\/|$)/.test(pathname);

  if (!req.auth && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  const isDashboardRoute = /\/dashboard(\/|$)/.test(pathname);
  const isShopRoute = /\/shop(\/|$)/.test(pathname);

  if ((isDashboardRoute || isShopRoute) && !req.auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (isDashboardRoute && req.auth && req.auth.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/about", req.url));
  }

  if (
    hasAuthenticatedUser &&
    req.auth?.user?.onboardingCompleted === false &&
    !isOnboardingRoute &&
    !isLegalRoute &&
    !isNewsletterRoute
  ) {
    const url = new URL("/onboarding", req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
