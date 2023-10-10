import Head from 'next/head'

import { signIn, useSession } from 'next-auth/react'
import useStore from '~/store/useStore'
import clsx from 'clsx'
import Button from '~/components/Button'
import MenuButton from '~/components/Menu/MenuButton'

export default function Home() {
  const [isDarkTheme] = useStore((state) => [state.isDarkTheme])
  const { data: sessionData } = useSession()
  return (
    <>
      <Head>
        <title>Fasti</title>
        <meta name="description" content="Generated by create-t3-app" />
      </Head>

      <div className="relative flex h-fit w-screen flex-col overflow-auto">
        <section className="relative flex h-[calc(100vh-3.5rem)] w-screen shrink-0 items-center justify-center">
          <div className="relative -mt-20">
            <h1 className="text-8xl font-bold">craft</h1>
            <p className="-mt-3 ml-2 flex flex-row text-3xl">
              your &nbsp; <span className="mt-1 font-kalam"> chronicles</span>
            </p>
          </div>

          <div className="absolute bottom-4 flex flex-col items-center justify-center opacity-50">
            <svg
              width="2"
              height="26"
              viewBox="0 0 2 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 0.797119L1 24.7971"
                stroke="#3F3F46"
                strokeOpacity={isDarkTheme ? '1' : '0.5'}
                strokeLinecap="round"
              />
            </svg>
            <p>scroll</p>
          </div>
        </section>
        <section className="relative flex h-[calc(100vh-3.5rem)] w-screen shrink-0 flex-col p-4 md:p-12">
          <div className="h-56">
            <h1 className="text-5xl font-bold">Welcome to Fasti,</h1>
          </div>
          <div className="relative h-56 self-end">
            <h1 className="flex flex-row text-5xl font-bold">
              the ultimate &nbsp;{' '}
              <span className="mt-1 font-kalam">scheduling</span>
            </h1>
          </div>
          <div>
            <h1 className="relative flex h-56 flex-row text-5xl font-bold">
              and &nbsp; <span className="mt-1 font-kalam">journaling</span>{' '}
              &nbsp; app
            </h1>
          </div>

          <div className="relative self-end">
            <p className="max-w-md">
              designed to bring the ancient wisdom of timekeeping to the digital
              age. Embrace the power of Fasti*, as you embark on a journey of
              efficient scheduling and meaningful reflection.
            </p>{' '}
            <p className="text-sm opacity-50">
              * - the Latin word for “calendar” or “chronicles”
            </p>
          </div>
        </section>
        <section className="relative flex h-[calc(100vh-3.5rem)] w-screen shrink-0 flex-col">
          <div className="relative flex h-[calc(100%-8rem)] w-full shrink-0 flex-col p-4 md:p-12">
            <h1 className="text-5xl font-bold">Why Fasti?</h1>
            <div className="relative grid h-full w-full grid-cols-2 grid-rows-2 gap-2 ">
              <div className="relative flex flex-col justify-center gap-1 p-4">
                <h2 className="text-xl font-medium">
                  1. Effortless Scheduling:
                </h2>
                <p>
                  Fasti simplifies your life by allowing you to schedule events,
                  meetings, and tasks with ease. Our user-friendly interface
                  ensures you&apos;ll never miss an important date.
                </p>
              </div>
              <div className="relative flex flex-col justify-center gap-1 p-4">
                <h2 className="text-xl font-medium">2. Seamless Journaling:</h2>
                <p>
                  Fasti goes beyond scheduling. It&apos;s a digital journal that
                  lets you capture your thoughts, emotions, and memories
                  associated with each day.
                </p>
              </div>
              <div className="relative flex flex-col justify-center gap-1 p-4">
                <h2 className="text-xl font-medium">
                  3. Privacy and Security:
                </h2>
                <p>
                  Your data is precious, and we understand that. Fasti employs
                  robust security measures to protect your information, ensuring
                  your peace of mind.
                </p>
              </div>
              <div className="relative flex flex-col justify-center gap-1 p-4">
                <h2 className="text-xl font-medium">
                  4. Inspiration and Motivation:
                </h2>
                <p>
                  Fasti inspires you to set goals, track your progress, and
                  celebrate your achievements. Stay motivated and organized with
                  our intuitive features.
                </p>
              </div>
            </div>
          </div>

          <div
            className={clsx(
              'relative flex h-32 w-screen shrink-0 flex-col items-center justify-center gap-2 border-t',
              {
                'border-lightThemeBorder': !isDarkTheme,
                'border-darkThemeBorder': isDarkTheme,
              }
            )}
          >
            <p>To try an app, please sign in</p>{' '}
            <Button
              size="md"
              onClick={() =>
                void signIn(undefined, { callbackUrl: '/calendar' })
              }
            >
              Sign in
            </Button>
          </div>
        </section>
        <footer
          className={clsx(
            'relative flex h-[calc(100vh-3.5rem-8rem)] w-screen shrink-0 flex-col items-center justify-center p-4 md:flex-row'
          )}
        >
          <div className="relative -mt-8 flex h-full w-1/2 items-center justify-center">
            <h1 className="text-2xl font-bold">First Footer Section</h1>
          </div>
          <div className="relative flex h-full w-1/2 items-center justify-center">
            <form
              className={clsx(
                'relative -mt-8 flex flex-col gap-4 rounded px-4 py-6 drop-shadow',
                {
                  'bg-darkThemeSecondaryBG': isDarkTheme,
                  'bg-lightThemeSecondaryBG': !isDarkTheme,
                }
              )}
              onSubmit={(e) => e.preventDefault()}
            >
              <h1 className="text-xl">Subscribe to our newsletter</h1>
              <input
                className={clsx(
                  'rounded-md px-1 py-1 outline outline-2 focus:outline-accent',
                  {
                    'bg-darkThemeSecondaryBG outline-darkThemeBorder':
                      isDarkTheme,
                    'bg-lightThemeSecondaryBG outline-lightThemeBorder':
                      !isDarkTheme,
                  }
                )}
                type="email"
              />
              <Button className="relative flex w-fit self-end" type="submit">
                submit
              </Button>
            </form>
          </div>
        </footer>
      </div>
    </>
  )
}
