import clsx from 'clsx'
import DayEvent from '~/components/DayEvent'
import { useCallback, useState } from 'react'
import useStore from '~/store/useStore'
import { v4 as uuidv4 } from 'uuid'
import DayCell from '~/components/DayCell'
import type { dayEvent } from '@prisma/client'
import { api } from '~/utils/api'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
  refetchDayEvents: () => unknown
  dayEvents: dayEvent[] | undefined
}

const EventCell: React.FC<Props> = ({
  children,
  className,
  date,
  refetchDayEvents,
  dayEvents,
}) => {
  const [events, setEvents] = useState(
    [] as { id: string; date: Date; name: string }[]
  )
  const [updatedEvent, setUpdatedEvent] = useState<{
    id: string
    date: Date
    name: string
  } | null>(null)
  const [
    setCurrentDate,
    renamingEventNow,
    setRenamingEventNow,
    selectedCalendar,
  ] = useStore((state) => [
    state.setCurrentDate,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.selectedCalendar,
  ])
  //API stuff
  const utils = api.useContext()

  const createDayEvent = api.dayEvent.create.useMutation({
    //Optimistic update (not working)

    // onMutate: async (newDayEvent) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await utils.dayEvent.getAll.cancel()

    //   // Snapshot the previous value
    //   const previousDayEvents = utils.dayEvent.getAll.getData()

    //   // Optimistically update to the new value
    //   utils.dayEvent.getAll.setData(
    //     { calendarId: selectedCalendar?.id ?? '' },
    //     (oldQueryData: dayEvent[] | undefined) =>
    //       [
    //         ...(oldQueryData ?? []),
    //         {
    //           name: newDayEvent.name,
    //           date: date,
    //           calendarId: selectedCalendar,
    //         },
    //       ] as dayEvent[]
    //   )

    //   // Return a context object with the snapshotted value
    //   return { previousDayEvents }
    // },
    // onSuccess: () => {
    //   console.log('Success')
    // },
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  const renameDayEvent = api.dayEvent.rename.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  const onRenameDayEvent = (id: string, name: string) => {
    renameDayEvent.mutate({
      id: id,
      newName: name,
      calendarId: selectedCalendar?.id ?? '',
    })
  }
  const deleteDayEvent = api.dayEvent.delete.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  const handleCreateDayEvent = useCallback(() => {
    createDayEvent.mutate({
      date: date,
      name: 'New Event',
      calendarId: selectedCalendar?.id ?? '',
    })
  }, [createDayEvent, selectedCalendar, date])
  // Local stuff
  const createEvent = () => {
    if (renamingEventNow === true) {
      setRenamingEventNow(false)
    } else {
      setRenamingEventNow(true)
      setEvents([...events, { id: uuidv4(), date: date, name: 'New Event' }])
    }
  }
  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    setRenamingEventNow(false)
  }

  const onUpdate = (id: string, date: Date, name: string) => {
    setRenamingEventNow(false)
    setUpdatedEvent({ id: id, date: date, name: name })
    const index = events.findIndex((e) => e.id === id)
    if (updatedEvent && events) {
      setEvents([...events, (events[index] = updatedEvent)])
    }
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
        {dayEvents?.map((event, index) => {
          return (
            <DayEvent
              key={index}
              eventProps={event}
              onRenameSubmit={(name: string) =>
                onRenameDayEvent(event.id, name)
              }
              onDelete={() =>
                deleteDayEvent.mutate({
                  id: event.id,
                  calendarId: event.calendarId,
                })
              }
            />
          )
        })}
      </div>
      <div
        onClick={handleCreateDayEvent}
        className="relative h-full w-full"
      ></div>
    </div>
  )
}

export default EventCell
