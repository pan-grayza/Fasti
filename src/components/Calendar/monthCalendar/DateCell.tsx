import clsx from 'clsx'
import DayCell from '~/components/DayCell'
import useStore from '~/store/useStore'

interface Props {
  className?: string
  date: Date
}

const DateCell: React.FC<Props> = ({ className, date }) => {
  const [setCurrentDate] = useStore((state) => [state.setCurrentDate])
  return (
    <div
      onClick={() => setCurrentDate(date)}
      className={clsx(
        'relative flex cursor-pointer select-none flex-col items-center border-b border-l  p-1 transition-colors',
        className
      )}
    >
      <DayCell className="opacity-50" date={date} />
    </div>
  )
}

export default DateCell
