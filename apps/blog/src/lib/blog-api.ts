export function getBlogApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BLOG_API_URL ||
    process.env.BLOG_API_URL ||
    "http://localhost:8080"
  );
}

export function blogApiUrl(path: string) {
  const base = getBlogApiBaseUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
