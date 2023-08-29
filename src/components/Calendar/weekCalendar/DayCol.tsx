import clsx from 'clsx'
import { add, format, startOfDay } from 'date-fns'
import React from 'react'
import DayCell from '~/components/DayCell'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const DayCol: React.FC<Props> = ({ className, date }) => {
  const startOfCurrentDay = startOfDay(date)
  return (
    <div
      className={clsx('relative flex items-center justify-center', className)}
    >
      <div className="relative flex w-fit flex-col items-center justify-center px-16 py-4">
        <DayCell date={date} size="md" dayAbr />
      </div>
    </div>
  )
}

export default DayCol
