import React, { useState } from 'react'
import Schedule from './Schedule'
import useStore from '~/store/useStore'
import DayEvent from '../../DayEvent'
import { format } from 'date-fns'
import DayCell from '../../DayCell'
import type { dayEvent } from '@prisma/client'

const DayCalendar = () => {
  const [currentDate, setRenamingEventNow] = useStore((state) => [
    state.currentDate,
    state.setRenamingEventNow,
  ])
  const deleteDayEvent = (id: string) => {
    setRenamingEventNow(false)
  }
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="relative flex w-fit flex-col items-center justify-center px-16 py-4">
        <DayCell date={currentDate} size="md" dayAbr />
      </div>
      <Schedule date={currentDate} />
    </div>
  )
}

export default DayCalendar
