import clsx from 'clsx'
import DayEvent from '~/components/DayEvent'
import { useState } from 'react'
import useStore from '~/store/useStore'
import { v4 as uuidv4 } from 'uuid'
import DayCell from '~/components/DayCell'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const EventCell: React.FC<Props> = ({ children, className, date }) => {
  const [events, setEvents] = useState([] as { id: string; date: Date }[])
  const [setCurrentDate, renamingEventNow, setRenamingEventNow] = useStore(
    (state) => [
      state.setCurrentDate,
      state.renamingEventNow,
      state.setRenamingEventNow,
    ]
  )

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
        'relative flex cursor-pointer select-none flex-col items-center border-b border-l p-1 transition-colors',
        className
      )}
    >
      <DayCell date={date}>{children}</DayCell>

      <div className="h-22 relative flex w-full flex-col items-center justify-center gap-y-1">
        {events.map((event, index) => (
          <DayEvent key={event.id} onDelete={() => deleteEvent(event.id)} />
        ))}
      </div>
      <div
        onClick={() => createEvent()}
        className="relative h-full w-full"
      ></div>
    </div>
  )
}

export default EventCell
