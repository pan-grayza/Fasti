import React from 'react'
import useStore from '~/store/useStore'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props {
  className?: string
  date: Date
  size?: 'xs' | 'sm' | 'md' | 'lg'
  dayAbr?: boolean
  onClick?: () => void
}

const DayCell: React.FC<Props> = ({
  className,
  date,
  size = 'sm',
  dayAbr = false,
}) => {
  const [currentDate, setCurrentDate, isDarkTheme] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.isDarkTheme,
  ])
  const isCurrentDate =
    format(date, 'dd MM yyyy') === format(currentDate, 'dd MM yyyy')
  const isToday =
    format(date, 'dd MM yyyy') === format(new Date(), 'dd MM yyyy')
  return (
    <div
      onClick={() => setCurrentDate(date)}
      className="relative flex w-fit cursor-pointer flex-col items-center justify-center"
    >
      {dayAbr && (
        <p
          className={clsx('text-xs font-bold uppercase', {
            'text-blue-600': isToday,
            'text-darkText/75': !isToday && !isDarkTheme,
            'text-lightText/75': !isToday && isDarkTheme,
          })}
        >
          {format(date, 'E')}
        </p>
      )}
      <div
        className={clsx(
          'relative flex min-h-min min-w-min items-center justify-center',
          {
            'h-6 w-6': size === 'xs',
            'h-8 w-8': size === 'sm',
            'h-12 w-12': size === 'md',
            'h-16 w-16': size === 'lg',
          },
          className
        )}
      >
        <div
          className={clsx(
            'relative  flex select-none items-center justify-center rounded-full transition-colors',
            {
              'bg-lightSelected text-blue-700':
                isCurrentDate && !isToday && !isDarkTheme,
              'bg-darkSelected text-blue-100':
                isCurrentDate && !isToday && isDarkTheme,
              'bg-blue-600 text-white': isToday,
              'hover:bg-lightHover': !isCurrentDate && !isToday && !isDarkTheme,
              'hover:bg-darkHover': !isCurrentDate && !isToday && isDarkTheme,
              'h-7 w-7 text-xs': size === 'xs',
              'h-8 w-8 text-sm': size === 'sm',
              'h-12 w-12 text-xl': size === 'md',
              'h-16 w-16 text-2xl font-semibold': size === 'lg',
            }
          )}
        >
          {format(date, 'd')}
        </div>
      </div>
    </div>
  )
}

export default DayCell
