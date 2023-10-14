import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import useStore from '~/store/useStore'
import { api } from '~/utils/api'
import MonthCell from './MonthCell'
interface Props {
  className?: string
}

const Sidebar: React.FC<Props> = ({ className }) => {
  const { data: sessionData } = useSession()
  const [
    currentDate,
    selectedCalendar,
    setSelectedCalendar,
    sidebar,
    setSidebar,
    isDarkTheme,
    currentCalendarView,
  ] = useStore((state) => [
    state.currentDate,
    state.selectedCalendar,
    state.setSelectedCalendar,
    state.sidebar,
    state.setSidebar,
    state.isDarkTheme,
    state.currentCalendarView,
  ])
  const [isCreatingCalendar, setIsCreatingCalendar] = useState(false)
  const { data: calendars, refetch: refetchCalendars } =
    api.calendar.getAll.useQuery(undefined, {
      onSuccess: (data) => {
        if (data.length === 0 && sessionData)
          createCalendar.mutate({ name: sessionData.user.name ?? '' })
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
    <>
      {sessionData && (
        <div
          className={clsx('relative flex h-full shrink-0', {
            'w-60 animate-sidebarExpanding': sidebar,
            'w-10 animate-sidebarShrinking':
              !sidebar && currentCalendarView === 'Month',
            'w-0 animate-sidebarShrinking':
              !sidebar && currentCalendarView !== 'Month',
          })}
        >
          <div
            onClick={() => setSidebar(!sidebar)}
            className={clsx(
              'absolute left-0 top-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform',
              {
                'translate-x-[12.5rem]': sidebar,
                'translate-x-1': !sidebar,
                'hover:bg-darkThemeHover': isDarkTheme,
                'hover:bg-lightThemeHover': !isDarkTheme,
              }
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={clsx('h-6 w-6 transition', {
                'rotate-y-[180deg]': !sidebar,
                'rotate-y-[0deg]': sidebar,
              })}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
              />
            </svg>
          </div>
          <div
            className={clsx(
              'absolute -left-60 top-0 flex h-full w-60 flex-col items-center gap-1 overflow-y-auto p-2 transition-transform duration-100',
              { 'translate-x-60': sidebar, 'translate-x-0': !sidebar },
              className
            )}
          >
            <div className="relative h-8 w-full"></div>

            <MonthCell size="xs" sidebar monthDate={currentDate} />
            <div className="relative flex h-fit w-full flex-col gap-1">
              {calendars?.map((calendar, index) => {
                return (
                  <div
                    className={clsx(
                      'group relative flex h-8 w-full cursor-pointer flex-row items-center justify-between rounded px-2 py-1 transition duration-300',
                      {
                        'bg-lightThemeSelected text-blue-700':
                          JSON.stringify(selectedCalendar) ===
                            JSON.stringify(calendar) && !isDarkTheme,
                        'hover:bg-lightThemeHover':
                          JSON.stringify(selectedCalendar) !==
                            JSON.stringify(calendar) && !isDarkTheme,

                        'bg-darkThemeSelected text-blue-100':
                          JSON.stringify(selectedCalendar) ===
                            JSON.stringify(calendar) && isDarkTheme,
                        'hover:bg-darkThemeHover':
                          JSON.stringify(selectedCalendar) !==
                            JSON.stringify(calendar) && isDarkTheme,
                      }
                    )}
                    key={index}
                    onClick={(e) => {
                      if (e.target === e.currentTarget)
                        setSelectedCalendar(calendar)
                    }}
                  >
                    <p>{calendar.name}</p>
                    <button
                      onClick={() => {
                        deleteCalendar.mutate({ id: calendar.id })
                      }}
                      className={clsx('invisible transition', {
                        'hover:text-red-500 group-hover:visible':
                          calendars.length > 1,
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
            </div>

            <div className="relative flex h-8 w-full flex-col">
              <div
                onClick={() => setIsCreatingCalendar(true)}
                className={clsx(
                  'relative flex h-8 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed  px-2 py-1  transition ',
                  {
                    'hover:lightThemeHover border-gray-700 text-gray-700':
                      !isDarkTheme,
                    'hover:darkThemeHover border-gray-300 text-gray-300':
                      isDarkTheme,
                  }
                )}
              >
                <div className="text-gray relative mb-1 flex items-center justify-center text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
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
                    className={clsx(
                      'absolute inset-0 h-full w-full rounded px-1 py-2 outline-2 focus:outline',
                      {
                        'border-gray-700 bg-lightThemeBG text-gray-700 focus:outline-blue-600':
                          !isDarkTheme,
                        'border-none border-gray-300 bg-darkThemeBG text-gray-300 focus:outline-blue-500':
                          isDarkTheme,
                      }
                    )}
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
                      if (e.key === 'Escape') {
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
      )}
    </>
  )
}

export default Sidebar
