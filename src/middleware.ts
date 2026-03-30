import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/workspace', '/history', '/connectors', '/settings', '/runs', '/artifacts']
const authRoutes = ['/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('v_session')?.value

  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuth = authRoutes.some((r) => pathname.startsWith(r))

  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (isAuth && sessionToken) {
    return NextResponse.redirect(new URL('/workspace', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
