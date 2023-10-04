import clsx from 'clsx'
import DayEvent from '../CalendarComponents/DayEvent'
import useStore from '~/store/useStore'
import DayCell from '~/components/Calendar/CalendarComponents/DayCell'
import type { dayEvent } from '@prisma/client'
import DayEventCreator from '../CalendarComponents/DayEventCreator'
import { useState } from 'react'

interface Props {
  className?: string
  date: Date
  filteredDayEvents: dayEvent[] | undefined
  refetchDayEvents: () => unknown
}

const EventCell: React.FC<Props> = ({
  className,
  date,
  filteredDayEvents,
  refetchDayEvents,
}) => {
  //States
  const [
    setCurrentDate,
    renamingEventNow,
    setRenamingEventNow,
    creatingEventNow,
    setCreatingEventNow,
  ] = useStore((state) => [
    state.setCurrentDate,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.creatingEventNow,
    state.setCreatingEventNow,
  ])
  const [isCreatingDayEvent, setIsCreatingDayEvent] = useState(false)
  if (!creatingEventNow && isCreatingDayEvent) {
    setIsCreatingDayEvent(false)
  }

  return (
    <div
      onClick={() => setCurrentDate(date)}
      className={clsx(
        'relative flex cursor-pointer select-none flex-col items-center gap-1 border-b border-l p-1 transition-colors',
        className
      )}
    >
      <DayCell date={date}></DayCell>
      <div
        className={clsx('flex w-full flex-col items-center justify-center ', {
          'absolute -top-1': (filteredDayEvents?.length ?? 0) < 1,
          'relative gap-y-1': (filteredDayEvents?.length ?? -1) > 0,
        })}
      >
        {filteredDayEvents?.map((event, index) => {
          return (
            <DayEvent
              key={index}
              eventProps={event}
              refetchDayEvents={refetchDayEvents}
            />
          )
        })}
      </div>
      {isCreatingDayEvent && <DayEventCreator date={date} />}
      <div
        onClick={() => {
          if (renamingEventNow || creatingEventNow) {
            setRenamingEventNow(false)
            setCreatingEventNow(false)
            setIsCreatingDayEvent(false)
          } else {
            setCreatingEventNow(true)
            setRenamingEventNow(true)
            setIsCreatingDayEvent(true)
          }
        }}
        className="relative h-full w-full"
      ></div>
    </div>
  )
}

export default EventCell
