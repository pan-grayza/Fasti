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
      z.object({ name: z.string(), date: z.date(), calendarId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent.create({
        data: {
          id: '1',
          name: input.name,
          date: input.date,
          calendarId: input.calendarId,
        },
      })
    }),
  rename: protectedProcedure
    .input(
      z.object({ id: z.string(), calendarId: z.string(), newName: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent.update({
        where: {
          id: input.id,
          calendarId: input.calendarId,
        },

        data: {
          name: input.newName,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), calendarId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent.delete({
        where: {
          id: input.id,
          calendarId: input.calendarId,
        },
      })
    }),
})
