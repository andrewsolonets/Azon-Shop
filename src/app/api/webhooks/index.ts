import { eq } from "drizzle-orm";
import { buffer } from "micro";
import Cors from "micro-cors";
import { type NextApiRequest, type NextApiResponse } from "next";

import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { carts } from "~/server/db/schema";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});
const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const sig = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id);

    // Cast event data to Stripe object.
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(paymentIntent);
      // TODO: How to use email to create order for clerk users? Should id be used instead?
      const email = paymentIntent.receipt_email;
      const totalAmount = paymentIntent.amount;
      const status = paymentIntent.status;
      console.log(email);

      if (email) {
        // await prisma.order.create({
        //   data: {
        //     user: { connect: { email } },
        //     customerNote: "hello from webhooks",
        //     totalAmount,
        //     status,
        //   },
        // });
      }
      if (status === "succeeded") {
        // await db.delete(carts).where(eq());
        // await prisma.cart.deleteMany({
        //   where: {
        //     user: { email },
        //   },
        // });
      }

      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`,
      );
    } else if (event.type === "charge.succeeded") {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default cors(webhookHandler as any);
