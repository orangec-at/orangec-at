"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { withLocalePath } from "@/lib/locale-path";

export async function createCheckoutSession(productId: string, priceId?: string, isSubscription: boolean = false) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Authentication required" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const locale = "ko"; // Ideally get from current context

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      line_items: [
        {
          // In a real app, you would use priceId from Stripe dashboard
          // Here we use a placeholder or dynamic data for demo
          price_data: {
            currency: "usd",
            product_data: {
              name: productId, // Placeholder name
            },
            unit_amount: 1000, // $10.00
            recurring: isSubscription ? { interval: "month" } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? "subscription" : "payment",
      success_url: `${baseUrl}${withLocalePath(locale, "/shop?success=true")}`,
      cancel_url: `${baseUrl}${withLocalePath(locale, "/shop?canceled=true")}`,
      metadata: {
        userId: session.user.id,
        productId,
      },
    });

    return { url: checkoutSession.url };
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return { error: error.message };
  }
}
