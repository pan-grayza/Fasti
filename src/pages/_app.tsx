import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/globals.css'
import NavBar from '~/components/Navbar/NavBar'
import Sidebar from '~/components/Sidebar/Sidebar'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden text-gray-800">
      <SessionProvider session={session}>
        <NavBar />

        <Component {...pageProps} />
      </SessionProvider>
    </div>
  )
}

export default api.withTRPC(MyApp)
