"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";

type NewsletterStatus = "PENDING" | "ACTIVE" | "UNSUBSCRIBED";

type NewsletterResult =
  | {
      success: true;
      status: NewsletterStatus;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

type NewsletterStatusResult = {
  email: string;
  status: NewsletterStatus;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type ApiNewsletterStatus = {
  email: string;
  status: NewsletterStatus;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
};

type ApiNewsletterResponse = {
  success: boolean;
  status: NewsletterStatus;
  message: string;
};

export async function getNewsletterStatus(): Promise<NewsletterStatusResult | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const res = await blogApiServerFetch("/api/newsletter/status", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: normalizeEmail(email) }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as ApiNewsletterStatus | null;
  if (!data) return null;

  return {
    email: data.email,
    status: data.status,
    confirmedAt: data.confirmed_at,
    unsubscribedAt: data.unsubscribed_at,
  };
}

export async function subscribeNewsletter(input: {
  email?: string;
  locale?: string;
}): Promise<NewsletterResult> {
  const session = await auth();
  const userId = session?.user?.id;

  const rawEmail = input.email ?? session?.user?.email ?? "";
  const email = normalizeEmail(rawEmail);

  if (!isValidEmail(email)) {
    return { success: false, message: "Invalid email" };
  }

  const locale = input.locale === "en" ? "en" : "ko";
  const sessionEmail = session?.user?.email ? normalizeEmail(session.user.email) : null;

  if (userId && sessionEmail && email === sessionEmail) {
    const res = await blogApiServerFetch("/api/newsletter/subscribe-direct", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user_id: userId, email }),
    });

    const data = (await res.json()) as ApiNewsletterResponse;
    if (!res.ok || !data.success) {
      return { success: false, message: data?.message ?? "Failed to subscribe" };
    }

    return { success: true, status: data.status, message: data.message };
  }

  const res = await blogApiServerFetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, locale }),
  });

  if (!res.ok) {
    const message = res.status === 503
      ? "Email delivery is not configured. Set RESEND_API_KEY to enable guest subscriptions."
      : "Failed to subscribe";
    return { success: false, message };
  }

  const data = (await res.json()) as ApiNewsletterResponse;

  if (!data.success) {
    return { success: false, message: data.message };
  }

  return { success: true, status: data.status, message: data.message };
}

export async function confirmNewsletterSubscription(input: {
  token: string;
}): Promise<NewsletterResult> {
  const token = input.token.trim();
  if (!token) return { success: false, message: "Missing token" };

  const res = await blogApiServerFetch("/api/newsletter/confirm", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = (await res.json()) as ApiNewsletterResponse;

  if (!res.ok || !data.success) {
    return { success: false, message: data?.message ?? "Invalid or expired token" };
  }

  return { success: true, status: data.status, message: data.message };
}

export async function unsubscribeNewsletter(input?: {
  token?: string;
}): Promise<NewsletterResult> {
  const session = await auth();
  const sessionEmail = session?.user?.email;

  if (input?.token) {
    const res = await blogApiServerFetch("/api/newsletter/unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: input.token }),
    });

    const data = (await res.json()) as ApiNewsletterResponse;

    if (!res.ok || !data.success) {
      return { success: false, message: data?.message ?? "Invalid token" };
    }

    return { success: true, status: data.status, message: data.message };
  }

  if (!sessionEmail) {
    return { success: false, message: "Login is required" };
  }

  const email = normalizeEmail(sessionEmail);

  const res = await blogApiServerFetch("/api/newsletter/unsubscribe", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await res.json()) as ApiNewsletterResponse;

  if (!res.ok || !data.success) {
    return { success: false, message: data?.message ?? "Failed to unsubscribe" };
  }

  return { success: true, status: data.status, message: data.message };
}
