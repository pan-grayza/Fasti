import React from 'react'
import NoteEditor from '~/components/JournalComponents/NoteEditor'
import useStore from '~/store/useStore'

const Journal = () => {
  const [selectedNote, isDarkTheme] = useStore((state) => [
    state.selectedNote,
    state.isDarkTheme,
  ])

  return (
    <div className="relative flex h-full w-full flex-row overflow-hidden">
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
