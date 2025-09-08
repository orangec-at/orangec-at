// i18n.ts (또는 src/i18n/request.ts 권장 위치)
import { getRequestConfig } from "next-intl/server";

const locales = ["ko", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale; // 비동기 추출
  if (!locale || !locales.includes(locale as any)) {
    locale = "ko"; // 최종 백업
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
