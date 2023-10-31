import React, { useEffect, useRef, useState } from 'react'
import useStore from '~/store/useStore'
import DayCell from '../CalendarComponents/DayCell'
import { add, format, startOfDay, sub } from 'date-fns'
import clsx from 'clsx'
import { api } from '~/utils/api'
import TimeEvent from '../CalendarComponents/TimeEvent'
import TimeEventCreator from '../CalendarComponents/TimeEventCreator'

const DayCalendar = () => {
  const [
    currentDate,
    setCurrentDate,

    creatingEventNow,
    selectedCalendar,
    setCreatingEventNow,
    renamingEventNow,
    setRenamingEventNow,
    isDarkTheme,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.creatingEventNow,
    state.selectedCalendar,
    state.setCreatingEventNow,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.isDarkTheme,
  ])

  const startOfCurrentDay = startOfDay(currentDate)

  //Size and position stuff
  const [dimensions, setDimensions] = useState<{
    height: number | undefined
    width: number | undefined
  }>({
    height: 0,
    width: 0,
  })
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
      setCurrentDate(sub(currentDate, { days: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(currentDate, { days: 1 }))
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
        ref={calendarContainer}
        className="relative flex h-full w-[300vw] snap-x snap-mandatory flex-row overflow-x-auto overflow-y-hidden scrollbar-hide "
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
            className="relative h-[calc(100%-80px)] w-full shrink-0 overflow-y-auto scrollbar-hide"
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
            const filteredTimeEvents = timeEvents?.filter(
              (event) =>
                format(event.startTime, 'dd MMMM yyyy') ===
                format(add(currentDate, { days: index - 1 }), 'dd MMMM yyyy')
            )
            return (
              <div
                key={index}
                className="relative flex h-full w-screen shrink-0 snap-center pl-12 md:pl-16"
              >
                <div className="relative flex h-full w-full flex-col">
                  <div className="relative flex h-20 w-full shrink-0 flex-row items-center">
                    <DayCell
                      date={add(currentDate, { days: index - 1 })}
                      size="lg"
                      dayAbr
                    />
                  </div>
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
                    className="relative flex h-[calc(100%-80px)] w-full shrink-0 flex-row overflow-auto"
                  >
                    <div
                      ref={parentGrid}
                      className="relative h-[1470px] w-full"
                    >
                      <div
                        onClick={(e) => {
                          if (renamingEventNow || creatingEventNow) {
                            setRenamingEventNow(false)
                            setCreatingEventNow(false)
                          } else {
                            const bounds =
                              e.currentTarget.getBoundingClientRect()
                            setCreatingTimeEventProps({
                              ...createTimeEventProps,
                              x: e.clientX - bounds.left,
                              y:
                                e.clientY - bounds.top < 1410
                                  ? Math.round((e.clientY - bounds.top) / 15) *
                                    15
                                  : 1410,
                            })
                            setCreatingEventNow(true)
                            setRenamingEventNow(true)
                          }
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer"
                      />

                      {creatingEventNow && (
                        <TimeEventCreator
                          createEventProps={createTimeEventProps}
                          parentWidth={dimensions.width}
                        />
                      )}
                      <div className="pointer-events-none relative grid h-max w-full auto-rows-fr grid-cols-1">
                        {Array.from({ length: 24 }).map((_, index) => {
                          return (
                            <div
                              className={clsx(
                                'relative h-[60px] w-full border-b',
                                {
                                  'border-lightThemeBorder bg-lightThemeDarkerBG':
                                    !isDarkTheme,
                                  'bg-darkThemeLigherBG border-darkThemeSecondaryBG':
                                    isDarkTheme,
                                }
                              )}
                              key={index}
                            ></div>
                          )
                        })}
                      </div>
                      {filteredTimeEvents?.map((event) => {
                        return (
                          <TimeEvent
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

export default DayCalendar
