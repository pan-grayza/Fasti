import clsx from 'clsx'
import { add } from 'date-fns'
import { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const TimeEvent: React.FC<Props> = ({ children, className, date }) => {
  useEffect(() => {
    setRenamingEventNow(true)
  }, [])
  const [renamingEventNow, setRenamingEventNow] = useStore((state) => [
    state.renamingEventNow,
    state.setRenamingEventNow,
  ])
  const [size, setSize] = useState({ width: '256px', height: '30px' })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isRenaming, setIsRenaming] = useState(true)
  const [name, setName] = useState('')
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
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        })
      }}
      resizeGrid={[15, 15]}
      dragGrid={[15, 15]}
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
      dragAxis="y"
      bounds="parent"
      className={clsx('rounded bg-slate-400 px-2 py-1', className)}
    >
      <div className="h-full w-full">{durationM}</div>
    </Rnd>
  )
}

export default TimeEvent
