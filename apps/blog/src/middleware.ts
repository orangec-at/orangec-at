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
  const locale = getLocaleFromPathname(pathname);
  const onboardingPath = locale === "en" ? "/en/onboarding" : "/onboarding";

  const isOnboardingRoute = /\/(en\/)?onboarding(\/|$)/.test(pathname);

  if (!req.auth && isOnboardingRoute) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  const isProtected = /\/(dashboard|shop)/.test(pathname);
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (req.auth && !req.auth.user?.onboardingCompleted && !isOnboardingRoute) {
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

