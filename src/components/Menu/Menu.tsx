import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import useStore from '~/store/useStore'
import MenuButton from './MenuButton'
import { signOut, useSession } from 'next-auth/react'
import CalendarSidebar from './CalendarSidebar'
import JournalSidebar from './JournalSidebar'
import CreatorModal from '../CreatorModal'
import Image from 'next/image'

const Menu = () => {
  const [creatingWithModal, isDarkTheme, menu, setMenu] = useStore((state) => [
    state.creatingWithModal,
    state.isDarkTheme,
    state.menu,
    state.setMenu,
  ])
  const { data: sessionData } = useSession()
  const router = useRouter()
  const menuNavigate = (adress: string) => {
    void router.push(adress)
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
      {(creatingWithModal === 'Journal' ||
        creatingWithModal === 'Note' ||
        creatingWithModal === 'Calendar') && <CreatorModal />}
      <div
        className={clsx('relative h-fit w-fit transition-transform', {
          'translate-x-[0%]': menu,
          'translate-x-[-100%]': !menu,
        })}
      >
        {router.asPath.startsWith('/calendar') && <CalendarSidebar />}
        {router.asPath.startsWith('/journal') && <JournalSidebar />}
      </div>

      {!router.asPath.startsWith('/calendar') &&
        !router.asPath.startsWith('/journal') && (
          <div
            className={clsx(
              'absolute inset-0 flex h-screen w-screen flex-col gap-1 rounded p-1 transition-transform ',
              {
                'bg-lightThemeBG': !isDarkTheme,
                'bg-darkThemeBG': isDarkTheme,
                'translate-y-[0%]': menu,
                'translate-y-[-100%]': !menu,
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
            <div className="relative flex h-full w-full flex-col p-2 md:flex-row">
              <div className="relative flex h-full w-full flex-col gap-1">
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
                  'flex h-full w-full flex-col gap-2 self-end rounded-lg p-4 drop-shadow md:w-80',
                  {
                    'bg-darkThemeSecondaryBG': isDarkTheme,
                    'bg-lightThemeSecondaryBG': !isDarkTheme,
                  }
                )}
              >
                {sessionData?.user.image ? (
                  <div className="relative h-16 w-16">
                    <Image
                      width={64}
                      height={64}
                      src={sessionData.user.image}
                      alt="Picture of the user"
                      className="relative h-16 w-16 rounded-full"
                    />
                    <div
                      className={clsx(
                        'absolute left-[calc(100%-1.25rem)] top-[calc(100%-1.25rem)] z-10 flex h-5 w-5 items-center justify-center rounded-full',
                        'before:absolute before:h-3 before:w-3 before:rounded-full before:bg-green-400',
                        {
                          'bg-darkThemeSecondaryBG': isDarkTheme,
                          'bg-lightThemeSecondaryBG': !isDarkTheme,
                        }
                      )}
                    />
                  </div>
                ) : (
                  <div className="relative h-16 w-16 rounded-full bg-neutral-400" />
                )}
                <div className="relative flex h-full w-full flex-col gap-2 rounded p-2">
                  <div>
                    <div className="text-lg">{sessionData?.user.name}</div>
                    <div className="text-xs opacity-50">
                      {sessionData?.user.id}
                    </div>
                  </div>

                  <div
                    className={clsx(
                      'relative flex h-full w-full flex-col items-center justify-center rounded',
                      {
                        'bg-darkThemeBG': isDarkTheme,
                        'bg-lightThemeBG': !isDarkTheme,
                      }
                    )}
                  >
                    <div className="text-lg">More settings soon</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <button
                    className={clsx(
                      'relative flex w-full rounded px-2 py-1 text-rose-500',
                      {
                        'hover:bg-darkThemeHover': isDarkTheme,
                        'hover:bg-lightThemeHover': !isDarkTheme,
                      }
                    )}
                    onClick={() => void signOut()}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            <div
              className={clsx(
                'relative flex h-14 w-full cursor-pointer items-center justify-center',
                {
                  'bg-lightThemeSecondaryBG': !isDarkTheme,
                  'bg-darkThemeSecondaryBG': isDarkTheme,
                }
              )}
              onClick={() => setMenu(false)}
            ></div>
          </div>
        )}
    </div>
  )
}

export default Menu
