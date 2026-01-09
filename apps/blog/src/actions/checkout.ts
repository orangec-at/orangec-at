"use server";

import { auth } from "@/auth";
import { blogApiServerFetch } from "@/lib/blog-api-server";

type ApiCheckoutResponse = {
  url: string | null;
  error: string | null;
};

export async function createCheckoutSession(
  productId: string,
  _priceId?: string,
  isSubscription: boolean = false
) {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    return { error: "Authentication required" };
  }

  const locale = "ko";

  const res = await blogApiServerFetch("/api/checkout/create-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user_id: session.user.id,
      email: session.user.email,
      product_id: productId,
      is_subscription: isSubscription,
      locale,
    }),
  });

  const data = (await res.json()) as ApiCheckoutResponse;

  if (!res.ok || !data.url) {
    return { error: data?.error ?? "Checkout failed" };
  }

  return { url: data.url };
}
