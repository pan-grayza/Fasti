import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Button from '../Button'
import useStore from '~/store/useStore'
import { format, sub, add, startOfDay } from 'date-fns'
import ArrowButton from '../ArrowButton'
import DropDown from './DropDown'
import clsx from 'clsx'

const NavBar = () => {
  const [
    currentDate,
    setCurrentDate,
    currentCalendarView,
    sidebar,
    setSidebar,
    isDarkTheme,
    setIsDarkTheme,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.currentCalendarView,
    state.sidebar,
    state.setSidebar,
    state.isDarkTheme,
    state.setIsDarkTheme,
  ])
  const { data: session } = useSession()

  // console.log(session)

  const handleSetToday = () => setCurrentDate(startOfDay(new Date()))

  const goPrev = () => {
    if (currentCalendarView === 'Day')
      setCurrentDate(sub(currentDate, { days: 1 }))
    if (currentCalendarView === 'Week')
      setCurrentDate(sub(currentDate, { weeks: 1 }))
    if (currentCalendarView === 'Month')
      setCurrentDate(sub(currentDate, { months: 1 }))
    if (currentCalendarView === 'Year')
      setCurrentDate(sub(currentDate, { years: 1 }))
  }
  const goNext = () => {
    if (currentCalendarView === 'Day')
      setCurrentDate(add(currentDate, { days: 1 }))
    if (currentCalendarView === 'Week')
      setCurrentDate(add(currentDate, { weeks: 1 }))
    if (currentCalendarView === 'Month')
      setCurrentDate(add(currentDate, { months: 1 }))
    if (currentCalendarView === 'Year')
      setCurrentDate(add(currentDate, { years: 1 }))
  }

  return (
    <div className="relative flex h-14 w-full flex-row items-center gap-6 border-b p-4">
      {currentCalendarView !== 'None' && (
        <div
          onClick={() => setSidebar(!sidebar)}
          className="relative flex cursor-pointer items-center justify-center p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
      )}

      <div className="relative w-24">
        <p className="text-lg font-bold tracking-wide text-gray-900">Fasti</p>
      </div>

      {currentCalendarView !== 'None' && (
        <div className="relative z-10 flex h-full w-full flex-row gap-6">
          <div className="flex flex-row items-center justify-center gap-4">
            <Button onClick={handleSetToday}>Today</Button>
            <div className="flex items-center">
              <ArrowButton onClick={() => goPrev()} direction="left" />
              <ArrowButton onClick={() => goNext()} direction="right" />
            </div>

            <p className="text-lg">
              {currentCalendarView === 'Year' && format(currentDate, 'yyyy')}
              {currentCalendarView === 'Month' &&
                format(currentDate, 'LLLL yyyy')}
              {currentCalendarView === 'Week' &&
                format(currentDate, 'LLLL yyyy')}
              {currentCalendarView === 'Day' &&
                format(currentDate, 'dd LLLL yyyy')}
            </p>
          </div>

          <DropDown />
        </div>
      )}
      <button
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="relative flex h-8 w-8 items-center justify-center"
      >
        <div
          className={clsx(
            '-left absolute z-[-9999] h-8 w-8 rounded-full bg-gray-800 transition',
            { 'scale-[10000%]': isDarkTheme }
          )}
        />
        {isDarkTheme ? (
          // Sun
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-yellow-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        ) : (
          // Moon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-yellow-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        )}
      </button>

      {!session && (
        <div className="relative flex h-full w-full flex-row items-center justify-end gap-4">
          <button
            onClick={() => void signIn(undefined, { callbackUrl: '/calendar' })}
          >
            Sign in
          </button>
        </div>
      )}
      {session && (
        <div className="relative flex h-full w-full flex-row items-center justify-end gap-4">
          Signed in as {session.user?.name}
          <button onClick={() => void signOut()}>Sign Out</button>
        </div>
      )}
    </div>
  )
}

export default NavBar
