import clsx from 'clsx'
import DayEvent from '~/components/DayEvent'
import { useState } from 'react'
import useStore from '~/store/useStore'
import DayCell from '~/components/DayCell'
import type { dayEvent } from '@prisma/client'
import { api } from '~/utils/api'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
  filteredDayEvents: dayEvent[] | undefined
  refetchDayEvents: () => unknown
}

const EventCell: React.FC<Props> = ({
  children,
  className,
  date,
  filteredDayEvents,
  refetchDayEvents,
}) => {
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
  const [isCreatingDayEvent, setIsCreatingDayEvent] = useState(false)

  if (renamingEventNow === false && isCreatingDayEvent) {
    setIsCreatingDayEvent(false)
    const input = document.getElementById(
      'newDayEventInput'
    ) as HTMLInputElement
    input.value = ''
  }

  //API stuff
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

  const createDayEvent = api.dayEvent.create.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  const updateDayEvent = api.dayEvent.update.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })
  const onRenameDayEvent = (id: string, name: string) => {
    updateDayEvent.mutate({
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
              refetchDayEvents={() => refetchDayEvents}
            />
          )
        })}
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
