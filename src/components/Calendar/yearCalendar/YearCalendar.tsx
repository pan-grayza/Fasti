import React, { useEffect, useRef } from 'react'
import useStore from '~/store/useStore'
import { startOfYear, add, sub } from 'date-fns'
import MonthCell from '../CalendarComponents/MonthCell'
import clsx from 'clsx'

const YearCalendar = () => {
  const [realCurrentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])

  // Scroll handling

  const scrollY = useRef(0)

  const calendarContainer = useRef<HTMLDivElement | null>(null)
  const mainCalendarView = useRef<HTMLDivElement | null>(null)
  const leftCalendarView = useRef<HTMLDivElement | null>(null)
  const rightCalendarView = useRef<HTMLDivElement | null>(null)

  const onScrollEnd = () => {
    const scrollX = calendarContainer?.current?.scrollLeft

    if ((scrollX ?? window.innerWidth) < window.innerWidth) {
      setCurrentDate(sub(realCurrentDate, { years: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(realCurrentDate, { years: 1 }))
    }
    calendarContainer?.current?.scrollTo(window.innerWidth, 0)
  }
  const onScrollY = () => {
    scrollY.current = mainCalendarView?.current?.scrollTop ?? 0
    if (leftCalendarView.current)
      leftCalendarView.current.scrollTo({ top: scrollY.current })
    if (rightCalendarView.current)
      rightCalendarView.current.scrollTo({ top: scrollY.current })
  }

  useEffect(() => {
    calendarContainer?.current?.scrollTo(window.innerWidth, 0)
  }, [])

  useEffect(() => {
    const calendarContainerElement = calendarContainer.current
    if (calendarContainerElement) {
      calendarContainerElement.addEventListener('scrollend', onScrollEnd)

      return () => {
        calendarContainerElement.removeEventListener('scrollend', onScrollEnd)
      }
    }
  })

  return (
    <div className="relative flex h-full w-full items-center justify-center transition-colors">
      <div
        ref={calendarContainer}
        className="relative flex h-full w-[300vw] snap-x snap-mandatory flex-row overflow-x-auto overflow-y-hidden scrollbar-hide"
      >
        {Array.from({ length: 3 }).map((week, index) => {
          const currentDate = add(realCurrentDate, { years: index - 1 })
          return (
            <div
              key={index}
              className="relative h-full w-screen shrink-0 snap-center"
            >
              <div
                ref={
                  index === 1
                    ? mainCalendarView
                    : index === 0
                    ? leftCalendarView
                    : rightCalendarView
                }
                onScroll={() => {
                  if (index === 1) onScrollY()
                }}
                className="items-cente flex h-full w-full justify-center overflow-auto pb-4 transition scrollbar-hide"
              >
                <div
                  className={clsx(
                    'grid h-fit w-fit gap-x-6 gap-y-2 pt-2',
                    'grid-rows-auto grid-cols-1 md:grid-cols-2 md:grid-rows-6 lg:grid-cols-3 lg:grid-rows-4 xl:grid-cols-4 xl:grid-rows-3'
                  )}
                >
                  {Array.from({ length: 12 }).map((_, index) => {
                    const startDateOfYear = startOfYear(currentDate)
                    const date = add(startDateOfYear, { months: index })
                    const numOfMonth = index + 1

                    return (
                      <MonthCell size="xs" key={numOfMonth} monthDate={date} />
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default YearCalendar
