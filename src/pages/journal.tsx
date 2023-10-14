import clsx from 'clsx'
import React, { useState } from 'react'
import JournalList from '~/components/JournalComponents/JournalList'
import NoteEditor from '~/components/JournalComponents/NoteEditor'
import Noteslist from '~/components/JournalComponents/Noteslist'
import useStore from '~/store/useStore'

const Journal = () => {
  const [selectedNote, isDarkTheme] = useStore((state) => [
    state.selectedNote,
    state.isDarkTheme,
  ])
  const [currentView, setCurrentView] = useState<'Journals' | 'Notes'>('Notes')

  return (
    <div className="relative flex h-full w-full flex-row overflow-hidden">
      <div
        className={clsx(
          'relative flex h-full w-48 shrink-0 flex-col border-r px-1 py-2 transition',
          {
            'border-lightThemeBorder': !isDarkTheme,
            'border-darkThemeBorder': isDarkTheme,
          }
        )}
      >
        <div className="relative flex h-fit w-full flex-row items-center justify-center gap-2">
          <button
            className={clsx(
              'relative flex w-20 items-center justify-center rounded py-1 transition duration-300',
              {
                'bg-lightThemeSelected text-blue-700':
                  currentView === 'Journals' && !isDarkTheme,
                'hover:bg-lightThemeHover':
                  currentView !== 'Journals' && !isDarkTheme,

                'bg-darkThemeSelected text-blue-100':
                  currentView === 'Journals' && isDarkTheme,
                'hover:bg-darkThemeHover':
                  currentView !== 'Journals' && isDarkTheme,
              }
            )}
            onClick={() => setCurrentView('Journals')}
          >
            Journals
          </button>
          <button
            className={clsx(
              'relative flex w-20 items-center justify-center rounded py-1 transition duration-300',
              {
                'bg-lightThemeSelected text-blue-700':
                  currentView === 'Notes' && !isDarkTheme,
                'hover:bg-lightThemeHover':
                  currentView !== 'Notes' && !isDarkTheme,

                'bg-darkThemeSelected text-blue-100':
                  currentView === 'Notes' && isDarkTheme,
                'hover:bg-darkThemeHover':
                  currentView !== 'Notes' && isDarkTheme,
              }
            )}
            onClick={() => setCurrentView('Notes')}
          >
            Notes
          </button>
        </div>
        {currentView === 'Journals' ? <JournalList /> : <Noteslist />}
      </div>
      {selectedNote ? (
        <NoteEditor />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center text-xl font-semibold">
          Please select the note
        </div>
      )}
    </div>
  )
}

export default Journal
