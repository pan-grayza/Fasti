import clsx from 'clsx'
import React from 'react'

interface Props extends React.PropsWithChildren {
  className?: string
}

const DayCol: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx(
        'grid-rows-auto relative z-[-1] grid h-fit w-full auto-rows-fr grid-cols-1',
        className
      )}
    >
      {Array.from({ length: 24 }).map((_, index) => {
        return (
          <div
            className="relative inset-0 h-[60px] w-full border-b bg-slate-50"
            key={index}
          ></div>
        )
      })}
    </div>
  )
}

export default DayCol
