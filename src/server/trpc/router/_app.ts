import { router } from "../trpc";
import { authRouter } from "./auth";
import { categoryRouter } from "./category";
import { productRouter } from "./product";

export const appRouter = router({
  product: productRouter,
  category: categoryRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
