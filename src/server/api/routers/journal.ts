import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const journalRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.journal.findMany({
      where: {
        hostId: ctx.session.user.id,
      },
    })
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.journal.create({
        data: {
          name: input.name,
          hostId: ctx.session.user.id,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        hostId: z.string(),
        newName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.journal.update({
        where: {
          id: input.id,
          hostId: input.hostId,
        },

        data: {
          name: input.newName,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))

    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.journal.delete({
        where: {
          id: input.id,
          hostId: ctx.session.user.id,
        },
      })
    }),
})
