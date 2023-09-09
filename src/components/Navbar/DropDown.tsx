import { useState } from 'react'
import useStore from '~/store/useStore'
import clsx from 'clsx'

interface DropDownProps {
  className?: string
}
interface DropDownButtonProps extends React.PropsWithChildren {
  onClick?: () => void
  className?: string
}

const DropDownButton: React.FC<DropDownButtonProps> = ({
  onClick = () => null,
  children,
  className,
}) => {
  return (
    <button
      onClick={() => onClick()}
      className={clsx('flex h-8 w-full bg-gray-200/0 p-1', className)}
    >
      {children}
    </button>
  )
}

const DropDown: React.FC<DropDownProps> = ({ className }) => {
  const [currentCalendarView, setCurrentCalendarView, isDarkTheme] = useStore(
    (state) => [
      state.currentCalendarView,
      state.setCurrentCalendarView,
      state.isDarkTheme,
    ]
  )

  const [isDropDown, setIsDropDown] = useState(false)

  return (
    <div className="relative flex items-center justify-center">
      <div
        className={clsx(
          'flex w-24 cursor-pointer select-none flex-row items-center justify-between gap-2 rounded border-2 p-2 transition',
          {
            'border-lightBorder': !isDarkTheme,
            'border-darkBorder': isDarkTheme,
          }
        )}
        onClick={() => setIsDropDown(!isDropDown)}
      >
        {currentCalendarView}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx('h-5 w-5 transition', isDropDown && 'rotate-180')}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      <div className="absolute left-0 top-12">
        {isDropDown && (
          <div
            className={clsx(
              'absolute inset-0 flex h-max w-32 animate-appearFromTopLeft flex-col rounded py-1 drop-shadow-xl',
              {
                'bg-lightBG': !isDarkTheme,
                'bg-darkBG': isDarkTheme,
              }
            )}
          >
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Day')
                setIsDropDown(false)
              }}
              className={clsx({
                'hover:bg-lightHover': !isDarkTheme,
                'hover:bg-darkHover': isDarkTheme,
              })}
            >
              Day
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Week')
                setIsDropDown(false)
              }}
              className={clsx({
                'hover:bg-lightHover': !isDarkTheme,
                'hover:bg-darkHover': isDarkTheme,
              })}
            >
              Week
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Month')
                setIsDropDown(false)
              }}
              className={clsx({
                'hover:bg-lightHover': !isDarkTheme,
                'hover:bg-darkHover': isDarkTheme,
              })}
            >
              Month
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Year')
                setIsDropDown(false)
              }}
              className={clsx({
                'hover:bg-lightHover': !isDarkTheme,
                'hover:bg-darkHover': isDarkTheme,
              })}
            >
              Year
            </DropDownButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default DropDown
