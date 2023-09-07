import React from 'react'
import useStore from '~/store/useStore'
import { startOfYear, add } from 'date-fns'
import MonthCell from './MonthCell'
import clsx from 'clsx'

const YearCalendar = () => {
  const [currentDate] = useStore((state) => [state.currentDate])

  return (
    <div className="items-cente flex h-full w-full justify-center overflow-auto pb-4 transition">
      <div
        className={clsx(
          'grid h-fit w-fit gap-x-6 gap-y-2 pt-2',
          'grid-rows-auto grid-cols-1 md:grid-cols-2 md:grid-rows-6 lg:grid-cols-3 lg:grid-rows-4 xl:grid-cols-4 xl:grid-rows-3'
        )}
      >
        {Array.from({ length: 12 }).map((_, index) => {
          const startDateOfYear = startOfYear(currentDate)
          const date = add(startDateOfYear, { months: index })
          const numOfMonth = index + 1

          return <MonthCell size="xs" key={numOfMonth} monthDate={date} />
        })}
      </div>
    </div>
  )
}

export default YearCalendar
