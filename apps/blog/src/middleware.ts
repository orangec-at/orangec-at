// middleware.ts
import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth"; // Check if this alias works, or use relative import
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["ko", "en"],
  defaultLocale: "ko",
});

export default auth((req) => {
  // 1. If requesting dashboard/shop, enforce login
  const isProtected = /\/(dashboard|shop)/.test(req.nextUrl.pathname);
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
  
  // 2. Otherwise run intl middleware
  return intlMiddleware(req);
});

export const config = {
  // Ensure we don't match static files or API routes unless intended
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

