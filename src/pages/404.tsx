import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 text-3xl font-bold">
      <p className="-mt-16">Page not Found 404</p>
      <div className="text-blue-600 underline">
        <Link href="/">Go to Home page</Link>
      </div>
    </div>
  )
}

export default Page
