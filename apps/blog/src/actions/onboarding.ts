"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";

type OnboardingResult = {
  success: boolean;
  message: string;
};

type ApiOnboardingResponse = {
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
  const email = session?.user?.email;

  if (!userId || !email) {
    return { success: false, message: "Login is required" };
  }

  if (!input.acceptTerms) {
    return { success: false, message: "Terms acceptance is required" };
  }

  const res = await blogApiServerFetch("/api/onboarding/complete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      email,
      accept_terms: input.acceptTerms,
      newsletter_opt_in: input.newsletterOptIn,
    }),
  });

  const data = (await res.json()) as ApiOnboardingResponse;

  if (!res.ok || !data.success) {
    return { success: false, message: data?.message ?? "Failed to complete onboarding" };
  }

  return { success: true, message: data.message };
}
