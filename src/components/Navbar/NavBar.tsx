import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Button from '../Button'
import useStore from '~/store/useStore'
import { format, sub, add, startOfDay } from 'date-fns'
import ArrowButton from '../ArrowButton'
import DropDown from './DropDown'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Image from 'next/image'

const NavBar = () => {
  const [
    currentDate,
    setCurrentDate,
    currentCalendarView,
    isDarkTheme,
    setIsDarkTheme,
    menu,
    setMenu,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.currentCalendarView,
    state.isDarkTheme,
    state.setIsDarkTheme,
    state.menu,
    state.setMenu,
  ])
  const { data: session } = useSession()

  const { asPath } = useRouter()

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
    <div
      className={clsx(
        'relative flex h-14 w-full flex-row items-center gap-4 border-b p-4 transition-colors md:gap-6',
        {
          'border-lightThemeBorder': !isDarkTheme,
          'border-darkThemeBorder': isDarkTheme,
        }
      )}
    >
      <div
        onClick={() => setMenu(true)}
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

      <div className="hidden w-24 md:relative">
        <p
          className={clsx('text-lg font-bold tracking-wide', {
            'text-darkThemeText': isDarkTheme,
            'text-lightThemeText': !isDarkTheme,
          })}
        >
          Fasti
        </p>
      </div>

      {asPath === '/calendar' && (
        <div className="relative z-10 flex h-full w-full flex-row items-center justify-between md:gap-6">
          <div className="relative flex flex-row items-center justify-center gap-1 md:gap-4">
            <Button onClick={handleSetToday}>Today</Button>
            <div className="flex items-center">
              <ArrowButton onClick={() => goPrev()} direction="left" />
              <ArrowButton onClick={() => goNext()} direction="right" />
            </div>

            <p className="relative w-max text-base md:text-lg">
              <span className="text-base">
                {currentCalendarView === 'Year' && format(currentDate, 'yyyy')}
              </span>
              {currentCalendarView === 'Month' &&
                format(currentDate, 'LLLL yyyy')}
              {currentCalendarView === 'Week' &&
                format(currentDate, 'LLLL yyyy')}
              {currentCalendarView === 'Day' && format(currentDate, 'dd LLLL')}
            </p>
            <div className="hidden md:relative">
              <DropDown />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            {!session && (
              <div className="relative flex h-full w-full flex-row items-center justify-center gap-4">
                <Button
                  onClick={() =>
                    void signIn(undefined, { callbackUrl: '/calendar' })
                  }
                >
                  Sign in
                </Button>
              </div>
            )}
            {session?.user.image && (
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                <Image
                  width={32}
                  height={32}
                  src={session.user.image}
                  alt="Picture of the user"
                  className="rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar
