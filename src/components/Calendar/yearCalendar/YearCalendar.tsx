import React from 'react'
import useStore from '~/store/useStore'
import { startOfYear, add } from 'date-fns'
import MonthCell from './MonthCell'

const YearCalendar = () => {
  const [currentDate] = useStore((state) => [state.currentDate])

  return (
    <div className="items-cente flex h-full w-full justify-center overflow-auto pb-4">
      <div className="grid-rows-auto grid h-fit w-fit grid-cols-1 gap-x-6 gap-y-2 pt-2 sm:grid-cols-2 sm:grid-rows-6 md:grid-cols-3 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-3">
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
