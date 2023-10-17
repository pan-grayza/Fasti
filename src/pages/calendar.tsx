import React, { useEffect } from 'react'
import MonthCalendar from '~/components/Calendar/monthCalendar/MonthCalendar'
import YearCalendar from '~/components/Calendar/yearCalendar/YearCalendar'
import WeekCalendar from '~/components/Calendar/weekCalendar/WeekCalendar'
import DayCalendar from '~/components/Calendar/dayCalendar/DayCalendar'

import useStore from '~/store/useStore'
import { useSession } from 'next-auth/react'
import { api, type RouterOutputs } from '~/utils/api'

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

  useEffect(() => {
    if (
      sessionData &&
      currentCalendarView === 'None' &&
      calendars &&
      calendars.length > 0
    ) {
      setCurrentCalendarView('Month')
    }
  })

  return (
    <div className="relative flex h-full w-full flex-row overflow-hidden">
      <div className="relative flex h-full w-full transition">
        {currentCalendarView === 'Year' && <YearCalendar />}
        {currentCalendarView === 'Month' && <MonthCalendar />}
        {currentCalendarView === 'Week' && <WeekCalendar />}
        {currentCalendarView === 'Day' && <DayCalendar />}
      </div>
    </div>
  )
}

export default Calendar
