import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that bypass the invite gate entirely
const GATE_EXEMPT_PREFIXES = [
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/api/oracle',
  '/api/onboarding/verify-invite',
  '/api/dev/bypass',
  '/gate',
]

// Paths requiring a NextAuth session
const AUTH_REQUIRED_PREFIXES = ['/dashboard', '/admin']

function isGateExempt(path: string) {
  return GATE_EXEMPT_PREFIXES.some((p) => path.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Always pass static assets through
  if (path.startsWith('/_next') || path === '/favicon.ico') {
    return NextResponse.next()
  }

  // If ?invite=TOKEN is in the URL, hand off to the gate verification API
  const inviteToken = req.nextUrl.searchParams.get('invite')
  if (inviteToken && !path.startsWith('/api')) {
    const verifyUrl = new URL('/api/onboarding/verify-invite', req.url)
    verifyUrl.searchParams.set('token', inviteToken)
    return NextResponse.redirect(verifyUrl)
  }

  // Gate check — require kimp_access cookie for all non-exempt paths
  const hasAccess = req.cookies.get('kimp_access')?.value
  if (!isGateExempt(path) && !hasAccess) {
    return NextResponse.redirect(new URL('/gate', req.url))
  }

  // Auth check for protected routes
  if (AUTH_REQUIRED_PREFIXES.some((p) => path.startsWith(p))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const signInUrl = new URL('/auth/login', req.url)
      signInUrl.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(signInUrl)
    }
    if (path.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
