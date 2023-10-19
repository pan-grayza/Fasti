import { add, format, startOfWeek, sub } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'

import useStore from '~/store/useStore'
import DayColSchedule from './DayColSchedule'
import DayCol from './DayCol'
import TimeEvent from '../CalendarComponents/TimeEvent'
import TimeEventCreator from '../CalendarComponents/TimeEventCreator'
import { api } from '~/utils/api'
import clsx from 'clsx'

const WeekCalendar = () => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])

  // Scroll handling

  const onScrollEnd = () => {
    const monthContainer = document.getElementById('calendarContainer')
    const scrollX = monthContainer?.scrollLeft

    if ((scrollX ?? window.innerWidth) < window.innerWidth) {
      setCurrentDate(sub(currentDate, { weeks: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(currentDate, { weeks: 1 }))
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
              className="relative h-full w-screen shrink-0 snap-center"
            >
              <WeekComponent index={index} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const WeekComponent = ({ index }: { index: number }) => {
  const [
    realCurrentDate,
    selectedCalendar,
    creatingEventNow,
    setCreatingEventNow,
    renamingEventNow,
    setRenamingEventNow,
    isDarkTheme,
  ] = useStore((state) => [
    state.currentDate,
    state.selectedCalendar,
    state.creatingEventNow,
    state.setCreatingEventNow,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.isDarkTheme,
  ])

  const currentDate = add(realCurrentDate, { weeks: index - 1 })
  const startOfCurrentWeek = startOfWeek(currentDate)
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
  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Decorative rectange in top left */}
      <div
        className={clsx('absolute inset-0 z-10 h-24 w-12 md:w-16', {
          'bg-lightThemeBG': !isDarkTheme,
          'bg-darkThemeBG': isDarkTheme,
        })}
      />
      <DayColumns startOfCurrentWeek={startOfCurrentWeek} />
      <div className="relative flex h-full w-screen flex-row overflow-y-auto scrollbar-hide">
        <HourColumn startOfCurrentWeek={startOfCurrentWeek} />

        <div
          ref={parentGrid}
          className="relative grid h-max w-full grid-cols-7"
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          {Array.from({ length: 7 }).map((_, index) => {
            return <DayColSchedule key={index} />
          })}
          <div
            onClick={(e) => {
              if (renamingEventNow || creatingEventNow) {
                setRenamingEventNow(false)
                setCreatingEventNow(false)
              } else {
                const bounds = e.currentTarget.getBoundingClientRect()
                setCreatingTimeEventProps({
                  ...createTimeEventProps,
                  x: e.clientX - bounds.left,
                  y:
                    e.clientY - bounds.top < 1410
                      ? Math.round((e.clientY - bounds.top) / 15) * 15
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
        'relative z-10 ml-12 flex h-24 w-[calc(100vw-3rem)] shrink-0 flex-col drop-shadow-sm backdrop-blur md:ml-16 md:w-[calc(100vw-4rem)]',
        {
          'bg-lightThemeBG/90': !isDarkTheme,
          'bg-darkThemeBG/90': isDarkTheme,
        },
        className
      )}
    >
      <div className="relative grid h-20 w-full shrink-0 grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => {
          const date = add(startOfCurrentWeek, { days: index })
          return <DayCol key={index} date={date} />
        })}
      </div>
      <div
        className={clsx(
          'relative grid h-4 w-full shrink-0 grid-cols-7 divide-x-[1px] divide-solid',
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

const HourColumn = ({
  startOfCurrentWeek,
  className,
}: {
  startOfCurrentWeek: Date
  className?: React.HTMLProps<HTMLElement>['className']
}) => {
  return (
    <div
      className={clsx(
        'relative grid h-fit w-12 shrink-0 auto-rows-fr grid-cols-1 pr-2 pt-[30px] md:w-16',
        className
      )}
    >
      {Array.from({ length: 24 }).map((_, index) => {
        const time = format(
          add(startOfCurrentWeek, { hours: index + 1 }),
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
  )
}

export default WeekCalendar
