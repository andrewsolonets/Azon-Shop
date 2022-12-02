import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  getAll: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.product.findMany({
      take: input,
    });
  }),
  getOne: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const id = input;
    return ctx.prisma.product.findUnique({
      where: { id },
    });
  }),

  getBatch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor } = input;
      const items = await ctx.prisma.product.findMany({
        take: limit + 1,
        skip: skip,
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
});
