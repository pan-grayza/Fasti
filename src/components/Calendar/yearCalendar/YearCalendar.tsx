import React, { useEffect, useRef, useState } from 'react'
import useStore from '~/store/useStore'
import { startOfYear, add } from 'date-fns'
import MonthCell from './MonthCell'
import clsx from 'clsx'

const YearCalendar = () => {
  const [currentDate] = useStore((state) => [state.currentDate])

  const [dimensions, setDimensions] = useState<{
    height: number | undefined
    width: number | undefined
  }>({
    height: 0,
    width: 0,
  })
  // const parentGrid = useRef<HTMLDivElement | null>(null)
  // useEffect(() => {
  //   const resizeObserver = new ResizeObserver((event) => {
  //     setDimensions({
  //       height: event[0]?.contentBoxSize[0]?.blockSize,
  //       width: event[0]?.contentBoxSize[0]?.inlineSize,
  //     })
  //   })

  //   if (parentGrid.current) {
  //     resizeObserver.observe(parentGrid.current)
  //   }
  // })

  return (
    <div
      // ref={parentGrid}
      className="items-cente flex h-full w-full justify-center overflow-auto pb-4 transition"
    >
      <div
        className={clsx(
          'grid h-fit w-fit gap-x-6 gap-y-2 pt-2',
          {
            // 'grid-cols-4 grid-rows-3': (dimensions.width ?? 0) >= 1024,
            // 'grid-cols-3 grid-rows-4': (dimensions.width ?? 0) >= 768,
            // 'grid-cols-2 grid-rows-6': (dimensions.width ?? 0) >= 512,
            // 'grid-rows-auto grid-cols-1': (dimensions.width ?? 0) < 512,
          },
          'grid-rows-auto grid-cols-1 md:grid-cols-2 md:grid-rows-6 lg:grid-cols-3 lg:grid-rows-4 xl:grid-cols-4 xl:grid-rows-3'
        )}
      >
        {Array.from({ length: 12 }).map((_, index) => {
          const startDateOfYear = startOfYear(currentDate)
          const date = add(startDateOfYear, { months: index })
          const numOfMonth = index + 1

          return <MonthCell size="xs" key={numOfMonth} monthDate={date} />
        })}
      </div>
    </div>
  )
}

export default YearCalendar
