import React from 'react'

import { useSession } from 'next-auth/react'
import useStore from '~/store/useStore'
import { api } from '~/utils/api'
import clsx from 'clsx'

const JournalList = () => {
  const { data: sessionData } = useSession()
  const [
    selectedJournal,
    setSelectedJournal,
    setCreatingWithModal,
    isDarkTheme,
  ] = useStore((state) => [
    state.selectedJournal,
    state.setSelectedJournal,
    state.setCreatingWithModal,
    state.isDarkTheme,
  ])
  //API stuff
  const { data: journals, refetch: refetchJournals } =
    api.journal.getAll.useQuery(undefined, {
      onSuccess: (data) => {
        if (data.length === 0 && sessionData)
          createJournal.mutate({ name: sessionData.user.name ?? '' })
        setSelectedJournal(selectedJournal ?? data[0] ?? null)
      },
      onError: (err) => {
        console.log(err)
      },
    })
  const createJournal = api.journal.create.useMutation({
    onSuccess: () => {
      void refetchJournals()
    },
  })
  const updateJournal = api.journal.update.useMutation({
    onSuccess: () => {
      void refetchJournals()
    },
  })

  const deleteJournal = api.journal.delete.useMutation({
    onSuccess: () => {
      void refetchJournals()
    },
  })
  return (
    <div className="relative flex h-full w-full flex-col gap-2 px-1 py-2">
      <div className="relative z-10 flex w-full items-center justify-center">
        <button
          className={clsx(
            'relative flex w-full items-center justify-center rounded border-2 border-dashed px-2 py-1 text-sm font-light',
            {
              'border-lightThemeBorder': !isDarkTheme,
              'border-darkThemeBorder': isDarkTheme,
            }
          )}
          onClick={() => setCreatingWithModal('Journal')}
        >
          Create Journal
        </button>
      </div>
      <div className="relative flex h-fit w-full flex-col gap-1 overflow-y-auto">
        {journals?.map((journal, index) => {
          return (
            <div
              className={clsx(
                'group relative flex h-8 w-full cursor-pointer flex-row items-center justify-between rounded px-2 py-1 transition duration-300',
                {
                  'bg-lightThemeSelected text-blue-700':
                    JSON.stringify(selectedJournal) ===
                      JSON.stringify(journal) && !isDarkTheme,
                  'hover:bg-lightThemeHover':
                    JSON.stringify(selectedJournal) !==
                      JSON.stringify(journal) && !isDarkTheme,

                  'bg-darkThemeSelected text-blue-100':
                    JSON.stringify(selectedJournal) ===
                      JSON.stringify(journal) && isDarkTheme,
                  'hover:bg-darkThemeHover':
                    JSON.stringify(selectedJournal) !==
                      JSON.stringify(journal) && isDarkTheme,
                }
              )}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedJournal(journal)
                }
              }}
              key={index}
            >
              <h1 className="pointer-events-none">{journal.name}</h1>
              <button
                onClick={() => {
                  deleteJournal.mutate({
                    id: journal.id,
                  })
                }}
                className={clsx('invisible transition', {
                  'hover:text-red-500 group-hover:visible': journals.length > 1,
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
    </div>
  )
}

export default JournalList
