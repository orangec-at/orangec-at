"use server";

import { Resend } from "resend";
import { createHash, randomBytes } from "crypto";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:7071";
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false as const };
  }

  const from = process.env.NEWSLETTER_FROM ?? process.env.AUTH_EMAIL_FROM ?? "Archives <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    console.error("Newsletter email send failed:", error);
    return { ok: false as const };
  }

  return { ok: true as const };
}

export async function getNewsletterStatus(): Promise<NewsletterStatusResult | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const subscription = await prisma.newsletterSubscription.findUnique({
    where: { email: normalizeEmail(email) },
  });

  if (!subscription) {
    return {
      email: normalizeEmail(email),
      status: "UNSUBSCRIBED",
      confirmedAt: null,
      unsubscribedAt: null,
    };
  }

  return {
    email: subscription.email,
    status: subscription.status,
    confirmedAt: subscription.confirmedAt ? subscription.confirmedAt.toISOString() : null,
    unsubscribedAt: subscription.unsubscribedAt ? subscription.unsubscribedAt.toISOString() : null,
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

  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email },
  });

  if (existing?.status === "ACTIVE") {
    return { success: true, status: "ACTIVE", message: "Already subscribed" };
  }

  const sessionEmail = session?.user?.email ? normalizeEmail(session.user.email) : null;

  if (userId && sessionEmail && email === sessionEmail) {
    const now = existing?.confirmedAt ?? new Date();

    await prisma.$transaction([
      prisma.newsletterSubscription.upsert({
        where: { email },
        create: {
          email,
          status: "ACTIVE",
          userId,
          confirmedAt: now,
        },
        update: {
          status: "ACTIVE",
          userId,
          confirmedAt: now,
          unsubscribedAt: null,
          confirmTokenHash: null,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { newsletterOptInAt: now },
      }),
    ]);

    return { success: true, status: "ACTIVE", message: "Subscribed" };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: "Email delivery is not configured. Set RESEND_API_KEY to enable guest subscriptions.",
    };
  }

  const confirmToken = randomBytes(32).toString("hex");
  const unsubscribeToken = randomBytes(32).toString("hex");

  const confirmTokenHash = sha256(confirmToken);
  const unsubscribeTokenHash = sha256(unsubscribeToken);

  await prisma.newsletterSubscription.upsert({
    where: { email },
    create: {
      email,
      status: "PENDING",
      confirmTokenHash,
      unsubscribeTokenHash,
    },
    update: {
      status: "PENDING",
      confirmTokenHash,
      unsubscribeTokenHash: existing?.unsubscribeTokenHash ?? unsubscribeTokenHash,
      confirmedAt: null,
      unsubscribedAt: null,
      userId: existing?.userId ?? null,
    },
  });

  const baseUrl = getBaseUrl();
  const confirmUrl = new URL(`/${locale}/newsletter/confirm`, baseUrl);
  confirmUrl.searchParams.set("token", confirmToken);

  const unsubscribeUrl = new URL(`/${locale}/newsletter/unsubscribe`, baseUrl);
  unsubscribeUrl.searchParams.set("token", unsubscribeToken);

  const sendResult = await sendEmail({
    to: email,
    subject: "Confirm your subscription",
    html: `
      <p>Confirm your subscription to Archives.</p>
      <p><a href="${confirmUrl.toString()}">Confirm subscription</a></p>
      <hr />
      <p><a href="${unsubscribeUrl.toString()}">Unsubscribe</a></p>
    `,
  });

  if (!sendResult.ok) {
    return { success: false, message: "Failed to send confirmation email" };
  }

  return { success: true, status: "PENDING", message: "Check your email to confirm" };
}

export async function confirmNewsletterSubscription(input: {
  token: string;
}): Promise<NewsletterResult> {
  const token = input.token.trim();
  if (!token) return { success: false, message: "Missing token" };

  const tokenHash = sha256(token);

  const subscription = await prisma.newsletterSubscription.findFirst({
    where: {
      confirmTokenHash: tokenHash,
      status: "PENDING",
    },
  });

  if (!subscription) {
    return { success: false, message: "Invalid or expired token" };
  }

  const user = await prisma.user.findUnique({
    where: { email: subscription.email },
    select: { id: true },
  });

  const now = new Date();

  await prisma.$transaction([
    prisma.newsletterSubscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        confirmedAt: now,
        confirmTokenHash: null,
        unsubscribedAt: null,
        userId: user?.id ?? subscription.userId,
      },
    }),
    prisma.user.updateMany({
      where: { email: subscription.email },
      data: { newsletterOptInAt: now },
    }),
  ]);

  return { success: true, status: "ACTIVE", message: "Subscription confirmed" };
}

export async function unsubscribeNewsletter(input?: {
  token?: string;
}): Promise<NewsletterResult> {
  const session = await auth();
  const sessionEmail = session?.user?.email;

  if (input?.token) {
    const tokenHash = sha256(input.token.trim());
    const subscription = await prisma.newsletterSubscription.findFirst({
      where: { unsubscribeTokenHash: tokenHash },
    });

    if (!subscription) {
      return { success: false, message: "Invalid token" };
    }

    const now = new Date();

    await prisma.$transaction([
      prisma.newsletterSubscription.update({
        where: { id: subscription.id },
        data: {
          status: "UNSUBSCRIBED",
          unsubscribedAt: now,
          confirmTokenHash: null,
        },
      }),
      prisma.user.updateMany({
        where: { email: subscription.email },
        data: { newsletterOptInAt: null },
      }),
    ]);

    return { success: true, status: "UNSUBSCRIBED", message: "Unsubscribed" };
  }

  if (!sessionEmail) {
    return { success: false, message: "Login is required" };
  }

  const email = normalizeEmail(sessionEmail);
  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email },
  });

  if (!existing || existing.status === "UNSUBSCRIBED") {
    return { success: true, status: "UNSUBSCRIBED", message: "Already unsubscribed" };
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.newsletterSubscription.update({
      where: { email },
      data: {
        status: "UNSUBSCRIBED",
        unsubscribedAt: now,
        confirmTokenHash: null,
      },
    }),
    prisma.user.updateMany({
      where: { email },
      data: { newsletterOptInAt: null },
    }),
  ]);

  return { success: true, status: "UNSUBSCRIBED", message: "Unsubscribed" };
}
