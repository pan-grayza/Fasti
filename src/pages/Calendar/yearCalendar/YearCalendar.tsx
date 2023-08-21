import React from 'react'
import useStore from '../../store/useStore'
import { startOfYear, add } from 'date-fns'
import MonthCell from './MonthCell'

const YearCalendar = () => {
    const [currentDate, setCurrentDate] = useStore((state) => [
        state.currentDate,
        state.setCurrentDate,
    ])

    return (
        <div className="w-full h-full p-4 overflow-auto">
            <div className="grid md:grid-cols-3 md:grid-rows-4 gap-4 lg:grid-cols-4 lg:grid-rows-3 grid-cols-2 grid-rows-6">
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
