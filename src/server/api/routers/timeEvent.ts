import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { v4 as uuidv4 } from 'uuid'

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
        name: z.string(),
        startTime: z.date(),
        durationM: z.number(),
        calendarId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.create({
        data: {
          id: uuidv4(),
          name: input.name,
          startTime: input.startTime,
          durationM: input.durationM,
          calendarId: input.calendarId,
        },
      })
    }),
  rename: protectedProcedure
    .input(
      z.object({ id: z.string(), calendarId: z.string(), newName: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.update({
        where: {
          id: input.id,
          calendarId: input.calendarId,
        },

        data: {
          name: input.newName,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        calendarId: z.string(),
        newName: z.string(),
        newStartTime: z.date(),
        newDurationM: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.update({
        where: {
          id: input.id,
          calendarId: input.calendarId,
        },

        data: {
          name: input.newName,
          startTime: input.newStartTime,
          durationM: input.newDurationM,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), calendarId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeEvent.delete({
        where: {
          id: input.id,
          calendarId: input.calendarId,
        },
      })
    }),
})
