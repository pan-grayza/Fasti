import React, { useState } from 'react'
import Schedule from './Schedule'
import useStore from '../../store/useStore'
import DayEvent from '../../components/DayEvent'
import { format } from 'date-fns'
import DayCell from '../../components/DayCell'

const DayCalendar = () => {
    const [currentDate, setCurrentDate, renamingEventNow, setRenamingEventNow] =
        useStore((state) => [
            state.currentDate,
            state.setCurrentDate,
            state.renamingEventNow,
            state.setRenamingEventNow,
        ])
    const [events, setEvents] = useState([] as { id: string; date: Date }[])
    const deleteDayEvent = (id: string) => {
        setEvents(events.filter((event) => event.id !== id))
        setRenamingEventNow(false)
    }
    return (
        <div className="flex flex-col w-full h-full relative">
            <div className="flex w-fit flex-col relative py-4 px-16 items-center justify-center">
                <p className="uppercase font-semibold text-blue-600">
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
