import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const categoryRouter = router({
  getOneCategory: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    const name = input;
    return ctx.prisma.category.findMany({
      where: { name },
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
