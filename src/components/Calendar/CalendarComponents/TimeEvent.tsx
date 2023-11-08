import clsx from 'clsx'
import { add, format, startOfDay, startOfWeek } from 'date-fns'
import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import useStore from '~/store/useStore'

import type { timeEvent } from '@prisma/client'
import { api } from '~/utils/api'

interface Props {
  className?: string
  eventProps: timeEvent
  parentWidth: number | undefined

  type?: 'week' | 'day'
  refetchTimeEvents: () => unknown
}

const TimeEvent: React.FC<Props> = ({
  className,
  eventProps,
  parentWidth = 90,
  type = 'day',
  refetchTimeEvents,
}) => {
  //Other states
  const [editingWithModal, setEditingWithModal, isDarkTheme] = useStore(
    (state) => [
      state.editingWithModal,
      state.setEditingWithModal,
      state.isDarkTheme,
    ]
  )
  const [onMouseDownStart, setOnMouseDownStart] = useState(0)

  //API stuff
  const updateTimeEvent = api.timeEvent.update.useMutation({
    onSuccess: () => {
      void refetchTimeEvents()
    },
  })

  const deleteTimeEvent = api.timeEvent.delete.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      void refetchTimeEvents()
    },
  })

  //Position stuff
  const [colIndex, setColIndex] = useState(
    type === 'week' ? parseInt(format(eventProps.startTime, 'e')) - 1 : 0
  )
  const getColX = () => {
    if (type === 'week') {
      return (parentWidth / 7) * colIndex
    } else {
      return colIndex
    }
  }
  const startingPosition = {
    x: type === 'week' ? getColX() : 0,
    y:
      parseInt(format(eventProps.startTime, 'm')) +
      parseInt(format(eventProps.startTime, 'H')) * 60,
  }

  const [size, setSize] = useState({
    width: type === 'week' ? parentWidth / 7 + 'px' : parentWidth + 'px',
    height: eventProps.durationM + 'px',
  })
  const [position, setPosition] = useState(startingPosition)
  let dateFromPosition: Date
  if (type === 'week') {
    dateFromPosition = add(startOfWeek(eventProps.startTime), {
      days: colIndex,
      minutes: position.y,
    })
  } else {
    dateFromPosition = add(startOfDay(eventProps.startTime), {
      minutes: position.y,
    })
  }

  useEffect(() => {
    setSize({
      ...size,
      width: type === 'week' ? parentWidth / 7 + 'px' : parentWidth + 'px',
    })
    setPosition({ ...position, x: getColX() })
  }, [parentWidth])

  //Editing Event
  //Renaming
  useEffect(() => {
    finishUpdating()
  }, [size, position.x, position.y]) // Needs to be like that, for delete functionality
  const [isRenaming, setIsRenaming] = useState(false)
  const [name, setName] = useState(eventProps.name)

  const finishUpdating = () => {
    if (name === '') setName('Event')
    setIsRenaming(false)
    setEditingWithModal(null)
    updateTimeEvent.mutate({
      id: eventProps.id,
      calendarId: eventProps.calendarId,
      newName: name,
      newStartTime: dateFromPosition,
      newDurationM: parseInt(size.height),
    })
  }

  const onRename = () => {
    if (editingWithModal) {
      setEditingWithModal(null)
    } else {
      setEditingWithModal('TimeEvent')
      setIsRenaming(true)
    }
  }

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y })
        if (type === 'week') {
          Array.from({ length: 7 }).map((col, index) => {
            if (d.x === 0) setColIndex(0)
            else if (
              0.8 < ((parentWidth / 7) * index) / d.x &&
              ((parentWidth / 7) * index) / d.x < 1.2
            ) {
              setColIndex(index)
            }
          })
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setPosition({ ...position })
        setSize({
          ...size,
          height: ref.style.height,
        })
      }}
      resizeGrid={[15, 15]}
      dragGrid={[type === 'week' ? parentWidth / 7 : parentWidth, 15]}
      enableResizing={{
        top: true,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      maxWidth={256}
      dragAxis={type === 'week' ? 'both' : 'y'}
      bounds="parent"
      className={clsx('relative cursor-pointer rounded bg-blue-400', className)}
    >
      <div
        onMouseDown={() =>
          setOnMouseDownStart(
            parseInt(
              format(new Date(), 'm') +
                format(new Date(), 's') +
                format(new Date(), 'SSS')
            )
          )
        }
        onClick={() =>
          onMouseDownStart + 300 >
            parseInt(
              format(new Date(), 'm') +
                format(new Date(), 's') +
                format(new Date(), 'SSS')
            ) && onRename()
        }
        className={clsx('h-full w-full px-2 pb-1 text-white', {
          'items-center text-xs': parseInt(size.height) < 30,
        })}
      >
        {name}
      </div>
      {isRenaming && (
        <div
          className={clsx(
            'absolute inset-0 z-10 flex h-full w-full items-start drop-shadow',
            {
              'ml-4 justify-start translate-x-full': colIndex < 4,
              'mr-4 justify-end -translate-x-full': colIndex > 3,
            }
          )}
        >
          <div
            className={clsx('relative flex flex-col gap-1 rounded p-1', {
              'bg-lightThemeBG': !isDarkTheme,
              'bg-darkThemeBG': isDarkTheme,
            })}
          >
            <div className="relative flex h-fit w-full items-center justify-end gap-1">
              <button
                onClick={() =>
                  deleteTimeEvent.mutate({
                    id: eventProps.id,
                    calendarId: eventProps.calendarId,
                  })
                }
                className="relative flex items-center justify-center"
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
              <button
                onClick={() => finishUpdating()}
                className="relative flex items-center justify-center"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              autoFocus
              onChange={(e) => setName(e.target.value)}
              value={name}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  finishUpdating()
                }
              }}
              className={clsx('relative w-48 rounded p-1 focus:outline-none', {
                'bg-lightThemeSecondaryBG': !isDarkTheme,
                'bg-darkThemeSecondaryBG': isDarkTheme,
              })}
            />
          </div>
        </div>
      )}
    </Rnd>
  )
}

export default TimeEvent
