import React from 'react'
import TimeEvent from './TimeEvent'
import { add, format, startOfDay } from 'date-fns'
import clsx from 'clsx'
import { Rnd } from 'react-rnd'

interface Props extends React.PropsWithChildren {
    className?: string
    date: Date
}

const Schedule: React.FC<Props> = ({ children, className, date }) => {
    const startOfCurrentDay = startOfDay(date)
    return (
        <div
            className={clsx(
                'relative flex flex-row w-full h-full overflow-auto pb-[60px]',
                className
            )}
        >
            <div className="relative grid grid-cols-1 grid-rows-auto auto-rows-fr h-max w-16 pr-2 pt-8">
                {Array.from({ length: 24 }).map((_, index) => {
                    const time = format(
                        add(startOfCurrentDay, { hours: index + 1 }),
                        'h aa'
                    )
                    return (
                        <div
                            className="relative flex h-[60px] text-xs justify-end items-center"
                            key={index}
                        >
                            {time}
                        </div>
                    )
                })}
            </div>
            <div className="relative w-full h-full">
                <div className="relative w-full h-full">
                    <TimeEvent date={date} />
                </div>
                <div className="absolute inset-0 grid grid-cols-1 grid-rows-auto auto-rows-fr h-max w-full z-[-1]">
                    {Array.from({ length: 24 }).map((_, index) => {
                        const time = format(
                            add(startOfCurrentDay, { hours: index + 1 }),
                            'hh aa'
                        )
                        return (
                            <div
                                className="border-b relative bg-slate-50 h-[60px] w-full"
                                key={index}
                            ></div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Schedule
