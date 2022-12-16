import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.id;
  }),
  getUser: protectedProcedure.query(({ ctx }) => {
    const id = ctx.session.user.id;
    return ctx.prisma.user.findUnique({
      where: { id },
    });
  }),
});
