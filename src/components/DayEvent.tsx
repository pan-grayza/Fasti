import clsx from 'clsx'
import { useState, useEffect } from 'react'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
  onClick?: (id: string) => void
  onDelete?: () => void
}

const Event: React.FC<Props> = ({
  className,
  onClick = () => null,
  onDelete,
  children,
}) => {
  useEffect(() => {
    setRenamingEventNow(true)
  }, [])

  const [renamingEventNow, setRenamingEventNow] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
  ])

  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState('')

  const finishRenaming = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name === '') setName('New Event')
    setIsRenaming(false)
    setRenamingEventNow(false)
  }
  if (renamingEventNow === false && isRenaming) {
    setIsRenaming(false)
    if (name === '') setName('New Event')
  }

  const onRename = () => {
    setRenamingEventNow(true)
    setIsRenaming(true)
  }
  return (
    <div
      onClick={onRename}
      className={clsx(
        'relative h-8 w-full flex-col items-center justify-center rounded bg-green-400',
        className,
        { 'z-20': isRenaming }
      )}
    >
      {name}
      {isRenaming && (
        <form
          onSubmit={finishRenaming}
          className="absolute inset-0 h-full w-full flex-col text-white"
        >
          <input
            autoFocus
            className="relative h-full w-full rounded bg-green-400 focus:outline-none"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
          <div className="relative mt-1 flex h-10 flex-row items-center justify-center gap-x-4 rounded bg-gray-100 p-2 drop-shadow">
            <button
              type="submit"
              className="relative h-8 w-20 rounded bg-blue-300 text-black"
            >
              Done
            </button>
            <button
              onClick={onDelete}
              type="reset"
              className="relative flex h-8 w-8 items-center justify-center rounded bg-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </form>
      )}

      {children}
    </div>
  )
}

export default Event
