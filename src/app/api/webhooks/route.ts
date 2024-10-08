/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { buffer } from "micro";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { carts, orders } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";

// Initialize Stripe with the secret key
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  //@ts-expect-error api router
  apiVersion: "2022-11-15",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Set up CORS
// const cors = Cors({
//   methods: ["POST", "HEAD"],
//   origin: "*", // Adjust origin as necessary for your setup
// });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature"); // Access the origin header

  let event: Stripe.Event;

  try {
    // Verify the signature and construct the event
    event = stripe.webhooks.constructEvent(
      body.toString(),
      sig!,
      webhookSecret,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }
  if (event.type === "checkout.session.completed") {
    const checkoutCompleted = event.data.object;
    //@ts-expect-error type error
    const clerkUserId = checkoutCompleted.metadata.clerk_user_id;

    const paymentStatus = checkoutCompleted.payment_status;

    const totalAmount = checkoutCompleted.amount_total;
    if (typeof clerkUserId === "string") {
      await db.insert(orders).values({
        userId: clerkUserId,
        status: paymentStatus,
        totalAmount: totalAmount,
        customerNote: "hello from webhooks",
      });
      if (paymentStatus === "paid") {
        await db.delete(carts).where(eq(carts.userId, clerkUserId));
      }
    }

    // Use clerkUserId to create an order or perform other operations
    console.log(`Order placed by Clerk user: ${clerkUserId}`);
    // console.log(checkoutCompleted);
  } else if (event.type === "payment_intent.payment_failed") {
    console.log(
      `Payment failed: ${event.data.object.last_payment_error?.message}`,
    );
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  // Return success response
  return NextResponse.json({ received: true });
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
