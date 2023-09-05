import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  setDate,
  startOfMonth,
  sub,
} from 'date-fns'
import Cell from './Cell'
import EventCell from './EventCell'
import DateCell from './DateCell'

import useStore from '~/store/useStore'
import { api } from '~/utils/api'
import type { dayEvent } from '@prisma/client'
import clsx from 'clsx'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
interface Props {
  className?: string
}

const MonthCalendar: React.FC<Props> = ({ className }) => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const numOfDays = differenceInDays(endDate, startDate) + 1

  const prefixDays = startDate.getDay()
  const suffixDays = 6 - endDate.getDay()

  const prevMonth = sub(currentDate, { months: 1 })
  const nextMonth = add(currentDate, { months: 1 })
  const lastDayOfPervMonth = parseInt(format(endOfMonth(prevMonth), 'dd'))

  const handleClickDate = (index: number) => {
    const date = setDate(currentDate, index)
    setCurrentDate(date)
  }

  return (
    <div
      className={clsx(
        'relative flex h-full w-full flex-col transition',
        className
      )}
    >
      <div className="relative grid grid-cols-7 items-center justify-center text-center">
        {days.map((day) => (
          <Cell
            key={day}
            className="h-6 text-xs font-bold uppercase text-gray-900/50"
          >
            {day}
          </Cell>
        ))}
      </div>
      <div className="relative -mt-2 grid h-full auto-rows-fr grid-cols-7 text-center">
        {Array.from({ length: prefixDays })
          .map((_, index) => {
            const date = setDate(prevMonth, lastDayOfPervMonth - index)
            return (
              <DateCell date={date} key={index}>
                {lastDayOfPervMonth - index}
              </DateCell>
            )
          })
          .reverse()}
        {Array.from({ length: numOfDays }).map((_, index) => {
          const date = add(startDate, { days: index })
          const numOfDay = index + 1
          const isCurrentDate =
            format(date, 'dd MM yyyy') === format(currentDate, 'dd MM yyyy')
          return (
            <EventCell key={index} date={date}>
              {numOfDay}
            </EventCell>
          )
        })}
        {Array.from({ length: suffixDays }).map((_, index) => {
          const date = setDate(nextMonth, index + 1)
          return (
            <DateCell key={index} date={date}>
              {index + 1}
            </DateCell>
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar
