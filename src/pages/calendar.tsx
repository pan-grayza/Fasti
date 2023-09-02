import React, { useEffect, useState } from 'react'
import MonthCalendar from '~/components/Calendar/monthCalendar/MonthCalendar'
import YearCalendar from '~/components/Calendar/yearCalendar/YearCalendar'
import WeekCalendar from '~/components/Calendar/weekCalendar/WeekCalendar'
import DayCalendar from '~/components/Calendar/dayCalendar/DayCalendar'
import Sidebar from '~/components/Sidebar/Sidebar'

import useStore from '~/store/useStore'
import { useSession } from 'next-auth/react'
import { api, type RouterOutputs } from '~/utils/api'
import clsx from 'clsx'

type Calendar = RouterOutputs['calendar']['getAll'][0]

// const Calendar = ({
//   session,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const Calendar = () => {
  const [
    currentCalendarView,
    setCurrentCalendarView,
    selectedCalendar,
    setSelectedCalendar,
    sidebar,
  ] = useStore((state) => [
    state.currentCalendarView,
    state.setCurrentCalendarView,
    state.selectedCalendar,
    state.setSelectedCalendar,
    state.sidebar,
  ])

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
  }, [calendars, createCalendar, sessionData]) /*It needs to be like that*/

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

  console.log('dayEvents: ', dayEvents)

  // const { data: timeEvents, refetch: refetchTimeEvents } =
  //   api.timeEvent.getAll.useQuery(
  //     {
  //       calendarId: selectedCalendar?.id ?? '',
  //     },
  //     {
  //       enabled: sessionData?.user !== undefined && selectedCalendar !== null,
  //     }
  //   )

  return (
    <div className="relative flex h-full w-full flex-row overflow-hidden">
      <Sidebar />
      <div className={clsx('relative flex h-full w-full')}>
        {currentCalendarView === 'Year' && <YearCalendar />}
        {currentCalendarView === 'Month' && (
          <MonthCalendar
            dayEvents={dayEvents}
            refetchDayEvents={refetchDayEvents}
          />
        )}
        {currentCalendarView === 'Week' && (
          <WeekCalendar dayEvents={dayEvents} />
        )}
        {currentCalendarView === 'Day' && <DayCalendar dayEvents={dayEvents} />}
      </div>
    </div>
  )
}

export default Calendar
