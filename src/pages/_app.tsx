import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import NavBar from '~/components/Navbar/NavBar'
import clsx from 'clsx'
import useStore from '~/store/useStore'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])

  return (
    <SessionProvider session={session}>
      <div
        className={clsx(
          'relative flex h-screen w-screen flex-col overflow-hidden text-darkText transition-colors',
          {
            'bg-white text-darkText': !isDarkTheme,
            'bg-gray-800 text-lightText': isDarkTheme,
          }
        )}
      >
        <NavBar />

        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
