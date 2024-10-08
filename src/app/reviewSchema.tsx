import { z } from "zod";

export const schema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  heading: z.string().min(1, {
    message: "Heading is required.",
  }),
  message: z.string().min(1, {
    message: "Message is required.",
  }),
  rating: z.preprocess(
    (val) => Number(val),
    z.number().min(1, {
      message: "Rating must be a valid number.",
    }),
  ), // Preprocess string to number
  productId: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative({
      message: "Product ID must be a valid number.",
    }),
  ), // Preprocess string to number
});
