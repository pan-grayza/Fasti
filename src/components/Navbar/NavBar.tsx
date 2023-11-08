import React, { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Button from '../Button'
import useStore from '~/store/useStore'
import { format, sub, add, startOfDay } from 'date-fns'
import ArrowButton from '../ArrowButton'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import Image from 'next/image'

const NavBar = () => {
  const [currentDate, setCurrentDate, isDarkTheme, setIsDarkTheme, setMenu] =
    useStore((state) => [
      state.currentDate,
      state.setCurrentDate,
      state.isDarkTheme,
      state.setIsDarkTheme,
      state.setMenu,
    ])
  const [accountInfoModal, setAccountInfoModal] = useState(false)

  const { data: session } = useSession()

  const { asPath } = useRouter()

  const handleSetToday = () => setCurrentDate(startOfDay(new Date()))

  const goPrev = () => {
    if (asPath === '/calendar/day') {
      setCurrentDate(sub(currentDate, { days: 1 }))
    } else if (asPath === '/calendar/week') {
      setCurrentDate(sub(currentDate, { weeks: 1 }))
    } else if (asPath === '/calendar/month') {
      setCurrentDate(sub(currentDate, { months: 1 }))
    } else if (asPath === '/calendar/year') {
      setCurrentDate(sub(currentDate, { years: 1 }))
    }
  }
  const goNext = () => {
    if (asPath === '/calendar/day') {
      setCurrentDate(add(currentDate, { days: 1 }))
    } else if (asPath === '/calendar/week') {
      setCurrentDate(add(currentDate, { weeks: 1 }))
    } else if (asPath === '/calendar/month') {
      setCurrentDate(add(currentDate, { months: 1 }))
    } else if (asPath === '/calendar/year') {
      setCurrentDate(add(currentDate, { years: 1 }))
    }
  }
  return (
    <div
      className={clsx(
        'relative z-20 flex h-14 w-full flex-row items-center justify-between gap-4 border-b p-4 transition-colors md:gap-6',
        {
          'border-lightThemeBorder': !isDarkTheme,
          'border-darkThemeBorder': isDarkTheme,
        }
      )}
    >
      <div className="relative flex w-full flex-row items-center gap-4">
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

        {asPath.startsWith('/calendar') && (
          <div className="relative z-10 flex h-full w-full flex-row items-center justify-between md:gap-6">
            <div className="relative flex flex-row items-center justify-center gap-4">
              <Button onClick={handleSetToday}>Today</Button>
              <div className="hidden items-center md:flex">
                <ArrowButton onClick={() => goPrev()} direction="left" />
                <ArrowButton onClick={() => goNext()} direction="right" />
              </div>

              <p className="relative flex h-fit w-fit flex-row items-center justify-center md:text-lg">
                {asPath === '/calendar/year' && format(currentDate, 'yyyy')}
                {asPath === '/calendar/month' &&
                  format(currentDate, 'LLLL yyyy')}
                {asPath === '/calendar/week' &&
                  format(currentDate, 'LLLL yyyy')}
                {asPath === '/calendar/day' && format(currentDate, 'dd LLLL')}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center">
        {!session && (
          <div className="relative flex h-full w-full flex-row items-center justify-center gap-4">
            <Button
              onClick={() =>
                void signIn(undefined, { callbackUrl: '/calendar' })
              }
              className="relative w-max"
            >
              Sign in
            </Button>
          </div>
        )}
        {session?.user.image ? (
          <div
            onClick={() => setAccountInfoModal(!accountInfoModal)}
            className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
          >
            <Image
              width={32}
              height={32}
              src={session.user.image}
              alt="Picture of the user"
              className="rounded-full"
            />
          </div>
        ) : (
          <div className="relative h-8 w-8 rounded-full bg-neutral-400" />
        )}
      </div>
      {accountInfoModal && (
        <div
          className={clsx(
            'z-90 absolute right-0 top-14 flex flex-col rounded p-1 drop-shadow transition',
            {
              'bg-darkThemeSecondaryBG': isDarkTheme,
              'bg-lightThemeSecondaryBG': !isDarkTheme,
            }
          )}
        >
          <button
            className={clsx('relative w-full rounded px-2 py-1', {
              'hover:bg-darkThemeHover': isDarkTheme,
              'hover:bg-lightThemeHover': !isDarkTheme,
            })}
            onClick={() => setIsDarkTheme(!isDarkTheme)}
          >
            Change Theme
          </button>
          <button
            className={clsx('relative w-full rounded px-2 py-1 text-rose-500', {
              'hover:bg-darkThemeHover': isDarkTheme,
              'hover:bg-lightThemeHover': !isDarkTheme,
            })}
            onClick={() => void signOut()}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default NavBar
