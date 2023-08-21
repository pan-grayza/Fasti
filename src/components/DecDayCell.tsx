import React from 'react'
import useStore from '../store/useStore'
import { format } from 'date-fns'
import clsx from 'clsx'

interface Props extends React.PropsWithChildren {
    className?: string
    size?: 'sm' | 'md' | 'bg'
    onClick?: () => void
}

const DecDayCell: React.FC<Props> = ({
    children,
    className,
    size = 'sm',
    onClick = () => null,
}) => {
    const [currentDate, setCurrentDate] = useStore((state) => [
        state.currentDate,
        state.setCurrentDate,
    ])
    return (
        <div
            className={clsx(
                'cursor-pointer relative flex items-center justify-center',
                className
            )}
        >
            <div
                onClick={() => onClick()}
                className={clsx(
                    'cursor-pointer text-sm select-none flex items-center justify-center relative rounded-full transition-colors',
                    {
                        'bg-blue-300/50 text-blue-700':
                            isCurrentDate && !isToday,
                        'bg-blue-600 text-white': isToday,
                        'hover:bg-gray-300/50': !isCurrentDate && !isToday,
                        'h-8 w-8': size === 'sm',
                        'h-16 w-16': size === 'bg',
                    }
                )}
            >
                {children}
            </div>
            <div className="absolute"></div>
        </div>
    )
}

export default DecDayCell
