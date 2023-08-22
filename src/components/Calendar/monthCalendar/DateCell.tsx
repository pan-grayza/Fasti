import clsx from 'clsx'
import DayCell from '~/components/DayCell'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
  date: Date
}

const DateCell: React.FC<Props> = ({ children, className, date }) => {
  const [setCurrentDate] = useStore((state) => [state.setCurrentDate])
  return (
    <div
      onClick={() => setCurrentDate(date)}
      className={clsx(
        'relative flex cursor-pointer select-none flex-col items-center border-b border-l transition-colors',
        className
      )}
    >
      <DayCell className="opacity-50" date={date}>
        {children}
      </DayCell>
    </div>
  )
}

export default DateCell
