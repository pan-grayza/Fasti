import { add, format, startOfWeek } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import useStore from '~/store/useStore'
import DayColSchedule from './DayColSchedule'
import DayCol from './DayCol'
import TimeEvent from '~/components/TimeEvent'
import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string
}

const WeekCalendar: React.FC<Props> = ({ className }) => {
  const [currentDate, setRenamingEventNow] = useStore((state) => [
    state.currentDate,
    state.setRenamingEventNow,
  ])
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
  const parentGrid = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      setDimensions({
        height: event[0].contentBoxSize[0].blockSize,
        width: event[0].contentBoxSize[0].inlineSize,
      })
    })

    if (parentGrid.current) {
      resizeObserver.observe(parentGrid.current)
    }
  }, [parentGrid, dimensions])

  const startOfCurrentWeek = startOfWeek(currentDate)
  const createEvent = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left //x position within the element.
    const y = e.clientY - rect.top //y position within the element.
  }

  return (
    <div className={clsx('relative flex h-full w-full flex-row', className)}>
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
              createEvent(e)
            }}
          >
            {Array.from({ length: 7 }).map((_, index) => {
              const date = add(startOfCurrentWeek, { days: index })
              return (
                <DayColSchedule className="border-l" key={index} date={date} />
              )
            })}
            <TimeEvent
              date={currentDate}
              type="week"
              parentWidth={dimensions.width}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeekCalendar
