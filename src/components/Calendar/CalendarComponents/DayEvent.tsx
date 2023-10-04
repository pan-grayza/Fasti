import clsx from 'clsx'
import { useState } from 'react'
import useStore from '~/store/useStore'
import type { dayEvent } from '@prisma/client'
import { api } from '~/utils/api'
import { getDay } from 'date-fns'

interface Props {
  className?: string
  eventProps: dayEvent
  type?: 'day' | 'week' | 'month'
  refetchDayEvents: () => unknown
}

const Event: React.FC<Props> = ({
  className,
  eventProps,
  type = 'month',
  refetchDayEvents,
}) => {
  const [
    renamingEventNow,
    setRenamingEventNow,
    creatingEventNow,
    setCreatingEventNow,
    isDarkTheme,
  ] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.creatingEventNow,
    state.setCreatingEventNow,
    state.isDarkTheme,
  ])

  //API stuff

  const updateDayEvent = api.dayEvent.update.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })

  const deleteDayEvent = api.dayEvent.delete.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      void refetchDayEvents()
    },
  })

  //Position stuff
  const [colIndex, setColIndex] = useState(
    type === 'day' ? 0 : getDay(eventProps.date)
  )

  //Updating event

  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState(eventProps.name)

  const finishUpdating = () => {
    if (name === '') setName('Event')
    setIsRenaming(false)
    setRenamingEventNow(false)
    updateDayEvent.mutate({
      id: eventProps.id,
      calendarId: eventProps.calendarId,
      newName: name,
    })
  }
  if (!renamingEventNow && isRenaming) {
    setIsRenaming(false)
  }

  const onRename = () => {
    if (creatingEventNow) setCreatingEventNow(false)
    setRenamingEventNow(true)
    setIsRenaming(true)
  }
  return (
    <div
      className={clsx('relative flex h-6 w-full', {
        'z-20': isRenaming,
      })}
    >
      <div
        onClick={onRename}
        className={clsx(
          'relative flex h-6 w-full items-center rounded bg-blue-400 px-2 pb-1 text-white',
          className
        )}
      >
        {eventProps.name}
      </div>
      {isRenaming && (
        <div
          className={clsx(
            'absolute inset-0 z-10 flex h-full w-full items-start drop-shadow',
            {
              'ml-1 justify-start translate-x-full': colIndex < 4,
              '-ml-1 justify-end -translate-x-full': colIndex > 3,
            }
          )}
        >
          <div
            className={clsx('relative flex flex-col gap-1 rounded p-1', {
              'bg-lightThemeBG': !isDarkTheme,
              'bg-darkThemeBG': isDarkTheme,
            })}
          >
            <div className="relative flex h-fit w-full items-center justify-end gap-1">
              <button
                onClick={() =>
                  deleteDayEvent.mutate({
                    id: eventProps.id,
                    calendarId: eventProps.calendarId,
                  })
                }
                className="relative flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
              <button
                onClick={() => finishUpdating()}
                className="relative flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              autoFocus
              onChange={(e) => setName(e.target.value)}
              value={name}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  finishUpdating()
                }
              }}
              className={clsx('relative w-48 rounded p-1 focus:outline-none', {
                'bg-white': !isDarkTheme,
                'bg-darkThemeBG': isDarkTheme,
              })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Event
