import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const cartRouter = router({
  getUserCart: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const userId = input;
    return ctx.prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: {
            id: true,
            product: true,
            quantity: true,
          },
        },
        id: true,
        userId: true,
      },
    });
  }),
  addItem: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { userId, id, quantity } = input;
      return ctx.prisma.cartItem.create({
        data: {
          quantity,
          cart: {
            connectOrCreate: {
              where: { userId },
              create: { userId, registeredUser: true },
            },
          },
          product: { connect: { id } },
        },
      });
    }),
  removeOne: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const id = input;

    return ctx.prisma.cartItem.update({
      where: { id },
      data: {
        quantity: { decrement: 1 },
      },
    });
  }),
  removeItem: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { productId, userId } = input;
      return ctx.prisma.cartItem.deleteMany({
        where: { productId, cart: { userId } },
      });
    }),
  removeCart: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const userId = input;
    return ctx.prisma.cart.delete({
      where: { userId },
    });
  }),
});
