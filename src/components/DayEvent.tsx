import clsx from 'clsx'
import { useState, useEffect } from 'react'
import useStore from '~/store/useStore'
import type { dayEvent } from '@prisma/client'

interface Props extends React.PropsWithChildren {
  className?: string
  onClick?: (id: string) => void
  onDelete: () => void
  onRenameSubmit: (newName: string) => void
  eventProps: dayEvent
}

const Event: React.FC<Props> = ({
  className,
  onClick = () => null,
  onDelete,
  onRenameSubmit,
  eventProps,
  children,
}) => {
  const [renamingEventNow, setRenamingEventNow] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
  ])

  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState(eventProps.name)

  const finishRenaming = () => {
    if (name === '') setName('Event')
    setIsRenaming(false)
    setRenamingEventNow(false)
    onRenameSubmit(name)
  }
  if (!renamingEventNow && isRenaming) {
    setIsRenaming(false)
  }

  const onRename = () => {
    setRenamingEventNow(true)
    setIsRenaming(true)
  }
  return (
    <div
      className={clsx('relative flex h-6 w-full items-center text-gray-50', {
        'z-20': isRenaming,
      })}
    >
      <div
        onClick={onRename}
        className={clsx(
          'relative flex h-6 w-full items-center rounded bg-sky-500 px-2',
          className
        )}
      >
        <p>{eventProps.name}</p>

        {children}
      </div>
      {isRenaming && (
        <div className="absolute inset-0 z-10 h-full w-full flex-col">
          <input
            id="renameDayEventInput"
            autoFocus
            className="relative h-full w-full rounded bg-sky-500 px-2 py-1 focus:outline-none"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                finishRenaming()
              }
            }}
          />
          <div className="absolute left-0 top-full z-10 mt-2 flex w-full flex-row items-center gap-2">
            <button
              onClick={() => finishRenaming()}
              className="relative w-16 rounded bg-blue-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-blue-500"
            >
              Save
            </button>
            <button
              onClick={onDelete}
              className="rounded bg-red-400 px-3 py-1 text-sm font-semibold text-gray-800 transition active:bg-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Event
