// middleware.ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["ko", "en"],
  defaultLocale: "ko",
});

export const config = {
  // 권장 패턴: /api, /trpc, /_next, /_vercel 시작 경로와 점(.) 포함 파일 제외
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  // 또는 필요시 명시 패턴: ['/', '/(ko|en)/:path*']
};
