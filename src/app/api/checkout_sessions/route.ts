/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  //@ts-expect-error api version
  apiVersion: "2022-11-15",
});

export async function POST(req: NextRequest) {
  const transformedItems = await req.json();
  const { userId } = auth();

  const origin = req.headers.get("origin"); // Access the origin header

  if (!origin) {
    throw new Error("Origin header is missing");
  }

  try {
    // Validate the amount that was passed from the client.
    // Create Checkout Sessions from body params.
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 2000, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      line_items: transformedItems,
      mode: "payment",
      success_url: `${origin}/?status=success`,
      cancel_url: `${origin}/?status=cancel`,
      metadata: {
        clerk_user_id: userId, // Attach the Clerk user ID to metadata
      },
    };
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);

    return NextResponse.json(checkoutSession);
  } catch (err) {
    console.log(err);
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { statusCode: 500, message: errorMessage },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
