import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const timeEventRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ calendarId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.timeEvent.findMany({
        where: {
          calendarId: input.calendarId,
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        startTime: z.date(),
        duration: z.number(),
        calendarId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.create({
        data: {
          name: input.title,
          startTime: input.startTime,
          durationM: input.duration,
          calendarId: input.calendarId,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
