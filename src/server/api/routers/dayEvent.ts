import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const dayEventRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ calendarId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.dayEvent.findMany({
        where: {
          calendarId: input.calendarId,
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({ title: z.string(), date: z.date(), calendarId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent.create({
        data: {
          name: input.title,
          date: input.date,
          calendarId: input.calendarId,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
