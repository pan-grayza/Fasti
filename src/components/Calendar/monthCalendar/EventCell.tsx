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
    editingWithModal,
    setEditingWithModal,
    creatingWithModal,
    setCreatingWithModal,
  ] = useStore((state) => [
    state.setCurrentDate,
    state.editingWithModal,
    state.setEditingWithModal,
    state.creatingWithModal,
    state.setCreatingWithModal,
  ])
  const [isCreatingDayEvent, setIsCreatingDayEvent] = useState(false)
  if (
    (!editingWithModal && isCreatingDayEvent) ||
    (!creatingWithModal && isCreatingDayEvent)
  ) {
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
      <DayCell date={date} />
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
          if (editingWithModal ?? creatingWithModal) {
            setIsCreatingDayEvent(false)
            setEditingWithModal(null)
            setCreatingWithModal(null)
          } else {
            console.log('Creating...')
            setIsCreatingDayEvent(true)
            setEditingWithModal('DayEvent')
            setCreatingWithModal('DayEvent')
          }
        }}
        className="relative h-full w-full"
      ></div>
    </div>
  )
}

export default EventCell
