import clsx from 'clsx'
import { startOfDay } from 'date-fns'
import React, { useState } from 'react'
import useStore from '~/store/useStore'

import { api } from '~/utils/api'

const Noteslist = () => {
  const [selectedJournal, selectedNote, setSelectedNote, isDarkTheme] =
    useStore((state) => [
      state.selectedJournal,
      state.selectedNote,
      state.setSelectedNote,
      state.isDarkTheme,
    ])

  //API stuff
  const { data: dayNotes, refetch: refetchDayNotes } =
    api.dayNote.getAll.useQuery(
      { journalId: selectedJournal?.id ?? '' },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  const createDayNote = api.dayNote.create.useMutation({
    onSuccess: () => {
      void refetchDayNotes()
    },
  })

  const deleteDayNote = api.dayNote.delete.useMutation({
    onSuccess: () => {
      void refetchDayNotes()
    },
  })
  // Creating Note
  const [isCreatingDayNote, setIsCreatingDayNote] = useState(false)
  const [name, setName] = useState('')
  const finishCreatingDayNote = () => {
    if (name === '') setName('Note')
    setIsCreatingDayNote(false)
    createDayNote.mutate({
      date: startOfDay(new Date()),
      journalId: selectedJournal?.id ?? '',
      name: name,
      content: '',
    })
    setName('')
  }
  return (
    <div className="relative flex h-full w-full flex-col gap-2 px-1 py-2">
      <div className="relative flex w-full flex-col items-center justify-center">
        <button
          className={clsx(
            'relative flex w-full items-center justify-center rounded border-2 border-dashed px-2 py-1 text-sm font-light',
            {
              invisible: isCreatingDayNote,
              'border-lightThemeBorder': !isDarkTheme,
              'border-darkThemeBorder': isDarkTheme,
            }
          )}
          onClick={() => setIsCreatingDayNote(true)}
        >
          Create Note
        </button>
        {isCreatingDayNote && (
          <div className="absolute inset-0 flex w-full flex-col px-2">
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  finishCreatingDayNote()
                }
                if (e.key === 'Escape') {
                  setName('')
                  setIsCreatingDayNote(false)
                }
              }}
              className="relative rounded px-1"
              type="text"
            />
            <div className="relative flex w-full flex-row items-start gap-2">
              <button
                onClick={() => {
                  setName('')
                  setIsCreatingDayNote(false)
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  finishCreatingDayNote()
                }}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="relative flex h-fit w-full flex-col gap-1">
        {dayNotes?.map((dayNote, index) => {
          return (
            <div
              className={clsx(
                'group relative flex h-8 w-full cursor-pointer flex-row items-center justify-between rounded px-2 py-1 transition duration-300',
                {
                  'bg-lightThemeSelected text-blue-700':
                    JSON.stringify(selectedNote) === JSON.stringify(dayNote) &&
                    !isDarkTheme,
                  'hover:bg-lightThemeHover':
                    JSON.stringify(selectedNote) !== JSON.stringify(dayNote) &&
                    !isDarkTheme,

                  'bg-darkThemeSelected text-blue-100':
                    JSON.stringify(selectedNote) === JSON.stringify(dayNote) &&
                    isDarkTheme,
                  'hover:bg-darkThemeHover':
                    JSON.stringify(selectedNote) !== JSON.stringify(dayNote) &&
                    isDarkTheme,
                }
              )}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedNote(dayNote)
                }
              }}
              key={index}
            >
              <h1 className="pointer-events-none">{dayNote.name}</h1>
              <button
                onClick={() => {
                  deleteDayNote.mutate({
                    id: dayNote.id,
                    journalId: selectedJournal?.id ?? '',
                  })
                }}
                className="invisible transition hover:text-red-500 group-hover:visible"
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

export default Noteslist
