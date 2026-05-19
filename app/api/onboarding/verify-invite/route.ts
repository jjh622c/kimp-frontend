import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: called by middleware when ?invite=TOKEN is detected
// Verifies token → sets kimp_access cookie → redirects to step1 with token in URL
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/gate?error=missing', req.url))
  }

  try {
    const invite = await prisma.inviteLink.findUnique({ where: { token } })

    if (!invite) {
      return NextResponse.redirect(new URL('/gate?error=invalid', req.url))
    }
    if (invite.usedBy) {
      return NextResponse.redirect(new URL('/gate?error=used', req.url))
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.redirect(new URL('/gate?error=expired', req.url))
    }

    // Valid token — set gate cookie and redirect to onboarding step1
    const response = NextResponse.redirect(
      new URL(`/onboarding/step1?token=${encodeURIComponent(token)}`, req.url)
    )
    response.cookies.set('kimp_access', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.redirect(new URL('/gate?error=server', req.url))
  }
}

// POST: called by InvitePopup on the landing page
// Verifies token → sets kimp_access cookie → returns { valid: true }
export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 })
  }

  try {
    const invite = await prisma.inviteLink.findUnique({ where: { token } })

    if (!invite) {
      return NextResponse.json({ valid: false, error: 'Invalid invite code. Please check and try again.' }, { status: 401 })
    }
    if (invite.usedBy) {
      return NextResponse.json({ valid: false, error: 'This invite code has already been used.' }, { status: 409 })
    }
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'This invite code has expired.' }, { status: 410 })
    }

    // Set gate cookie so the user can access the platform
    const response = NextResponse.json({ valid: true, token, inviteId: invite.id })
    response.cookies.set('kimp_access', '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
