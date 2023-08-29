import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Button from '../Button'
import useStore from '~/store/useStore'
import { format, sub, add, startOfDay } from 'date-fns'
import ArrowButton from './ArrowButton'
import DropDown from './DropDown'

const NavBar = () => {
  const [
    currentDate,
    setCurrentDate,
    currentCalendarView,
    setCurrentCalendarView,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.currentCalendarView,
    state.setCurrentCalendarView,
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
    <div className="relative z-20 flex h-14 w-full items-center gap-6 border-b p-4">
      <div className="relative w-24">
        <p className="text-lg font-bold tracking-wide text-gray-900">Fasti</p>
      </div>

      {currentCalendarView !== 'None' && (
        <div className="relative flex h-full w-full flex-row gap-6">
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

      {currentCalendarView === 'None' && !session && (
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
