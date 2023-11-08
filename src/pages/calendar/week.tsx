import { add, format, startOfDay, startOfWeek, sub } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'

import useStore from '~/store/useStore'
import DayColSchedule from '../../components/Calendar/weekCalendar/DayColSchedule'
import DayCol from '../../components/Calendar/weekCalendar/DayCol'
import TimeEvent from '../../components/Calendar/CalendarComponents/TimeEvent'
import TimeEventCreator from '../../components/Calendar/CalendarComponents/TimeEventCreator'
import { api } from '~/utils/api'
import clsx from 'clsx'

const WeekCalendar = () => {
  const [
    currentDate,
    setCurrentDate,
    selectedCalendar,
    creatingWithModal,
    setCreatingWithModal,
    isDarkTheme,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.selectedCalendar,
    state.creatingWithModal,
    state.setCreatingWithModal,
    state.isDarkTheme,
  ])

  const startOfCurrentWeek = startOfWeek(currentDate)
  const startOfCurrentDay = startOfDay(currentDate)
  // Size and position stuff
  const [dimensions, setDimensions] = useState<{
    height: number | undefined
    width: number | undefined
  }>({ height: 0, width: 0 })
  const parentGrid = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setDimensions({
        height: event[0]?.contentBoxSize[0]?.blockSize,
        width: event[0]?.contentBoxSize[0]?.inlineSize,
      })
    })

    if (parentGrid.current) {
      resizeObserver.observe(parentGrid.current)
    }
  }, [parentGrid, dimensions])

  //API stuff
  const { data: timeEvents, refetch: refetchTimeEvents } =
    api.timeEvent.getAll.useQuery(
      { calendarId: selectedCalendar?.id ?? '' },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  const filteredTimeEvents = timeEvents?.filter(
    (event) =>
      format(startOfWeek(event.startTime), 'dd MMMM yyyy') ===
      format(startOfWeek(currentDate), 'dd MMMM yyyy')
  )

  // Creating Event stuff
  const [createTimeEventProps, setCreatingTimeEventProps] = useState<{
    x: number
    y: number
    calendarId: string
  }>({ x: 0, y: 0, calendarId: selectedCalendar?.id ?? '' })

  // Scroll handling
  const scrollY = useRef(0)

  const calendarContainer = useRef<HTMLDivElement | null>(null)
  const mainCalendarView = useRef<HTMLDivElement | null>(null)
  const leftCalendarView = useRef<HTMLDivElement | null>(null)
  const rightCalendarView = useRef<HTMLDivElement | null>(null)

  const hourTimeline = useRef<HTMLDivElement | null>(null)

  const onScrollEnd = () => {
    const scrollX = calendarContainer?.current?.scrollLeft

    if ((scrollX ?? window.innerWidth) < window.innerWidth) {
      setCurrentDate(sub(currentDate, { weeks: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(currentDate, { weeks: 1 }))
    }
    calendarContainer?.current?.scrollTo(window.innerWidth, 0)
  }

  const onScrollY = () => {
    scrollY.current = mainCalendarView?.current?.scrollTop ?? 0
    if (leftCalendarView.current)
      leftCalendarView.current.scrollTo({ top: scrollY.current })
    if (rightCalendarView.current)
      rightCalendarView.current.scrollTo({ top: scrollY.current })
    if (hourTimeline.current)
      hourTimeline.current.scrollTo({ top: scrollY.current })
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
        <div
          className={clsx(
            'fixed inset-0 z-50 mt-14 flex h-full w-12 flex-col md:w-16',
            { 'bg-lightThemeBG': !isDarkTheme, 'bg-darkThemeBG': isDarkTheme }
          )}
        >
          {/* Decorative rectange in top left */}
          <div
            className={clsx('relative z-10 h-20 w-12 shrink-0 md:w-16', {
              'bg-lightThemeBG': !isDarkTheme,
              'bg-darkThemeBG': isDarkTheme,
            })}
          />
          <div
            ref={hourTimeline}
            className="relative h-[calc(100%-8.5rem)] w-full shrink-0 overflow-y-auto scrollbar-hide"
          >
            <div className="grid-rows-auto relative mt-[30px] grid h-fit w-full auto-rows-fr grid-cols-1 pr-2">
              {Array.from({ length: 24 }).map((_, index) => {
                const time = format(
                  add(startOfCurrentDay, { hours: index + 1 }),
                  'h aa'
                )
                return (
                  <div
                    className="relative flex h-[60px] items-center justify-end text-xs"
                    key={index}
                  >
                    {time}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="relative flex h-full flex-row">
          {Array.from({ length: 3 }).map((week, index) => {
            return (
              <div
                key={index}
                className="relative h-full w-screen shrink-0 snap-center pl-12 md:pl-16"
              >
                <div className="relative flex h-full w-full flex-col">
                  <DayColumns startOfCurrentWeek={startOfCurrentWeek} />
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
                    className="relative flex h-full w-full flex-row overflow-y-auto scrollbar-hide"
                  >
                    <div
                      ref={index === 1 ? parentGrid : null}
                      className="relative grid h-max w-full grid-cols-7"
                    >
                      {Array.from({ length: 7 }).map((_, index) => {
                        return <DayColSchedule key={index} />
                      })}
                      {index === 1 && (
                        <div
                          onClick={(e) => {
                            if (creatingWithModal) {
                              setCreatingWithModal(null)
                            } else {
                              const bounds =
                                e.currentTarget.getBoundingClientRect()
                              setCreatingTimeEventProps({
                                ...createTimeEventProps,
                                x: e.clientX - bounds.left,
                                y:
                                  e.clientY - bounds.top < 1410
                                    ? Math.round(
                                        (e.clientY - bounds.top) / 15
                                      ) * 15
                                    : 1410,
                              })
                              setCreatingWithModal('TimeEvent')
                            }
                          }}
                          className="absolute inset-0 h-full w-full cursor-pointer"
                        />
                      )}
                      {creatingWithModal === 'TimeEvent' && index === 1 && (
                        <TimeEventCreator
                          type="week"
                          createEventProps={createTimeEventProps}
                          parentWidth={dimensions.width}
                        />
                      )}

                      {filteredTimeEvents?.map((event) => {
                        return (
                          <TimeEvent
                            type="week"
                            key={event.id}
                            eventProps={event}
                            parentWidth={dimensions.width}
                            refetchTimeEvents={refetchTimeEvents}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const DayColumns = ({
  startOfCurrentWeek,
  className,
}: {
  startOfCurrentWeek: Date
  className?: React.HTMLProps<HTMLElement>['className']
}) => {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])
  return (
    <div
      className={clsx(
        'relative z-10 flex h-20 w-full shrink-0 flex-col drop-shadow-sm backdrop-blur',
        {
          'bg-lightThemeBG/90': !isDarkTheme,
          'bg-darkThemeBG/90': isDarkTheme,
        },
        className
      )}
    >
      <div className="relative grid h-[4.5rem] w-full shrink-0 grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = add(startOfCurrentWeek, { days: index })
          return <DayCol key={index} date={date} />
        })}
      </div>
      <div
        className={clsx(
          'relative grid h-2 w-full shrink-0 grid-cols-7 divide-x-[1px] divide-solid',
          {
            'divide-lightThemeBorder': !isDarkTheme,
            'divide-darkThemeBorder': isDarkTheme,
          }
        )}
      >
        {Array.from({ length: 7 }).map((_, index) => {
          return <div key={index} className="" />
        })}
      </div>
    </div>
  )
}

export default WeekCalendar
