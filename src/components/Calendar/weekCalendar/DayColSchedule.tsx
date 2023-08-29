import clsx from 'clsx'
import { add, format, startOfDay } from 'date-fns'
import React from 'react'
import TimeEvent from '~/components/TimeEvent'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const DayCol: React.FC<Props> = ({ className, date }) => {
  const startOfCurrentDay = startOfDay(date)
  return (
    <div
      className={clsx(
        'grid-rows-auto relative z-[-1] grid h-fit w-full auto-rows-fr grid-cols-1',
        className
      )}
    >
      {Array.from({ length: 24 }).map((_, index) => {
        const time = format(
          add(startOfCurrentDay, { hours: index + 1 }),
          'hh aa'
        )
        return (
          <div
            className="relative inset-0 h-[60px] w-full border-b bg-slate-50"
            key={index}
          ></div>
        )
      })}
    </div>
  )
}

export default DayCol
