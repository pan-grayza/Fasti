import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/') {
    // Redirect from /-> /hello-nextjs
    return NextResponse.redirect(new URL('/calendar', req.nextUrl))
  }
  return NextResponse.next()
}
