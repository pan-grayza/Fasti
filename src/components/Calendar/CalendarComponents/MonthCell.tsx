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
import DayCell from '~/components/Calendar/CalendarComponents/DayCell'
import clsx from 'clsx'
import ArrowButton from '~/components/ArrowButton'
import useStore from '~/store/useStore'

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
interface Props extends React.PropsWithChildren {
  monthDate: Date
  sidebar?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const MonthCell: React.FC<Props> = ({
  monthDate,
  sidebar = false,
  size = 'sm',
}) => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])
  const startDate = startOfMonth(monthDate)
  const endDate = endOfMonth(monthDate)
  const numOfDays = differenceInDays(endDate, startDate) + 1

  const prefixDays = startDate.getDay()
  const suffixDays = 6 - endDate.getDay()

  const prevMonth = sub(monthDate, { months: 1 })
  const nextMonth = add(monthDate, { months: 1 })
  const lastDayOfPervMonth = parseInt(format(endOfMonth(prevMonth), 'dd'))

  const goPrev = () => {
    setCurrentDate(sub(currentDate, { months: 1 }))
  }
  const goNext = () => {
    setCurrentDate(add(currentDate, { months: 1 }))
  }

  return (
    <div className="relative flex h-fit w-max flex-col items-center justify-center gap-1">
      <div className="flex h-fit w-full flex-row items-center justify-between pl-2 text-sm font-semibold">
        {sidebar ? (
          <>
            {format(monthDate, 'MMMM yyyy')}
            <div className="relative flex items-center gap-2">
              <ArrowButton
                size={size}
                onClick={() => goPrev()}
                direction="left"
              />
              <ArrowButton
                size={size}
                onClick={() => goNext()}
                direction="right"
              />
            </div>
          </>
        ) : (
          format(monthDate, 'MMMM')
        )}
      </div>

      <div className="relative grid w-full grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={clsx(
              'flex h-6 w-6 select-none items-center justify-center font-semibold uppercase text-gray-400',
              {
                'h-6 w-6 text-xs': size === 'xs',
                'h-8 w-8 text-sm': size === 'sm',
                'h-12 w-12 text-xl': size === 'md',
                'h-16 w-16 text-2xl font-bold': size === 'lg',
              }
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="relative grid w-full grid-cols-7 grid-rows-6 gap-1">
        {Array.from({ length: prefixDays })
          .map((_, index) => {
            const date = setDate(prevMonth, lastDayOfPervMonth - index)
            return (
              <DayCell
                size={size}
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

          return <DayCell size={size} key={numOfDay} date={date} />
        })}
        {Array.from({ length: suffixDays }).map((_, index) => {
          const date = setDate(nextMonth, index + 1)
          return (
            <DayCell
              size={size}
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
