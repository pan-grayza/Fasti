import React, { useEffect, useRef, useState } from 'react'
import TimeEvent from '~/components/TimeEvent'
import { add, format, startOfDay } from 'date-fns'
import clsx from 'clsx'
import { api } from '~/utils/api'
import useStore from '~/store/useStore'
import TimeEventCreator from '~/components/TimeEventCreator'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const Schedule: React.FC<Props> = ({ className, date }) => {
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

  const startOfCurrentDay = startOfDay(date)

  //Other states
  const [selectedCalendar, creatingTimeEventNow, setCreatingTimeEventNow] =
    useStore((state) => [
      state.selectedCalendar,
      state.creatingTimeEventNow,
      state.setCreatingTimeEventNow,
    ])

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
  const [createEventProps, setCreatingEventProps] = useState<{
    x: number
    y: number
    calendarId: string
  }>({ x: 0, y: 0, calendarId: selectedCalendar?.id ?? '' })

  return (
    <div
      className={clsx(
        'relative flex h-full w-full flex-row overflow-auto',
        className
      )}
    >
      <div className="grid-rows-auto relative grid h-max w-16 auto-rows-fr grid-cols-1 pr-2 pt-[30px]">
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
      <div ref={parentGrid} className="relative h-fit w-full">
        <div
          onClick={(e) => {
            if (!creatingTimeEventNow) {
              const bounds = e.currentTarget.getBoundingClientRect()
              setCreatingEventProps({
                ...createEventProps,
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
            createEventProps={createEventProps}
            parentWidth={dimensions.width}
          />
        )}
        <div className="relative z-[-1] grid h-max w-full auto-rows-fr grid-cols-1">
          {Array.from({ length: 24 }).map((_, index) => {
            const time = format(
              add(startOfCurrentDay, { hours: index + 1 }),
              'hh aa'
            )
            return (
              <div
                className="relative h-[60px] w-full border-b bg-slate-50"
                key={index}
              ></div>
            )
          })}
        </div>
        {timeEvents?.map((event) => {
          return (
            <TimeEvent
              key={event.id}
              eventProps={event}
              parentWidth={dimensions.width}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Schedule
