import React from 'react'
import MonthCalendar from './monthCalendar/MonthCalendar'
import YearCalendar from './yearCalendar/YearCalendar'
import useStore from '~/store/useStore'
import WeekCalendar from './weekCalendar/WeekCalendar'
import DayCalendar from './dayCalendar/DayCalendar'

const Calendar = () => {
  const [currentCalendarView] = useStore((state) => [state.currentCalendarView])
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
