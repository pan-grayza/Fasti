import clsx from 'clsx'
import DayCell from '../../components/DayCell'
import useStore from '../../store/useStore'

interface Props extends React.PropsWithChildren {
    className?: string
    date: Date
}

const DateCell: React.FC<Props> = ({ children, className, date }) => {
    const [currentDate, setCurrentDate] = useStore((state) => [
        state.currentDate,
        state.setCurrentDate,
    ])
    return (
        <div
            onClick={() => setCurrentDate(date)}
            className={clsx(
                'flex-col relative select-none flex items-center transition-colors cursor-pointer border-l border-b',
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
