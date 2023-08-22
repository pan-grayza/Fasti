import React from 'react'
import TimeEvent from './TimeEvent'
import { add, format, startOfDay } from 'date-fns'
import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const Schedule: React.FC<Props> = ({ className, date }) => {
  const startOfCurrentDay = startOfDay(date)
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
      <div className="relative h-full w-full">
        <div className="relative h-full w-full">
          <TimeEvent date={date} />
        </div>
        <div className="grid-rows-auto absolute inset-0 z-[-1] grid h-max w-full auto-rows-fr grid-cols-1">
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
      </div>
    </div>
  )
}

export default Schedule
