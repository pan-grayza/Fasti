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
    <div
      className={clsx(
        'relative flex h-screen w-screen flex-col overflow-hidden text-darkText',
        {
          'text-darkText': !isDarkTheme,
          'text-lightText': isDarkTheme,
        }
      )}
    >
      <SessionProvider session={session}>
        <NavBar />

        <Component {...pageProps} />
      </SessionProvider>
    </div>
  )
}

export default api.withTRPC(MyApp)
