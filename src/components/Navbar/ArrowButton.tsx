import clsx from 'clsx'
import React from 'react'

interface Props extends React.PropsWithChildren {
  className?: string
  onClick?: () => void
  direction: 'right' | 'left' | 'top' | 'bottom'
  disabled?: boolean
}

const ArrowButton: React.FC<Props> = ({
  className,
  onClick = () => null,
  direction,
  disabled,
}) => {
  className = clsx(
    'flex items-center justify-center rounded-full bg-gray-200/0 p-2 transition hover:bg-gray-200/50',
    className
  )
  return (
    <div>
      <button
        disabled={disabled}
        className={className}
        onClick={() => onClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          className={clsx(
            'h-5 w-5',
            direction === 'right' && 'rotate-180',
            direction === 'bottom' && 'rotate-90',
            direction === 'top' && 'rotate-270'
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </div>
  )
}

export default ArrowButton
