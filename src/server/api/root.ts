import { createTRPCRouter } from "./trpc";
import { authRouter } from "./router/auth";
import { cartRouter } from "./router/cart";
import { categoryRouter } from "./router/category";
import { productRouter } from "./router/product";

export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  auth: authRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
