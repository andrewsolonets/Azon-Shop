import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { productPricings } from "~/server/db/schema";
import { and, gte, isNull, lte, or } from "drizzle-orm";

export const productRouter = createTRPCRouter({
  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().nullish(),
        skip: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const now = new Date();
      const items = await ctx.db.query.products.findMany({
        where: (products, { gt }) =>
          cursor ? gt(products.id, cursor) : undefined,
        orderBy: (products, { asc }) => asc(products.id),
        limit: limit + 1,
        offset: skip,
        with: {
          reviews: {
            orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
          },
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
            limit: 1, // Select only one pricing
          },
        },
      });

      const formatted = items?.map((product) => {
        return {
          ...product,
          pricing: product?.pricing?.[0] ?? null, // Extract the first element or use null
        };
      });
      // console.log(formatted);

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items: formatted,
        nextCursor,
      };
    }),
});
