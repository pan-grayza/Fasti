import clsx from 'clsx'
import { add, startOfWeek } from 'date-fns'
import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
  parentWidth: number | undefined
  type?: 'week' | 'day'
}

const TimeEvent: React.FC<Props> = ({
  children,
  className,
  date,
  parentWidth = 90,
  type = 'day',
}) => {
  useEffect(() => {
    setRenamingEventNow(true)
  }, [])

  const [size, setSize] = useState({
    width: type === 'week' ? parentWidth / 7 : parentWidth + 'px',
    height: '30px',
  })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [colIndex, setColIndex] = useState(0)
  const getColX = () => {
    if (type === 'week') {
      return (parentWidth / 7) * colIndex
    } else {
      return colIndex
    }
  }
  if (type === 'week') {
    date = add(startOfWeek(date), { days: colIndex, minutes: position.y })
  }
  useEffect(() => {
    setSize({
      ...size,
      width: type === 'week' ? parentWidth / 7 : parentWidth + 'px',
    })
    setPosition({ ...position, x: getColX() })
  }, [parentWidth])

  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState('')

  const [renamingEventNow, setRenamingEventNow] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
  ])

  const finishRenaming = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const durationM = parseInt(size.height)
  const startTime = add(date, { minutes: position.y })
  const endTime = add(startTime, { minutes: durationM })
  const timeEventObject = { startTime: startTime, endTime: endTime }

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
      dragAxis={type === 'week' ? 'both' : 'y'}
      bounds="parent"
      className={clsx(
        'relative cursor-pointer rounded bg-slate-400 px-2 py-1',
        className
      )}
    >
      <div className="h-full w-full">{durationM}</div>
    </Rnd>
  )
}

export default TimeEvent
