import clsx from 'clsx'
import DayEvent from '../../components/DayEvent'
import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'
import { v4 as uuidv4 } from 'uuid'
import DayCell from '../../components/DayCell'

interface Props extends React.PropsWithChildren {
    className?: string
    date: Date
}

const EventCell: React.FC<Props> = ({ children, className, date }) => {
    const loadEvents = () => {}
    useEffect(() => {
        loadEvents
    }, [])

    const [events, setEvents] = useState([] as { id: string; date: Date }[])
    const [currentDate, setCurrentDate, renamingEventNow, setRenamingEventNow] =
        useStore((state) => [
            state.currentDate,
            state.setCurrentDate,
            state.renamingEventNow,
            state.setRenamingEventNow,
        ])

    const createEvent = () => {
        if (renamingEventNow === true) {
            setRenamingEventNow(false)
        } else {
            setRenamingEventNow(true)
            setEvents([...events, { id: uuidv4(), date: date }])
        }
    }
    const deleteEvent = (id: string) => {
        setEvents(events.filter((event) => event.id !== id))
        setRenamingEventNow(false)
    }

    return (
        <div
            onClick={() => setCurrentDate(date)}
            className={clsx(
                'flex-col relative select-none items-center flex transition-colors cursor-pointer border-l border-b p-1',
                className
            )}
        >
            <DayCell date={date}>{children}</DayCell>

            <div className="relative flex flex-col items-center justify-center w-full gap-y-1 h-22">
                {events.map((event, index) => (
                    <DayEvent
                        key={event.id}
                        onDelete={() => deleteEvent(event.id)}
                    />
                ))}
            </div>
            <div
                onClick={() => createEvent()}
                className="relative w-full h-full"
            ></div>
        </div>
    )
}

export default EventCell
