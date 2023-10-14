import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { githubLight, githubDarkInit } from '@uiw/codemirror-theme-github'

import { api } from '~/utils/api'
import useStore from '~/store/useStore'
import { format } from 'date-fns'
import clsx from 'clsx'

const NoteEditor = () => {
  const [selectedNote, isDarkTheme] = useStore((state) => [
    state.selectedNote,
    state.isDarkTheme,
  ])
  const [code, setCode] = useState<string>(selectedNote?.content ?? '')
  const [name, setName] = useState<string>(selectedNote?.name ?? '')
  useEffect(() => {
    setCode(selectedNote?.content ?? '')
    setName(selectedNote?.name ?? '')
  }, [selectedNote])

  // API stuff
  const { data: dayNotes, refetch: refetchDayNotes } =
    api.dayNote.getAll.useQuery(
      { journalId: selectedNote?.journalId ?? '' },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  const updateDayNote = api.dayNote.update.useMutation({
    onSuccess: () => {
      void refetchDayNotes()
    },
  })
  const deleteDayNote = api.dayNote.delete.useMutation({
    onSuccess: () => {
      void refetchDayNotes()
    },
  })
  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-2">
      <div className="relative flex w-full flex-col gap-2">
        <input
          type="text"
          placeholder="Note title"
          className={clsx(
            'bg-transperent relative w-full border-b p-1 text-xl font-medium transition focus:outline-none',
            {
              'bg-lightThemeBG': !isDarkTheme,
              'bg-darkThemeBG': isDarkTheme,
              'border-lightThemeBorder': !isDarkTheme,
              'border-darkThemeBorder': isDarkTheme,
            }
          )}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <div className="relative flex flex-row gap-2">
          <button
            onClick={() => {
              updateDayNote.mutate({
                id: selectedNote?.id ?? '',
                newName: name,
                journalId: selectedNote?.journalId ?? '',
                newContent: code,
              })
            }}
            className="relative w-fit cursor-pointer rounded bg-blue-600 px-4 py-1.5 text-sm text-white active:bg-blue-700"
            disabled={name.trim().length === 0 || code.trim().length === 0}
          >
            Save
          </button>
          <button
            onClick={() => {
              deleteDayNote.mutate({
                id: selectedNote?.id ?? '',
                journalId: selectedNote?.journalId ?? '',
              })
              setCode('')
              setName('')
            }}
            className="relative w-fit cursor-pointer rounded bg-red-600 px-4 py-1.5 text-sm text-white active:bg-red-700"
            disabled={name.trim().length === 0 || code.trim().length === 0}
          >
            Delete
          </button>
        </div>
        {selectedNote && (
          <div>
            Last updated at: {format(selectedNote?.updatedAt, 'dd MMMM yyyy')}
          </div>
        )}
      </div>

      <div className="relative flex overflow-y-hidden">
        <CodeMirror
          width="100%"
          minWidth="100%"
          height="100%"
          minHeight="30vh"
          value={code}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
          theme={
            isDarkTheme
              ? githubDarkInit({
                  settings: { background: '#27272A' },
                })
              : githubLight
          }
          onChange={(value) => setCode(value)}
          className="h-full w-full border border-gray-300 focus:border-none focus:outline-none"
        />
      </div>
    </div>
  )
}

export default NoteEditor
