import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React from 'react'
import useStore from '~/store/useStore'
import MenuButton from './MenuButton'
import { useSession } from 'next-auth/react'

const Menu = () => {
  const [isDarkTheme, menu, setMenu] = useStore((state) => [
    state.isDarkTheme,
    state.menu,
    state.setMenu,
  ])
  const { data: sessionData } = useSession()
  const router = useRouter()
  const menuNavigate = (adress: string) => {
    router.push(adress)
    setMenu(false)
  }
  return (
    <div
      className={clsx(
        'absolute inset-0 z-[99] flex h-screen w-screen flex-col gap-1 rounded p-1 drop-shadow-xl transition-transform ',
        {
          'bg-lightThemeBG': !isDarkTheme,
          'bg-darkThemeBG': isDarkTheme,
          'translate-y-0': menu,
          'translate-y-[-100vh]': !menu,
        }
      )}
    >
      <div
        className={clsx(
          'relative flex h-14 w-full cursor-pointer items-center justify-center',
          {
            'bg-lightThemeSecondaryBG': !isDarkTheme,
            'bg-darkThemeSecondaryBG': isDarkTheme,
          }
        )}
        onClick={() => setMenu(false)}
      >
        Close
      </div>
      <div className="relative flex h-full flex-col gap-1">
        <MenuButton name="Home" onClick={() => menuNavigate('/')} />
        <MenuButton name="Journal" onClick={() => menuNavigate('/journal')} />
        <MenuButton name="Calendar" onClick={() => menuNavigate('/calendar')} />
      </div>
      <div
        className={clsx(
          'relative flex h-14 w-full cursor-pointer items-center justify-center',
          {
            'bg-lightThemeSecondaryBG': !isDarkTheme,
            'bg-darkThemeSecondaryBG': isDarkTheme,
          }
        )}
      >
        signed in as {sessionData?.user.name}
      </div>
    </div>
  )
}

export default Menu
