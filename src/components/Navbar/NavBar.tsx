import React from 'react'
import Button from '../Button'
import useStore from '~/store/useStore'
import { format, sub, add } from 'date-fns'
import ArrowButton from './ArrowButton'
import DropDown from './DropDown'

const NavBar = () => {
  const [currentDate, setCurrentDate, currentCalendarView] = useStore(
    (state) => [
      state.currentDate,
      state.setCurrentDate,
      state.currentCalendarView,
    ]
  )
  const handleSetToday = () => setCurrentDate(new Date())

  const goToPrevDay = () => setCurrentDate(sub(currentDate, { days: 1 }))
  const goToNextDay = () => setCurrentDate(add(currentDate, { days: 1 }))
  const goToPrevWeek = () => setCurrentDate(sub(currentDate, { weeks: 1 }))
  const goToNextWeek = () => setCurrentDate(add(currentDate, { weeks: 1 }))
  const goToPrevMonth = () => setCurrentDate(sub(currentDate, { months: 1 }))
  const goToNextMonth = () => setCurrentDate(add(currentDate, { months: 1 }))
  const goToPrevYear = () => setCurrentDate(sub(currentDate, { years: 1 }))
  const goToNextYear = () => setCurrentDate(add(currentDate, { years: 1 }))
  const goPrev = () => {
    if (currentCalendarView === 'Day') goToPrevDay()
    if (currentCalendarView === 'Week') goToPrevWeek()
    if (currentCalendarView === 'Month') goToPrevMonth()
    if (currentCalendarView === 'Year') goToPrevYear()
  }
  const goNext = () => {
    if (currentCalendarView === 'Day') goToNextDay()
    if (currentCalendarView === 'Week') goToNextWeek()
    if (currentCalendarView === 'Month') goToNextMonth()
    if (currentCalendarView === 'Year') goToNextYear()
  }

  return (
    <div className="relative z-20 flex h-14 w-full items-center gap-6 border-b p-4">
      <div className="relative w-24">
        <p className="text-lg font-bold tracking-wide text-gray-900">Fasti</p>
      </div>
      {currentCalendarView !== 'None' && (
        <div className="relative flex flex-row gap-6">
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
    </div>
  )
}

export default NavBar
