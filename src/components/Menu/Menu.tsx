import clsx from 'clsx'
import { useRouter as useNavRouter } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import useStore from '~/store/useStore'
import MenuButton from './MenuButton'
import { useSession } from 'next-auth/react'
import CalendarSidebar from './CalendarSidebar'
import JournalSidebar from './JournalSidebar'

const Menu = () => {
  const [isDarkTheme, menu, setMenu] = useStore((state) => [
    state.isDarkTheme,
    state.menu,
    state.setMenu,
  ])
  const { data: sessionData } = useSession()
  const { asPath } = useRouter()
  const router = useNavRouter()
  const menuNavigate = (adress: string) => {
    router.push(adress)
    setMenu(false)
  }

  return (
    <div
      id="menu"
      className={clsx(
        'absolute inset-0 z-[99] flex h-screen w-screen flex-col bg-black/50 transition-opacity',
        {
          'opacity-100': menu,
          'pointer-events-none opacity-0': !menu,
        }
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) setMenu(false)
      }}
    >
      <div
        className={clsx('relative h-fit w-fit transition-transform', {
          'translate-x-[0%]': menu,
          'translate-x-[-100%]': !menu,
        })}
      >
        {asPath === '/calendar' && <CalendarSidebar />}
        {asPath === '/journal' && <JournalSidebar />}
      </div>

      {asPath !== '/calendar' && asPath !== '/journal' && (
        <div
          className={clsx(
            'absolute inset-0 flex h-screen w-screen flex-col gap-1 rounded p-1 transition-transform ',
            {
              'bg-lightThemeBG': !isDarkTheme,
              'bg-darkThemeBG': isDarkTheme,
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
            <MenuButton
              name="Journal"
              onClick={() => menuNavigate('/journal')}
            />
            <MenuButton
              name="Calendar"
              onClick={() => menuNavigate('/calendar')}
            />
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
      )}
    </div>
  )
}

export default Menu
