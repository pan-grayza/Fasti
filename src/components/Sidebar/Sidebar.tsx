import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import useStore from '~/store/useStore'
import { api } from '~/utils/api'
interface Props {
  className?: string
}

const Sidebar: React.FC<Props> = ({ className }) => {
  const { data: sessionData } = useSession()
  const [selectedCalendar, setSelectedCalendar, sidebar] = useStore((state) => [
    state.selectedCalendar,
    state.setSelectedCalendar,
    state.sidebar,
  ])
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false)
  const { data: calendars, refetch: refetchCalendars } =
    api.calendar.getAll.useQuery(undefined, {
      onSuccess: (data) => {
        setSelectedCalendar(selectedCalendar ?? data[0] ?? null)
      },
      onError: (err) => {
        console.log(err)
      },
    })
  const createCalendar = api.calendar.create.useMutation({
    onSuccess: () => {
      void refetchCalendars()
    },
  })
  const deleteCalendar = api.calendar.delete.useMutation({
    onSuccess: () => {
      void refetchCalendars()
    },
  })
  return (
    <div
      className={clsx('relative z-10 flex h-full shrink-0 transition', {
        'w-48 animate-sidebarExpanding': sidebar,
        'w-8 animate-sidebarShrinking': !sidebar,
      })}
    >
      <div
        className={clsx(
          'absolute -left-40 top-0 flex h-full w-48 flex-col gap-1 overflow-y-auto border-r p-2 transition',
          { 'translate-x-40': sidebar, 'translate-x-0': !sidebar },
          className
        )}
      >
        {calendars?.map((calendar, index) => {
          return (
            <div
              className={clsx(
                'group relative flex h-8 w-full cursor-pointer flex-row items-center justify-between rounded px-2 py-1 transition',
                {
                  'bg-blue-300/50 text-blue-700': selectedCalendar === calendar,
                  'hover:bg-gray-100': selectedCalendar !== calendar,
                }
              )}
              key={index}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedCalendar(calendar)
              }}
            >
              <p>{calendar.calendarName}</p>
              <button
                onClick={() => {
                  deleteCalendar.mutate({
                    id: calendar.id,
                  })
                }}
                className={clsx('invisible transition ', {
                  'hover:text-red-500 group-hover:visible':
                    selectedCalendar !== calendar &&
                    calendar.calendarName !== sessionData?.user.name,
                })}
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
            </div>
          )
        })}
        <div className="relative flex h-8 w-full flex-col">
          <div
            onClick={() => setIsCreatingCalendar(true)}
            className="relative flex h-8 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-600 px-2 py-1 text-gray-700 transition hover:bg-gray-50"
          >
            <div className="text-gray relative mb-1 text-lg">+</div>
          </div>
          {isCreatingCalendar && (
            <div
              className={clsx(
                'absolute flex h-full w-full flex-row items-center justify-center transition',
                {
                  ' translate-x-full': !sidebar,
                }
              )}
            >
              <input
                autoFocus
                id="newCalendarInput"
                className="absolute inset-0 h-full w-full rounded px-1 py-2 outline-2 outline-blue-300 focus:outline-blue-300"
                type="text"
                placeholder="New calendar"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    createCalendar.mutate({
                      name: e.currentTarget.value,
                    })
                    e.currentTarget.value = ''
                    setIsCreatingCalendar(false)
                  }
                }}
              />
              <div className="absolute left-0 top-full z-10 mt-2 flex w-full flex-row items-center gap-2">
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      'newCalendarInput'
                    ) as HTMLInputElement
                    createCalendar.mutate({
                      name: input.value,
                    })
                    input.value = ''
                    setIsCreatingCalendar(false)
                  }}
                  className="relative rounded bg-blue-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-blue-500"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      'newCalendarInput'
                    ) as HTMLInputElement
                    input.value = ''
                    setIsCreatingCalendar(false)
                  }}
                  className="rounded bg-red-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
