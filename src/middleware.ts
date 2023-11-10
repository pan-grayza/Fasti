import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const validCalendarURL =
    request.nextUrl.pathname === '/calendar/day' ||
    request.nextUrl.pathname === '/calendar/week' ||
    request.nextUrl.pathname === '/calendar/month' ||
    request.nextUrl.pathname === '/calendar/year'
  if (!validCalendarURL && request.nextUrl.pathname.startsWith('/calendar')) {
    return NextResponse.redirect(new URL('/calendar/month', request.url))
  }
}

export const config = {
  matcher: '/calendar/(.*)',
}
