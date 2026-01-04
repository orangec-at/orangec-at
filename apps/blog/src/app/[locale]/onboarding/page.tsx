import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { withLocalePath } from "@/lib/locale-path";

import OnboardingClient from "./client";

export default async function OnboardingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { locale } = await params;
  const { from } = await searchParams;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      onboardingCompletedAt: true,
    },
  });

  if (user?.onboardingCompletedAt) {
    const target = from && from.startsWith("/") ? from : withLocalePath(locale, "/");
    redirect(target);
  }

  return (
    <OnboardingClient
      locale={locale}
      email={user?.email ?? session.user.email ?? ""}
      from={from && from.startsWith("/") ? from : null}
    />
  );
}
