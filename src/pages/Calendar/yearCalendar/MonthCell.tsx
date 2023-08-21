import React from 'react'
import {
    add,
    differenceInDays,
    endOfMonth,
    format,
    setDate,
    startOfMonth,
    sub,
} from 'date-fns'
import DayCell from '../../components/DayCell'

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
interface Props extends React.PropsWithChildren {
    className?: string
    monthDate: Date
    onClick?: (id: string) => void
}

const MonthCell: React.FC<Props> = ({ className, monthDate, children }) => {
    const startDate = startOfMonth(monthDate)
    const endDate = endOfMonth(monthDate)
    const numOfDays = differenceInDays(endDate, startDate) + 1

    const prefixDays = startDate.getDay()
    const suffixDays = 6 - endDate.getDay()

    const prevMonth = sub(monthDate, { months: 1 })
    const nextMonth = add(monthDate, { months: 1 })
    const lastDayOfPervMonth = parseInt(format(endOfMonth(prevMonth), 'dd'))

    return (
        <div className="relative flex flex-col items-center justify-center p-2 min-h-max min-w-max">
            <p>{format(monthDate, 'MMMM')}</p>
            <div className="grid w-full grid-cols-7">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center h-6 p-1 text-xs font-bold uppercase opacity-50 select-none"
                    >
                        {day}
                    </div>
                ))}
            </div>
            <div className="relative grid w-full grid-cols-7 grid-rows-6 text-center">
                {Array.from({ length: prefixDays })
                    .map((_, index) => {
                        const date = setDate(
                            prevMonth,
                            lastDayOfPervMonth - index
                        )
                        return (
                            <DayCell
                                date={date}
                                className="opacity-50"
                                key={index}
                            ></DayCell>
                        )
                    })
                    .reverse()}
                {Array.from({ length: numOfDays }).map((_, index) => {
                    const date = add(startDate, { days: index })
                    const numOfDay = index + 1

                    return (
                        <DayCell key={numOfDay} date={date}>
                            {numOfDay}
                        </DayCell>
                    )
                })}
                {Array.from({ length: suffixDays }).map((_, index) => {
                    const date = setDate(nextMonth, index + 1)
                    return (
                        <DayCell
                            date={date}
                            className="opacity-50"
                            key={index}
                        ></DayCell>
                    )
                })}
            </div>
        </div>
    )
}

export default MonthCell
