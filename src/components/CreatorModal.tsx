import clsx from 'clsx'
import React, { useState } from 'react'
import useStore from '~/store/useStore'
import { api } from '~/utils/api'

const CreatorModal = () => {
  // States
  const [
    selectedJournal,
    creatingWithModal,
    setCreatingWithModal,
    isDarkTheme,
  ] = useStore((state) => [
    state.selectedJournal,
    state.creatingWithModal,
    state.setCreatingWithModal,
    state.isDarkTheme,
  ])

  const [name, setName] = useState('')

  // API stuff

  const { refetch: refetchJournals } = api.journal.getAll.useQuery(undefined, {
    onError: (err) => {
      console.log(err)
    },
  })
  const createJournal = api.journal.create.useMutation({
    onSuccess: () => {
      void refetchJournals()
    },
  })
  const { refetch: refetchNotes } = api.dayNote.getAll.useQuery(
    { journalId: selectedJournal?.id ?? '' },
    {
      onError: (err) => {
        console.log(err)
      },
    }
  )
  const createNote = api.dayNote.create.useMutation({
    onSuccess: () => {
      void refetchNotes()
    },
  })
  const { refetch: refetchCalendars } = api.calendar.getAll.useQuery(
    undefined,
    {
      onError: (err) => {
        console.log(err)
      },
    }
  )
  const createCalendar = api.calendar.create.useMutation({
    onSuccess: () => {
      void refetchCalendars()
    },
  })

  // Creating stuff
  const finishCreate = () => {
    if (name === '') setName(creatingWithModal ?? '')
    if (creatingWithModal === 'Journal') {
      createJournal.mutate({
        name: name,
      })
    } else if (creatingWithModal === 'Note') {
      createNote.mutate({
        name: name,
        content: '',
        journalId: selectedJournal?.id ?? '',
      })
    } else if (creatingWithModal === 'Calendar') {
      createCalendar.mutate({
        name: name,
      })
    }
    setName('')
    setCreatingWithModal(null)
  }
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setName('')
          setCreatingWithModal(null)
        }
      }}
      className="absolute inset-0 z-10 flex h-screen w-screen flex-row items-center justify-center bg-black/50 transition"
    >
      <div
        className={clsx(
          'relative flex h-fit max-h-screen w-fit max-w-[100vw] flex-col items-center justify-center gap-4 rounded p-4 transition md:p-6',
          {
            'bg-lightThemeBG': !isDarkTheme,
            'bg-darkThemeBG': isDarkTheme,
          }
        )}
      >
        <div className="relative flex h-fit w-full flex-col gap-2">
          <p className="relative w-full">Create {creatingWithModal}</p>
          <input
            autoFocus
            onChange={(e) => setName(e.currentTarget.value)}
            className={clsx(
              'relative inset-0 rounded border-2 px-1 py-1 focus:outline-none',
              {
                'border-zinc-500 bg-lightThemeBG text-lightThemeText focus:border-blue-600':
                  !isDarkTheme,
                'border-zinc-400 bg-darkThemeBG text-darkThemeText focus:border-blue-500':
                  isDarkTheme,
              }
            )}
            type="text"
            placeholder={creatingWithModal + ' name'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                finishCreate()
              } else if (e.key === 'Escape') {
                setName('')
                setCreatingWithModal(null)
              }
            }}
          />
        </div>

        <div className="relative z-10 flex w-full flex-row items-center gap-2 text-white">
          <button
            onClick={() => {
              finishCreate()
            }}
            className="relative rounded bg-blue-400 px-4 py-2 text-sm font-semibold transition active:bg-blue-500"
          >
            Create
          </button>
          <button
            onClick={() => {
              setName('')
              setCreatingWithModal(null)
            }}
            className="rounded bg-red-400 px-4 py-2 text-sm font-semibold  transition active:bg-red-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatorModal
