import clsx from 'clsx'
import { getDay } from 'date-fns'
import { useEffect, useState } from 'react'
import useStore from '~/store/useStore'

import { api } from '~/utils/api'

interface Props {
  className?: string
  date: Date
  type?: 'week' | 'day' | 'month'
}

const DayEventCreator: React.FC<Props> = ({
  className,
  date,
  type = 'month',
}) => {
  const [selectedCalendar, setCreatingWithModal, isDarkTheme] = useStore(
    (state) => [
      state.selectedCalendar,
      state.setCreatingWithModal,
      state.isDarkTheme,
    ]
  )

  const colIndex = type === 'day' ? 0 : getDay(date)
  //API stuff
  const { refetch: refetchDayEvents } = api.dayEvent.getAll.useQuery(
    { calendarId: selectedCalendar?.id ?? '' },
    {
      onError: (err) => {
        console.log(err)
      },
    }
  )
  const createDayEvent = api.dayEvent.create.useMutation({
    onSuccess: () => {
      void refetchDayEvents()
    },
  })

  //Position stuff

  //Editing Event
  //Renaming
  const [name, setName] = useState('')

  const finishCreating = () => {
    if (name === '') setName('Event')
    createDayEvent.mutate({
      date: date,
      calendarId: selectedCalendar?.id ?? '',
      name: name,
    })
    setCreatingWithModal(null)
  }
  return (
    <div
      className={clsx(
        'relative z-10 h-6 w-full cursor-pointer rounded bg-blue-400',
        className
      )}
    >
      <div className="relative flex h-6 items-center px-2 text-white">
        <p>{name}</p>
      </div>
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
              onClick={() => {
                setName('')
                setCreatingWithModal(null)
              }}
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
                finishCreating()
              }
              if (e.key === 'Escape') {
                setName('')
                setCreatingWithModal(null)
              }
            }}
            className={clsx('relative w-48 rounded p-1 focus:outline-none', {
              'bg-lightThemeSecondaryBG': !isDarkTheme,
              'bg-darkThemeSecondaryBG': isDarkTheme,
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default DayEventCreator
