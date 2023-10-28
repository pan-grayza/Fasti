import React, { useEffect, useRef, useState } from 'react'
import TimeEvent from '../CalendarComponents/TimeEvent'
import { add, format, startOfDay } from 'date-fns'
import clsx from 'clsx'
import { api } from '~/utils/api'
import useStore from '~/store/useStore'
import TimeEventCreator from '../CalendarComponents/TimeEventCreator'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
  index: number
}

const Schedule: React.FC<Props> = ({ className, date, index }) => {
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
  const [
    selectedCalendar,
    creatingEventNow,
    setCreatingEventNow,
    renamingEventNow,
    setRenamingEventNow,
    isDarkTheme,
  ] = useStore((state) => [
    state.selectedCalendar,
    state.creatingEventNow,
    state.setCreatingEventNow,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.isDarkTheme,
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
  const filteredTimeEvents = timeEvents?.filter(
    (event) =>
      format(event.startTime, 'dd MMMM yyyy') === format(date, 'dd MMMM yyyy')
  )

  // Creating Event stuff
  const [createTimeEventProps, setCreatingTimeEventProps] = useState<{
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
            createEventProps={createTimeEventProps}
            parentWidth={dimensions.width}
          />
        )}
        <div className="relative grid h-max w-full auto-rows-fr grid-cols-1">
          {Array.from({ length: 24 }).map((_, index) => {
            return (
              <div
                className={clsx('relative h-[60px] w-full border-b', {
                  'border-lightThemeBorder bg-lightThemeDarkerBG': !isDarkTheme,
                  'bg-darkThemeLigherBG border-darkThemeSecondaryBG':
                    isDarkTheme,
                })}
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
  )
}

export default Schedule
