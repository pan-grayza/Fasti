import clsx from 'clsx'
import { add, startOfDay, startOfWeek } from 'date-fns'
import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import useStore from '~/store/useStore'

import { api } from '~/utils/api'

interface Props {
  className?: string
  createEventProps: { x: number; y: number; calendarId: string }
  parentWidth: number | undefined
  type?: 'week' | 'day'
}

const DayEventCreator: React.FC<Props> = ({
  className,
  createEventProps,
  parentWidth = 90,
  type = 'day',
}) => {
  const [
    renamingEventNow,
    setRenamingEventNow,
    currentDate,
    selectedCalendar,
    setCreatingTimeEventNow,
  ] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
    state.currentDate,
    state.selectedCalendar,
    state.setCreatingTimeEventNow,
  ])
  useEffect(() => {
    setRenamingEventNow(true)
  }, [])
  //API stuff
  const { data: timeEvents, refetch: refetchTimeEvents } =
    api.timeEvent.getAll.useQuery(
      { calendarId: createEventProps.calendarId },
      {
        onError: (err) => {
          console.log(err)
        },
      }
    )
  const createTimeEvent = api.timeEvent.create.useMutation({
    onSuccess: () => {
      void refetchTimeEvents()
    },
  })

  //Position stuff
  const startingColIndex = () => {
    let number = 0
    Array.from({ length: 7 }).map((col, index) => {
      if (
        createEventProps.x >= (parentWidth / 7) * index &&
        createEventProps.x <= (parentWidth / 7) * (index + 1)
      ) {
        number = index
      }
    })
    return number
  }
  const [colIndex, setColIndex] = useState(
    type === 'week' ? startingColIndex() : 0
  )
  const getColX = () => {
    if (type === 'week') {
      return (parentWidth / 7) * colIndex
    } else {
      return colIndex
    }
  }

  const [size, setSize] = useState({
    width: type === 'week' ? parentWidth / 7 + 'px' : parentWidth + 'px',
    height: '30px',
  })
  const [position, setPosition] = useState({
    x: createEventProps.x,
    y: createEventProps.y,
  })
  const getDateFromPosition = () => {
    let date: Date
    if (type === 'week') {
      date = add(startOfWeek(currentDate), {
        days: colIndex,
        minutes: position.y,
      })
    } else {
      date = add(startOfDay(currentDate), {
        minutes: position.y,
      })
    }
    return date
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
  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState('')

  const finishCreating = () => {
    if (name === '') setName('Event')
    setIsRenaming(false)
    setRenamingEventNow(false)
    createTimeEvent.mutate({
      calendarId: selectedCalendar?.id ?? '',
      name: name,
      startTime: getDateFromPosition(),
      durationM: parseInt(size.height),
    })
    setCreatingTimeEventNow(false)
  }

  if (!renamingEventNow && isRenaming) {
    setIsRenaming(false)
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
          width: ref.style.width,
          height: ref.style.height,
          ...position,
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
      className={clsx(
        'relative z-10 cursor-pointer rounded bg-blue-400',
        className
      )}
    >
      <div className="relative flex items-center px-2">
        <p>{name}</p>
      </div>
      <div
        className={clsx(
          'absolute inset-0 z-10 flex h-full w-full items-start',
          {
            'ml-4 translate-x-full justify-start': colIndex < 4,
            'mr-4 -translate-x-full justify-end': colIndex > 3,
          }
        )}
      >
        <div className="relative flex flex-col gap-1 rounded bg-gray-100 p-1">
          <div className="relative flex h-fit w-full items-center justify-end gap-1">
            <button
              onClick={() => {
                setName('')
                setCreatingTimeEventNow(false)
              }}
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
              if (e.key === 'Enter') {
                finishCreating()
              }
            }}
            className="relative w-48 p-1 focus:outline-none"
          />
        </div>
      </div>
    </Rnd>
  )
}

export default DayEventCreator
