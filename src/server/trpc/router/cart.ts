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
  increaseQuantity: protectedProcedure
    .input(
      z.object({
        item: z.object({ id: z.string(), quantity: z.number() }),
        quantity: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { item } = input;
      const { id } = item;
      return ctx.prisma.cartItem.update({
        where: { id },
        data: {
          quantity: item.quantity,
        },
      });
    }),
  addNewItem: protectedProcedure
    .input(
      z.object({ item: z.object({ id: z.string() }), quantity: z.number() })
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { item, quantity } = input;
      const { id } = item;

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
