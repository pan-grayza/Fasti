import clsx from 'clsx'

import React from 'react'
import DayCell from '~/components/Calendar/CalendarComponents/DayCell'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const DayCol: React.FC<Props> = ({ className, date }) => {
  return (
    <div
      className={clsx('relative flex items-center justify-center', className)}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        <DayCell date={date} size="md" dayAbr />
      </div>
    </div>
  )
}

export default DayCol
