import { type Stripe, loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  if (!stripePromise) {
    stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;
