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
import clsx from 'clsx'
import { useEffect } from 'react'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
interface Props {
  className?: string
}

const MonthCalendar: React.FC<Props> = ({ className }) => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])

  // Scroll handling

  const onScrollEnd = () => {
    const monthContainer = document.getElementById('monthContainer')
    const scrollX = monthContainer?.scrollLeft

    if ((scrollX ?? window.innerWidth) < window.innerWidth) {
      setCurrentDate(sub(currentDate, { months: 1 }))
    } else if ((scrollX ?? window.innerWidth) >= window.innerWidth * 2) {
      setCurrentDate(add(currentDate, { months: 1 }))
    }
    monthContainer?.scrollTo(window.innerWidth, 0)
  }

  useEffect(() => {
    document
      .getElementById('monthContainer')
      ?.addEventListener('scrollend', onScrollEnd)
    return () => {
      document
        .getElementById('monthContainer')
        ?.removeEventListener('scrollend', onScrollEnd)
    }
  })
  //Date stuff

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const numOfDays = differenceInDays(endDate, startDate) + 1

  const prefixDays = startDate.getDay()
  const suffixDays = 6 - endDate.getDay()

  const prevMonth = sub(currentDate, { months: 1 })
  const nextMonth = add(currentDate, { months: 1 })
  const lastDayOfPervMonth = parseInt(format(endOfMonth(prevMonth), 'dd'))

  return (
    <div
      className={clsx(
        'relative flex h-full w-full flex-row items-center justify-center transition-colors',
        className
      )}
    >
      <div
        id="monthContainer"
        className="relative flex h-full w-[300vw] snap-x snap-mandatory flex-row overflow-x-auto scrollbar-hide"
      >
        {Array.from({ length: 3 }).map((elem, index) => {
          return (
            <div
              key={index}
              id={index === 1 ? 'mainMonth' : undefined}
              className="relative h-full w-screen shrink-0 snap-center"
            >
              <MonthPage index={index} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MonthPage = ({ index }: { index: number }) => {
  const [realCurrentDate, selectedCalendar, isDarkTheme] = useStore((state) => [
    state.currentDate,
    state.selectedCalendar,
    state.isDarkTheme,
  ])
  const currentDate = add(realCurrentDate, { months: index - 1 })
  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const numOfDays = differenceInDays(endDate, startDate) + 1

  const prefixDays = startDate.getDay()
  const suffixDays = 6 - endDate.getDay()

  const prevMonth = sub(currentDate, { months: 1 })
  const nextMonth = add(currentDate, { months: 1 })
  const lastDayOfPervMonth = parseInt(format(endOfMonth(prevMonth), 'dd'))

  //API stuff
  const { data: dayEvents, refetch: refetchDayEvents } =
    api.dayEvent.getAll.useQuery(
      {
        calendarId: selectedCalendar?.id ?? '',
      },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  return (
    <div className="relative flex h-full w-full flex-col transition">
      <div className="relative grid grid-cols-7 items-center justify-center text-center">
        {days.map((day) => (
          <Cell
            key={day}
            className={clsx('h-6 text-xs font-bold uppercase', {
              'border-lightThemeBorder': !isDarkTheme,
              'border-darkThemeBorder': isDarkTheme,
            })}
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
              <DateCell
                className={clsx('', {
                  'border-lightThemeBorder': !isDarkTheme,
                  'border-darkThemeBorder': isDarkTheme,
                })}
                date={date}
                key={index}
              />
            )
          })
          .reverse()}
        {Array.from({ length: numOfDays }).map((_, index) => {
          const date = add(startDate, { days: index })
          const filteredDayEvents = dayEvents?.filter(
            (dayEvent) =>
              format(dayEvent.date, 'dd MMMM yyyy') ===
              format(date, 'dd MMMM yyyy')
          )
          return (
            <EventCell
              key={index}
              filteredDayEvents={filteredDayEvents}
              refetchDayEvents={() => refetchDayEvents()}
              date={date}
              className={clsx('', {
                'border-lightThemeBorder': !isDarkTheme,
                'border-darkThemeBorder': isDarkTheme,
              })}
            />
          )
        })}
        {Array.from({ length: suffixDays }).map((_, index) => {
          const date = setDate(nextMonth, index + 1)
          return (
            <DateCell
              key={index}
              className={clsx('', {
                'border-lightThemeBorder': !isDarkTheme,
                'border-darkThemeBorder': isDarkTheme,
              })}
              date={date}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar
