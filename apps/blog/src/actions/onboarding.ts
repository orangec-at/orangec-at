"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { subscribeNewsletter } from "@/actions/newsletter";

type OnboardingResult = {
  success: boolean;
  message: string;
};

export async function completeOnboarding(input: {
  acceptTerms: boolean;
  newsletterOptIn: boolean;
  locale: string;
}): Promise<OnboardingResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Login is required" };
  }

  if (!input.acceptTerms) {
    return { success: false, message: "Terms acceptance is required" };
  }

  const now = new Date();

  await prisma.user.update({
    where: { id: userId },
    data: {
      termsAcceptedAt: now,
      onboardingCompletedAt: now,
      newsletterOptInAt: input.newsletterOptIn ? now : null,
    },
  });

  if (input.newsletterOptIn) {
    const result = await subscribeNewsletter({ locale: input.locale });
    if (!result.success) {
      return { success: true, message: "Onboarding saved. Newsletter opt-in failed." };
    }
  }

  return { success: true, message: "Onboarding completed" };
}
