import { router } from "../trpc";
import { authRouter } from "./auth";
import { cartRouter } from "./cart";
import { categoryRouter } from "./category";
import { productRouter } from "./product";

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  auth: authRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
