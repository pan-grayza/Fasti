import React, { useEffect, useState } from 'react'
import MonthCalendar from '~/components/Calendar/monthCalendar/MonthCalendar'
import YearCalendar from '~/components/Calendar/yearCalendar/YearCalendar'
import WeekCalendar from '~/components/Calendar/weekCalendar/WeekCalendar'

import DayCalendar from '~/components/Calendar/dayCalendar/DayCalendar'

import useStore from '~/store/useStore'
import { useSession } from 'next-auth/react'
import { api, type RouterOutputs } from '../utils/api'

type Calendar = RouterOutputs['calendar']['getAll'][0]

// const Calendar = ({
//   session,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const Calendar = () => {
  const [currentCalendarView, setCurrentCalendarView] = useStore((state) => [
    state.currentCalendarView,
    state.setCurrentCalendarView,
  ])
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(
    null
  )

  const { data: sessionData } = useSession()
  const { data: calendars, refetch: refetchCalendars } =
    api.calendar.getAll.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedCalendar(selectedCalendar ?? data[0] ?? null)
      },
      onError: (err) => {
        console.log(err)
      },
    })
  const createCalendar = api.calendar.create.useMutation({
    onSuccess: () => {
      void refetchCalendars()
    },
  })
  useEffect(() => {
    if (sessionData && calendars && calendars.length === 0) {
      createCalendar.mutate({ title: sessionData.user.name! })
    }
  }, [calendars]) /*It needs to be like that*/

  if (
    sessionData &&
    currentCalendarView === 'None' &&
    calendars &&
    calendars.length > 0
  ) {
    setCurrentCalendarView('Month')
  }
  console.log('Calendars: ', calendars)

  const { data: dayEvents, refetch: refetchDayEvents } =
    api.dayEvent.getAll.useQuery(
      {
        calendarId: selectedCalendar?.id ?? '',
      },
      {
        enabled: sessionData?.user !== undefined && selectedCalendar !== null,
      }
    )

  const createDayEvent = api.dayEvent.create.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })

  const deleteDayEvent = api.dayEvent.delete.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  console.log('dayEvents: ', dayEvents)

  const { data: timeEvents, refetch: refetchTimeEvents } =
    api.timeEvent.getAll.useQuery(
      {
        calendarId: selectedCalendar?.id ?? '',
      },
      {
        enabled: sessionData?.user !== undefined && selectedCalendar !== null,
      }
    )

  const createTimeEvent = api.timeEvent.create.useMutation({
    onSuccess: () => {
      void refetchTimeEvents()
    },
  })

  const deleteTimeEvent = api.timeEvent.delete.useMutation({
    onSuccess: () => {
      void refetchTimeEvents()
    },
  })

  console.log('timeEvents: ', timeEvents)

  return (
    <div className="relative flex h-full w-full flex-col items-center overflow-hidden">
      {currentCalendarView === 'Year' && <YearCalendar />}
      {currentCalendarView === 'Month' && <MonthCalendar />}
      {currentCalendarView === 'Week' && <WeekCalendar />}
      {currentCalendarView === 'Day' && <DayCalendar />}
    </div>
  )
}

export default Calendar
