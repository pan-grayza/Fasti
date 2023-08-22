import React, { useState } from 'react'
import Schedule from './Schedule'
import useStore from '~/store/useStore'
import DayEvent from '../../DayEvent'
import { format } from 'date-fns'
import DayCell from '../../DayCell'

const DayCalendar = () => {
  const [currentDate, setRenamingEventNow] = useStore((state) => [
    state.currentDate,
    state.setRenamingEventNow,
  ])
  const [events, setEvents] = useState([] as { id: string; date: Date }[])
  const deleteDayEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    setRenamingEventNow(false)
  }
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="relative flex w-fit flex-col items-center justify-center px-16 py-4">
        <p className="font-semibold uppercase text-blue-600">
          {format(currentDate, 'E')}
        </p>
        <DayCell date={currentDate} size="md" />
      </div>
      {/* <div className="relative flex flex-col items-center justify-center w-full gap-y-1 h-12 bg-slate-500">
                {events.map((event, index) => (
                    <DayEvent
                        key={event.id}
                        onDelete={() => deleteDayEvent(event.id)}
                    />
                ))}
            </div> */}
      <Schedule date={currentDate} />
    </div>
  )
}

export default DayCalendar
