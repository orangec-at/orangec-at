// i18n.ts (또는 src/i18n/request.ts 권장 위치)
import { getRequestConfig } from "next-intl/server";

const locales = ["ko", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = "ko";
  }

  // 네임스페이스별 파일 로드 후 병합
  const namespaces = [
    "common",
    "home", 
    "blog",
    "projects",
    "contact",
    "resume",
    "controlCenter",
  ];

  const messages: Record<string, unknown> = {};

  for (const ns of namespaces) {
    try {
      const nsMessages = (await import(`../messages/${locale}/${ns}.json`)).default;
      Object.assign(messages, nsMessages);
    } catch {
      // 파일이 없으면 무시
    }
  }

  return {
    locale,
    messages,
  };
})
