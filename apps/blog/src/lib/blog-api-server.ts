import { blogApiUrl } from "@/lib/blog-api";

type FetchInit = Omit<RequestInit, "headers"> & { headers?: Record<string, string> };

function internalHeaders() {
  const key = process.env.BLOG_API_INTERNAL_KEY;
  if (!key) {
    throw new Error("BLOG_API_INTERNAL_KEY is not set");
  }

  return {
    "x-internal-api-key": key,
  };
}

export async function blogApiServerFetch(path: string, init: FetchInit = {}) {
  const headers = {
    ...internalHeaders(),
    ...(init.headers ?? {}),
  };

  const res = await fetch(blogApiUrl(path), {
    ...init,
    headers,
  });

  return res;
}
