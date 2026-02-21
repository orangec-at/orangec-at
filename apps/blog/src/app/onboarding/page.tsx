import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import OnboardingClient from "./client";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
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
    const target = from && from.startsWith("/") ? from : "/";
    redirect(target);
  }

  return (
    <OnboardingClient
      email={user?.email ?? session.user.email ?? ""}
      from={from && from.startsWith("/") ? from : null}
    />
  );
}
