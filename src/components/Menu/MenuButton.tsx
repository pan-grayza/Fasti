import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import useStore from '~/store/useStore'

interface Props extends React.PropsWithChildren {
  name: string
  onClick: () => void
}

const MenuButton: React.FC<Props> = ({ name, onClick }) => {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])
  return (
    <button
      className={clsx(
        'relative z-[1] flex w-[24rem] max-w-[100%] px-2 py-1 text-6xl transition',
        'before:absolute before:inset-0 before:z-[-1] before:origin-left before:rounded before:transition-transform before:scale-x-0',
        'hover:before:scale-x-100 focus:before:scale-x-100',
        {
          'before:bg-lightThemeSecondaryBG hover:text-darkThemeDarkerBG':
            isDarkTheme,
          ' before:bg-darkThemeDarkerBG hover:text-lightThemeBorder':
            !isDarkTheme,
        }
      )}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

export default MenuButton
