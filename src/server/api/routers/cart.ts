import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { eq, sql } from "drizzle-orm";
import { cartItems, carts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

// Utility function to find or create a cart for a user
async function findOrCreateCart(userId: string) {
  const existingCart = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);

  if (existingCart.length > 0 && existingCart?.[0]) {
    return existingCart?.[0]?.id;
  }

  const newCart = await db.insert(carts).values({ userId }).returning();
  if (!newCart?.[0]) return null;

  return newCart?.[0]?.id;
}

export const cartRouter = createTRPCRouter({
  // Fetch cart items for the logged-in user
  getCartItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;

    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.userId, userId),
      with: {
        product: true,
      },
    });
    // {
    //   product: true,
    //   quantity: true,
    //   id: cartItems.id,
    //   cartId: cartItems.cartId,
    // }

    return items;
  }),

  // Fetch the user's cart
  getUserCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.userId;

    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
      with: {
        cartItems: true,
      },
    });

    return cart;
  }),

  // Increase the quantity of an item in the cart
  increaseQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { itemId, quantity } = input;

      const updatedItem = await db
        .update(cartItems)
        .set({ quantity: sql`${cartItems.quantity} + ${quantity}` })
        .where(eq(cartItems.id, itemId))
        .returning();

      return updatedItem;
    }),

  // Add a new item to the cart
  addNewItem: protectedProcedure
    .input(
      z.object({
        item: z.object({ id: z.number() }),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.userId;
      const { item, quantity } = input;
      const cartId = await findOrCreateCart(userId);
      if (!cartId) {
        return;
        // new TRPCError("Cart error");
      }
      const newCartItem = await db
        .insert(cartItems)
        .values({
          quantity,
          productId: item.id,
          cartId: cartId,
          userId,
        })
        .returning();

      return newCartItem;
    }),

  // Remove one quantity of an item in the cart
  removeOne: publicProcedure
    .input(z.object({ id: z.number(), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const updatedItem = await db
        .update(cartItems)
        .set({ quantity: sql`${cartItems.quantity} - 1` })
        .where(eq(cartItems.id, id))
        .returning();

      return updatedItem;
    }),

  // Remove an item from the cart
  removeItem: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const id = input;

      const deletedItem = await db
        .delete(cartItems)
        .where(eq(cartItems.id, id))
        .returning();

      return deletedItem;
    }),

  // Remove the entire cart for the logged-in user
  removeCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.userId;

    const deletedCart = await db
      .delete(carts)
      .where(eq(carts.userId, userId))
      .returning();

    return deletedCart;
  }),

  // Add multiple items to the cart
  addCartItems: protectedProcedure
    .input(
      z.array(
        z.object({
          product: z.object({ id: z.number() }),
          quantity: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.userId;
      const cartId = await findOrCreateCart(userId);
      if (!cartId) return;
      const data = input.map((item) => ({
        quantity: item.quantity,
        productId: item.product.id,
        cartId: cartId,
        userId,
      }));

      const addedItems = await db.insert(cartItems).values(data).returning();

      return addedItems;
    }),
});
