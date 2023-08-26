import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'

export const calendarRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.calendar.findMany({
      where: {
        hostId: ctx.session.user.id,
      },
    })
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.calendar.create({
        data: {
          calendarName: input.title,
          hostId: ctx.session.user.id,
        },
      })
    }),
})
