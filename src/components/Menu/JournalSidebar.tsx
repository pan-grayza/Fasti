import clsx from 'clsx'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import useStore from '~/store/useStore'
import JournalList from '../JournalComponents/JournalList'
import Noteslist from '../JournalComponents/Noteslist'
import CreatorModal from '../CreatorModal'

const JournalSidebar = () => {
  const [creatingWithModal, setCreatingWithModal, isDarkTheme, setMenu] =
    useStore((state) => [
      state.creatingWithModal,
      state.setCreatingWithModal,
      state.isDarkTheme,
      state.setMenu,
    ])
  const [currentView, setCurrentView] = useState<'Journals' | 'Notes'>(
    'Journals'
  )

  const router = useRouter()
  const menuNavigate = (adress: string) => {
    router.push(adress)
    setMenu(false)
  }
  return (
    <div
      className={clsx(
        'relative flex h-screen w-64 max-w-[100vw] flex-col items-center gap-2 pt-10',
        {
          'bg-lightThemeBG': !isDarkTheme,
          'bg-darkThemeBG': isDarkTheme,
        }
      )}
    >
      <div className="relative flex h-fit w-full flex-row items-center justify-center gap-1">
        <button
          className={clsx(
            'relative flex w-[7.5rem] items-center justify-center rounded py-1 transition',
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
            'relative flex w-[7.5rem] items-center justify-center rounded py-1 transition',
            {
              'bg-lightThemeSelected text-blue-700':
                currentView === 'Notes' && !isDarkTheme,
              'hover:bg-lightThemeHover':
                currentView !== 'Notes' && !isDarkTheme,

              'bg-darkThemeSelected text-blue-100':
                currentView === 'Notes' && isDarkTheme,
              'hover:bg-darkThemeHover': currentView !== 'Notes' && isDarkTheme,
            }
          )}
          onClick={() => setCurrentView('Notes')}
        >
          Notes
        </button>
      </div>
      {currentView === 'Journals' ? <JournalList /> : <Noteslist />}
      <div
        className={clsx(
          'relative flex h-fit w-full flex-col border-t px-1 pb-4 pt-2',
          {
            'border-lightThemeBorder': !isDarkTheme,
            'border-darkThemeBorder': isDarkTheme,
          }
        )}
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
          onClick={() => menuNavigate('/calendar')}
        >
          Calendar
        </button>
      </div>
      {(creatingWithModal === 'Journal' || 'Note') && <CreatorModal />}
    </div>
  )
}

export default JournalSidebar
