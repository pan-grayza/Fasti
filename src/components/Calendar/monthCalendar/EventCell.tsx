import clsx from 'clsx'
import DayEvent from '~/components/DayEvent'
import { useState } from 'react'
import useStore from '~/store/useStore'
import DayCell from '~/components/DayCell'
import type { dayEvent } from '@prisma/client'
import { api } from '~/utils/api'
import { format } from 'date-fns'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const EventCell: React.FC<Props> = ({ children, className, date }) => {
  //States
  const [
    currentDate,
    setCurrentDate,
    renamingEventNow,
    setRenamingEventNow,
    selectedCalendar,
  ] = useStore((state) => [
    state.currentDate,
    state.setCurrentDate,
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.selectedCalendar,
  ])
  const [events, setEvents] = useState(
    [] as { id: string; date: Date; name: string }[]
  )
  const [isCreatingDayEvent, setIsCreatingDayEvent] = useState(false)

  if (renamingEventNow === false && isCreatingDayEvent) {
    setIsCreatingDayEvent(false)
    const input = document.getElementById(
      'newDayEventInput'
    ) as HTMLInputElement
    input.value = ''
  }
  const [updatedEvent, setUpdatedEvent] = useState<{
    id: string
    date: Date
    name: string
  } | null>(null)

  //API stuff
  const { data: dayEvents, refetch: refetchDayEvents } =
    api.dayEvent.getAll.useQuery(
      {
        calendarId: selectedCalendar?.id ?? '',
      },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  //Throwing error
  // api.dayEvent.getAllFilteredByDate.useQuery(
  //   {
  //     date: date,
  //     calendarId: selectedCalendar?.id ?? '',
  //   },
  //   {
  //     enabled: date !== undefined && date !== null,
  //     onError: (err) => {
  //       console.log(err)
  //     },
  //   }
  // )
  const filteredDayEvents = dayEvents?.filter(
    (dayEvent) =>
      format(dayEvent.date, 'dd MMMM yyyy') === format(date, 'dd MMMM yyyy')
  )

  const createDayEvent = api.dayEvent.create.useMutation({
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
        {filteredDayEvents?.map((event, index) => {
          return (
            <DayEvent
              key={index}
              eventProps={event}
              onRenameSubmit={(newName: string) =>
                onRenameDayEvent(event.id, newName)
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
        {isCreatingDayEvent && (
          <div className="relative flex items-center">
            <input
              id="newDayEventInput"
              autoFocus
              className="relative flex h-6 w-full items-center rounded bg-sky-500 px-2 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  createDayEvent.mutate({
                    name:
                      e.currentTarget.value === ''
                        ? 'Event'
                        : e.currentTarget.value,
                    date: currentDate,
                    calendarId: selectedCalendar?.id ?? '',
                  })
                  e.currentTarget.value = ''
                  setIsCreatingDayEvent(false)
                  setRenamingEventNow(false)
                }
              }}
            />
            <div className="absolute left-0 top-full z-10 mt-2 flex w-full flex-row items-center gap-2">
              <button
                onClick={() => {
                  const input = document.getElementById(
                    'newDayEventInput'
                  ) as HTMLInputElement
                  createDayEvent.mutate({
                    date: currentDate,
                    name: input.value === '' ? 'Event' : input.value,
                    calendarId: selectedCalendar?.id ?? '',
                  })
                  input.value = ''
                  setIsCreatingDayEvent(false)
                  setRenamingEventNow(false)
                }}
                className="relative rounded bg-blue-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-blue-500"
              >
                Create
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById(
                    'newDayEventInput'
                  ) as HTMLInputElement
                  input.value = ''
                  setIsCreatingDayEvent(false)
                  setRenamingEventNow(false)
                }}
                className="rounded bg-red-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        onClick={() => {
          setIsCreatingDayEvent(true)
          setRenamingEventNow(true)
        }}
        className="relative h-full w-full"
      ></div>
    </div>
  )
}

export default EventCell
