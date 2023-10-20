import React, { useEffect } from 'react'
import Schedule from './Schedule'
import useStore from '~/store/useStore'
import DayCell from '../CalendarComponents/DayCell'
import { add, sub } from 'date-fns'

const DayCalendar = () => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])

  // Scroll handling

  const onScrollEnd = () => {
    const monthContainer = document.getElementById('calendarContainer')
    const scrollX = monthContainer?.scrollLeft

    if ((scrollX ?? window.innerWidth) < window.innerWidth) {
      setCurrentDate(sub(currentDate, { days: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(currentDate, { days: 1 }))
    }
    monthContainer?.scrollTo(window.innerWidth, 0)
  }

  useEffect(() => {
    document
      .getElementById('calendarContainer')
      ?.addEventListener('scrollend', onScrollEnd)
    return () => {
      document
        .getElementById('calendarContainer')
        ?.removeEventListener('scrollend', onScrollEnd)
    }
  })
  return (
    <div className="relative flex h-full w-full items-center justify-center transition-colors">
      <div
        id="calendarContainer"
        className="relative flex h-full w-[300vw] snap-x snap-mandatory flex-row overflow-x-auto overflow-y-hidden scrollbar-hide"
      >
        {Array.from({ length: 3 }).map((week, index) => {
          return (
            <div
              key={index}
              className="relative flex h-full w-screen shrink-0 snap-center flex-col"
            >
              <div className="relative flex w-fit flex-col items-center justify-center px-16 py-4">
                <DayCell
                  date={add(currentDate, { days: index - 1 })}
                  size="lg"
                  dayAbr
                />
              </div>
              <Schedule date={add(currentDate, { days: index - 1 })} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DayCalendar
