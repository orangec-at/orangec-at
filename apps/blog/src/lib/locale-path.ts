export const SUPPORTED_LOCALES = ["ko", "en"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizePathname(pathname: string) {
  if (!pathname) return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function stripLocalePrefix(pathname: string) {
  const normalized = normalizePathname(pathname);

  for (const locale of SUPPORTED_LOCALES) {
    const prefix = `/${locale}`;

    if (normalized === prefix) {
      return "/";
    }

    if (normalized.startsWith(`${prefix}/`)) {
      return normalized.slice(prefix.length) || "/";
    }
  }

  return normalized;
}

export function withLocalePath(locale: string, pathname: string) {
  const normalizedLocale = locale === "en" ? "en" : "ko";
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedLocale === "en") {
    if (normalizedPathname === "/") return "/en";
    return `/en${normalizedPathname}`;
  }

  return normalizedPathname;
}

export function switchLocalePath(pathname: string, newLocale: string) {
  const bare = stripLocalePrefix(pathname);
  return withLocalePath(newLocale, bare);
}
