import { calendarRouter } from '~/server/api/routers/calendar'
import { dayEventRouter } from '~/server/api/routers/dayEvent'
import { timeEventRouter } from '~/server/api/routers/timeEvent'
import { journalRouter } from '~/server/api/routers/journal'
import { dayNoteRouter } from '~/server/api/routers/dayNote'
import { createTRPCRouter } from '~/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  calendar: calendarRouter,
  dayEvent: dayEventRouter,
  timeEvent: timeEventRouter,
  journal: journalRouter,
  dayNote: dayNoteRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
