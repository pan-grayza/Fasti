import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/navigation'

import useStore from '~/store/useStore'
import { api } from '~/utils/api'
const CalendarSidebar = () => {
  const { data: sessionData } = useSession()

  const [
    selectedCalendar,
    setSelectedCalendar,
    currentCalendarView,
    setCurrentCalendarView,
    setCreatingWithModal,
    isDarkTheme,
    setMenu,
  ] = useStore((state) => [
    state.selectedCalendar,
    state.setSelectedCalendar,
    state.currentCalendarView,
    state.setCurrentCalendarView,
    state.setCreatingWithModal,
    state.isDarkTheme,
    state.setMenu,
  ])
  const router = useRouter()
  const menuNavigate = (adress: string) => {
    router.push(adress)
    setMenu(false)
  }

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
    <div
      className={clsx(
        'relative flex h-screen w-64 max-w-[100vw] flex-col items-center px-1',
        {
          'bg-lightThemeBG': !isDarkTheme,
          'bg-darkThemeBG': isDarkTheme,
        }
      )}
    >
      <div className="pointer-events-none relative flex h-fit w-full p-4">
        <p className="text-lg font-bold tracking-wide">Fasti</p>
      </div>
      <div className="relative flex h-full w-full flex-col items-center">
        {/* CalendarView buttons */}
        <div className="relative flex h-fit w-full flex-col py-2">
          {Array.from({ length: 4 }).map((btn, index) => {
            let title: typeof currentCalendarView = 'Day'
            switch (index) {
              case 1:
                title = 'Week'
                break
              case 2:
                title = 'Month'
                break
              case 3:
                title = 'Year'
            }
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentCalendarView(title)
                  setMenu(false)
                }}
                className={clsx(
                  'relative flex h-fit w-full items-center rounded px-2 py-1',
                  {
                    'bg-lightThemeSelected text-blue-700':
                      title === currentCalendarView && !isDarkTheme,
                    'hover:bg-lightThemeHover':
                      title !== currentCalendarView && !isDarkTheme,

                    'bg-darkThemeSelected text-blue-100':
                      title === currentCalendarView && isDarkTheme,
                    'hover:bg-darkThemeHover':
                      title !== currentCalendarView && isDarkTheme,
                  }
                )}
              >
                {title}
              </button>
            )
          })}
        </div>

        {/* Calendar List */}

        <div
          className={clsx(
            'relative flex h-full w-full flex-col gap-1 border-y py-2',
            {
              'border-lightThemeBorder': !isDarkTheme,
              'border-darkThemeBorder': isDarkTheme,
            }
          )}
        >
          <p className="pointer-events-none relative ml-1 pb-2 text-sm font-light opacity-50">
            Your Calendars
          </p>
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
                    setSelectedCalendar(calendars[0] ?? null)
                  }}
                  className={clsx(
                    'relative flex h-6 w-6 items-center justify-center transition hover:text-red-500',
                    {
                      'group-hover:visible': calendars.length > 1,
                      invisible:
                        JSON.stringify(selectedCalendar) !==
                          JSON.stringify(calendar) || calendars.length >= 1,
                      'text-lightThemeText': !isDarkTheme,
                      'text-darkThemeText': isDarkTheme,
                    }
                  )}
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
          {/* Calendar Cretor */}
          <div
            onClick={() => setCreatingWithModal('Calendar')}
            className={clsx(
              'relative flex h-8 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed px-2 py-1 transition ',
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
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx('relative flex h-fit w-full flex-col px-1 pb-4 pt-2')}
      >
        <button
          className={clsx(
            'relative flex w-full items-center rounded px-2 py-1 transition',
            {
              'hover:bg-lightThemeHover': !isDarkTheme,
              'hover:bg-darkThemeHover': isDarkTheme,
            }
          )}
          onClick={() => menuNavigate('/')}
        >
          Home
        </button>
        <button
          className={clsx(
            'relative flex w-full items-center rounded px-2 py-1 transition',
            {
              'hover:bg-lightThemeHover': !isDarkTheme,
              'hover:bg-darkThemeHover': isDarkTheme,
            }
          )}
          onClick={() => menuNavigate('/journal')}
        >
          Journal
        </button>
      </div>
    </div>
  )
}

export default CalendarSidebar
