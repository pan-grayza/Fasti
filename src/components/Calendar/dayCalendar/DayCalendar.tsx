import React from 'react'
import Schedule from './Schedule'
import useStore from '~/store/useStore'
import DayCell from '../CalendarComponents/DayCell'

const DayCalendar = () => {
  const [currentDate] = useStore((state) => [
    state.currentDate,
    state.setRenamingEventNow,
  ])
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="relative flex w-fit flex-col items-center justify-center px-16 py-4">
        <DayCell date={currentDate} size="lg" dayAbr />
      </div>
      <Schedule date={currentDate} />
    </div>
  )
}

export default DayCalendar
