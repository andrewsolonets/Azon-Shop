import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAllCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: {
          orderBy: {
            createdAt: "desc",
          },
          take: 8,
          select: {
            title: true,
            description: true,
            image: true,
            price: true,
          },
        },
      },
    });
  }),
  getOneCategory: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const id = input;
    return ctx.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        products: {
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            price: true,
            quantity: true,
          },
        },
      },
    });
  }),
});
