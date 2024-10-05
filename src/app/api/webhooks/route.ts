import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Cors from "micro-cors";
import { env } from "~/env";
import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { carts, orders } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Initialize Stripe with the secret key
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Set up CORS
// const cors = Cors({
//   methods: ["POST", "HEAD"],
//   origin: "*", // Adjust origin as necessary for your setup
// });

export async function POST(req: NextApiRequest) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature") as string;
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
    const checkoutCompleted = event.data
      .object as Stripe.CheckoutSessionCompletedEvent;
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
      if (paymentStatus === "succeeded") {
        await db.delete(carts).where(eq(carts.userId, clerkUserId));
      }
    }

    // Use clerkUserId to create an order or perform other operations
    console.log(`Order placed by Clerk user: ${clerkUserId}`);
    console.log(checkoutCompleted);
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

// const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
//   // https://github.com/stripe/stripe-node#configuration
//   apiVersion: "2022-11-15",
// });
// const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// // Stripe requires the raw body to construct the event.
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// const cors = Cors({
//   allowMethods: ["POST", "HEAD"],
// });

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const buf = await buffer(req);
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   const sig = req.headers["stripe-signature"]!;

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     // On error, log and return the error message.
//     if (err instanceof Error) console.log(err);
//     console.log(`❌ Error message: ${errorMessage}`);
//     res.status(400).send(`Webhook Error: ${errorMessage}`);
//     return;
//   }

//   // Successfully constructed event.
//   console.log("✅ Success:", event.id);

//   // Cast event data to Stripe object.
//   if (event.type === "payment_intent.succeeded") {
//     const paymentIntent = event.data.object as Stripe.PaymentIntent;
//     console.log(paymentIntent);
//     const email = paymentIntent.receipt_email;
//     const totalAmount = paymentIntent.amount;
//     const status = paymentIntent.status;
//     console.log(email);

//     if (email) {
//       // await prisma.order.create({
//       //   data: {
//       //     user: { connect: { email } },
//       //     customerNote: "hello from webhooks",
//       //     totalAmount,
//       //     status,
//       //   },
//       // });
//     }
//     if (status === "succeeded") {
//       // await prisma.cart.deleteMany({
//       //   where: {
//       //     user: { email },
//       //   },
//       // });
//     }

//     console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
//   } else if (event.type === "payment_intent.payment_failed") {
//     const paymentIntent = event.data.object as Stripe.PaymentIntent;
//     console.log(
//       `❌ Payment failed: ${paymentIntent.last_payment_error?.message}`,
//     );
//   } else if (event.type === "charge.succeeded") {
//     const charge = event.data.object as Stripe.Charge;
//     console.log(`💵 Charge id: ${charge.id}`);
//   } else {
//     console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event.
//   res.json({ received: true });
// }

// export function GET() {
//   return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
// }
