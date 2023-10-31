import clsx from 'clsx'
import React from 'react'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  className?: string
}

const DayColSchedule: React.FC<Props> = ({ className }) => {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])
  return (
    <div
      className={clsx(
        'grid-rows-auto pointer-events-none relative grid h-fit w-full auto-rows-fr grid-cols-1 border-l',
        {
          'border-lightThemeBorder': !isDarkTheme,
          'border-darkThemeBorder': isDarkTheme,
        },
        className
      )}
    >
      {Array.from({ length: 24 }).map((_, index) => {
        return (
          <div
            className={clsx('relative inset-0 h-[60px] w-full border-b', {
              'border-lightThemeBorder bg-lightThemeDarkerBG': !isDarkTheme,
              'border-darkThemeBorder bg-darkThemeSecondaryBG': isDarkTheme,
            })}
            key={index}
          ></div>
        )
      })}
    </div>
  )
}

export default DayColSchedule
