/* eslint-disable @typescript-eslint/ban-ts-comment */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { and, gte, inArray, isNull, lte, or } from "drizzle-orm";
import { env } from "~/env";
import { db } from "~/server/db";
import { productPricings, products } from "~/server/db/schema";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  //@ts-expect-error api version
  apiVersion: "2022-11-15",
});

const checkoutInput = z.array(
  z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  }),
);

export async function POST(req: NextRequest) {
  const { userId } = auth();

  const origin = req.headers.get("origin"); // Access the origin header

  if (!origin) {
    throw new Error("Origin header is missing");
  }

  const parsed = checkoutInput.safeParse(await req.json());
  if (!parsed.success || parsed.data.length === 0) {
    return NextResponse.json(
      { statusCode: 400, message: "Invalid cart payload" },
      { status: 400 },
    );
  }

  try {
    // Derive line items from authoritative server-side pricing. The amounts are
    // never read from the request body so a client cannot alter what is charged.
    const now = new Date();
    const productRecords = await db.query.products.findMany({
      where: inArray(
        products.id,
        parsed.data.map((item) => item.id),
      ),
      with: {
        pricing: {
          where: and(
            or(
              isNull(productPricings.startDate),
              lte(productPricings.startDate, now),
            ),
            or(
              isNull(productPricings.endDate),
              gte(productPricings.endDate, now),
            ),
          ),
          orderBy: (productPricings, { desc }) => [
            desc(productPricings.startDate),
          ],
          limit: 1,
        },
      },
    });

    const line_items = parsed.data.map((item) => {
      const product = productRecords.find((record) => record.id === item.id);
      const price = product?.pricing?.[0]?.price;
      if (!product || price === null || price === undefined) {
        throw new Error("Invalid product in cart");
      }

      return {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(price) * 100),
          product_data: {
            name: product.title ?? "Product",
            description: product.description ?? undefined,
          },
        },
        quantity: item.quantity,
      };
    });

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
      line_items,
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
