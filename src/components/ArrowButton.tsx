import clsx from 'clsx'
import React from 'react'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
  onClick?: () => void
  direction: 'right' | 'left' | 'top' | 'bottom'
  size?: 'xs' | 'sm' | 'md' | 'lg'

  disabled?: boolean
}

const ArrowButton: React.FC<Props> = ({
  className,
  onClick = () => null,
  direction,
  size = 'sm',
  disabled,
}) => {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])
  return (
    <div>
      <button
        disabled={disabled}
        className={clsx(
          'flex items-center justify-center rounded-full bg-gray-200/0 p-1 transition',
          {
            'hover:bg-darkThemeHover': isDarkTheme,
            'hover:bg-lightThemeHover': !isDarkTheme,
          },
          className
        )}
        onClick={() => onClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          className={clsx('flex items-center justify-center', {
            '-translate-x-[5%] rotate-0': direction === 'left',
            'translate-x-[5%] rotate-180': direction === 'right',
            'translate-y-[5%] rotate-90': direction === 'bottom',
            'rotate-270 -translate-y-[5%]': direction === 'top',
            'h-4 w-4': size === 'xs',
            'h-5 w-5': size === 'sm',
            'h-8 w-8': size === 'md',
            'h-10 w-10': size === 'lg',
          })}
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
