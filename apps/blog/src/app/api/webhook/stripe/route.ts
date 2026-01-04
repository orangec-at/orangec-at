import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;

    if (userId && productId) {
      try {
        await prisma.order.create({
          data: {
            userId,
            productId,
            status: "COMPLETED",
          },
        });

        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { category: true }
        });

        if (product?.category === "membership") {
          await prisma.user.update({
            where: { id: userId },
            data: { role: "ADMIN" } 
          });
        }
      } catch (error) {
        console.error("Failed to process order in webhook:", error);
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
