import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const cartRouter = router({
  getCartItems: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.cartItem.findMany({
      where: { cart: { userId } },
      select: {
        product: true,
        quantity: true,
        id: true,
        cartId: true,
        cart: true,
      },
    });
  }),
  getUserCart: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.cart.findUnique({
      where: { userId },
      select: {
        items: {
          select: {
            id: true,
            product: true,
            quantity: true,
            cart: true,
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
        item: z.object({ id: z.string() }),
        quantity: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, item, quantity } = input;
      const { id } = item;
      return await prisma?.$transaction(async (tx) => {
        const item = await tx.cartItem.findFirst({
          where: { product: { id } },
        });
        if (item) {
          return await tx.cartItem.update({
            where: { id: item.id },
            data: {
              quantity: { increment: 1 },
            },
          });
        } else {
          return await ctx.prisma.cartItem.create({
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
        }
      });
    }),
  removeOne: publicProcedure
    .input(z.object({ id: z.string(), quantity: z.number() }))
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.cartItem.update({
        where: { id },
        data: {
          quantity: { decrement: 1 },
        },
      });
    }),
  removeItem: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const id = input;
    return ctx.prisma.cartItem.delete({
      where: { id },
    });
  }),
  removeCart: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    const userId = input;
    return ctx.prisma.cart.delete({
      where: { userId },
    });
  }),
});
