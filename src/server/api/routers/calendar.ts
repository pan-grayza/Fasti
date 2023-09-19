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
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.calendar.create({
        data: {
          calendarName: input.name,
          hostId: ctx.session.user.id,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))

    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayEvent
        .deleteMany({
          where: {
            calendarId: input.id,
          },
        })
        .then(() =>
          ctx.prisma.timeEvent.deleteMany({
            where: {
              calendarId: input.id,
            },
          })
        )
        .then(() =>
          ctx.prisma.calendar.delete({
            where: {
              id: input.id,
              hostId: ctx.session.user.id,
            },
          })
        )
    }),
})
