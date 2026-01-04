import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }

  stripeClient = new Stripe(secretKey, {
    appInfo: {
      name: "OrangeC Archives Blog",
      version: "0.1.0",
    },
  });

  return stripeClient;
}
