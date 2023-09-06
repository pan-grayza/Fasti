import { add, format, startOfWeek } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'

import useStore from '~/store/useStore'
import DayColSchedule from './DayColSchedule'
import DayCol from './DayCol'
import TimeEvent from '~/components/TimeEvent'
import TimeEventCreator from '~/components/TimeEventCreator'
import { api } from '~/utils/api'

const WeekCalendar = () => {
  const [
    currentDate,
    selectedCalendar,
    creatingTimeEventNow,
    setCreatingTimeEventNow,
  ] = useStore((state) => [
    state.currentDate,
    state.selectedCalendar,
    state.creatingTimeEventNow,
    state.setCreatingTimeEventNow,
  ])
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

  // Creating Event stuff
  const [createTimeEventProps, setCreatingTimeEventProps] = useState<{
    x: number
    y: number
    calendarId: string
  }>({ x: 0, y: 0, calendarId: selectedCalendar?.id ?? '' })

  return (
    <div className="relative flex h-full w-full flex-row">
      <div className="relative flex h-full w-full flex-col">
        <div className="relative grid h-24 w-full grid-cols-7 pl-16">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = add(startOfCurrentWeek, { days: index })
            return <DayCol key={index} date={date} />
          })}
        </div>
        <div className="relative flex h-fit w-full flex-row overflow-auto">
          <div className="relative grid h-fit w-16 auto-rows-fr grid-cols-1 pr-2 pt-[30px]">
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
          <div
            ref={parentGrid}
            className="relative grid h-full w-full grid-cols-7"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {Array.from({ length: 7 }).map((_, index) => {
              const date = add(startOfCurrentWeek, { days: index })
              return (
                <DayColSchedule className="border-l" key={index} date={date} />
              )
            })}
            <div
              onClick={(e) => {
                if (!creatingTimeEventNow) {
                  const bounds = e.currentTarget.getBoundingClientRect()
                  setCreatingTimeEventProps({
                    ...createTimeEventProps,
                    x: e.clientX - bounds.left,
                    y:
                      e.clientY - bounds.top < 1410
                        ? Math.round((e.clientY - bounds.top) / 15) * 15
                        : 1410,
                  })
                  setCreatingTimeEventNow(true)
                } else {
                  setCreatingTimeEventNow(false)
                }
              }}
              className="absolute inset-0 h-full w-full cursor-pointer"
            />
            {creatingTimeEventNow && (
              <TimeEventCreator
                type="week"
                createEventProps={createTimeEventProps}
                parentWidth={dimensions.width}
              />
            )}
            {timeEvents?.map((event) => {
              return (
                <TimeEvent
                  type="week"
                  key={event.id}
                  eventProps={event}
                  parentWidth={dimensions.width}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekCalendar
