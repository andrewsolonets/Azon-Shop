import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  getAll: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.product.findMany({
      take: input,
      include: {
        Ratings: true,
      },
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
        include: {
          Ratings: true,
        },
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
  postRating: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        heading: z.string(),
        message: z.string(),
        rating: z.number(),
        username: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx?.session?.user?.id;
      const { productId, heading, message, rating } = input;
      if (userId) {
        return ctx.prisma.ratings.create({
          data: {
            product: { connect: { id: productId } },
            heading,
            message,
            rating,
            user: { connect: { id: userId } },
          },
        });
      } else {
        return ctx.prisma.ratings.create({
          data: {
            userName: input.username,
            product: { connect: { id: productId } },
            heading,
            message,
            rating,
          },
        });
      }
    }),
  getRating: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const productId = input;
    return ctx.prisma.ratings.findMany({
      where: { productId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
