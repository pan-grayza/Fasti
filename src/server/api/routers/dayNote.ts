import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { v4 as uuidv4 } from 'uuid'

export const dayNoteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ journalId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.dayNote.findMany({
        where: {
          journalId: input.journalId,
        },
      })
    }),
  getAllFilteredByDate: protectedProcedure
    .input(z.object({ journalId: z.string(), date: z.date() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.dayNote.findMany({
        where: {
          journalId: input.journalId,
          date: input.date,
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        content: z.string(),
        date: z.date(),
        journalId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayNote.create({
        data: {
          name: input.name,
          content: input.content,
          date: input.date,
          journalId: input.journalId,
        },
      })
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        journalId: z.string(),
        newName: z.string(),
        newContent: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayNote.update({
        where: {
          id: input.id,
          journalId: input.journalId,
        },

        data: {
          name: input.newName,
          content: input.newContent,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), journalId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dayNote.delete({
        where: {
          id: input.id,
          journalId: input.journalId,
        },
      })
    }),
})
