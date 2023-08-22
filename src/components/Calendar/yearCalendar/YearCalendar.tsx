import React from 'react'
import useStore from '~/store/useStore'
import { startOfYear, add } from 'date-fns'
import MonthCell from './MonthCell'

const YearCalendar = () => {
  const [currentDate] = useStore((state) => [state.currentDate])

  return (
    <div className="h-full w-full overflow-auto p-4">
      <div className="grid grid-cols-2 grid-rows-6 gap-4 md:grid-cols-3 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-3">
        {Array.from({ length: 12 }).map((_, index) => {
          const startDateOfYear = startOfYear(currentDate)
          const date = add(startDateOfYear, { months: index })
          const numOfMonth = index + 1

          return <MonthCell key={numOfMonth} monthDate={date} />
        })}
      </div>
    </div>
  )
}

export default YearCalendar
