import { type NextApiRequest, type NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "../../../env/server.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const transformedItems = req.body;
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
        success_url: `${req.headers.origin}/?status=success`,
        cancel_url: `${req.headers.origin}/?status=cancel`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      console.log(err);
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
