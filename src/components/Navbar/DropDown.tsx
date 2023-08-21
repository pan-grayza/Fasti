import { useState } from 'react'
import useStore from '../../store/useStore'
import clsx from 'clsx'

interface DropDownButtonProps extends React.PropsWithChildren {
  onClick?: () => void
}

const DropDownButton: React.FC<DropDownButtonProps> = ({
  onClick = () => null,
  children,
}) => {
  return (
    <button
      onClick={() => onClick()}
      className="flex h-8 w-full bg-gray-200/0 p-1 hover:bg-gray-200/50"
    >
      {children}
    </button>
  )
}

const DropDown = () => {
  const [currentCalendarView, setCurrentCalendarView] = useStore((state) => [
    state.currentCalendarView,
    state.setCurrentCalendarView,
  ])

  const [isDropDown, setIsDropDown] = useState(false)

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="flex w-24 cursor-pointer select-none flex-row items-center justify-between gap-2 rounded border-2 border-gray-100 p-2 transition active:bg-gray-200/50"
        onClick={() => setIsDropDown(!isDropDown)}
      >
        {currentCalendarView}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={clsx('h-5 w-5', isDropDown && 'rotate-180')}
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
          <div className="absolute inset-0 flex h-max w-32 animate-appearFromTopLeft flex-col rounded bg-white py-1 drop-shadow-xl">
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Day')
                setIsDropDown(false)
              }}
            >
              Day
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Week')
                setIsDropDown(false)
              }}
            >
              Week
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Month')
                setIsDropDown(false)
              }}
            >
              Month
            </DropDownButton>
            <DropDownButton
              onClick={() => {
                setCurrentCalendarView('Year')
                setIsDropDown(false)
              }}
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
