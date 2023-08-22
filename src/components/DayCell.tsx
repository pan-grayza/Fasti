import React from 'react'
import useStore from '~/store/useStore'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const DayCell: React.FC<Props> = ({
  children,
  className,
  date,
  size = 'sm',
  onClick,
}) => {
  const [currentDate, setCurrentDate] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
  ])
  const isCurrentDate =
    format(date, 'dd MM yyyy') === format(currentDate, 'dd MM yyyy')
  const isToday =
    format(date, 'dd MM yyyy') === format(new Date(), 'dd MM yyyy')
  return (
    <div
      className={clsx(
        'relative flex min-h-min min-w-min cursor-pointer items-center justify-center',
        {
          'h-8 w-8': size === 'sm',
          'h-12 w-12': size === 'md',
          'h-16 w-16': size === 'lg',
        },
        className
      )}
    >
      <div
        onClick={() => setCurrentDate(date)}
        className={clsx(
          'relative  flex cursor-pointer select-none items-center justify-center rounded-full transition-colors',
          {
            'bg-blue-300/50 text-blue-700': isCurrentDate && !isToday,
            'bg-blue-600 text-white': isToday,
            'hover:bg-gray-300/50': !isCurrentDate && !isToday,
            'h-8 w-8 text-sm': size === 'sm',
            'h-12 w-12 text-xl': size === 'md',
            'h-16 w-16 text-2xl font-semibold': size === 'lg',
          }
        )}
      >
        {format(date, 'dd')}
      </div>
      <div className="absolute"></div>
    </div>
  )
}

export default DayCell
