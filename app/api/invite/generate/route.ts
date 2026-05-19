import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isAdmin = (session.user as { role?: string })?.role === 'admin'

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma.user as any).findUnique({
      where: { email: session.user.email },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!isAdmin) {
      if (!user.canInvite) return NextResponse.json({ error: 'Not authorized to invite' }, { status: 403 })
      if (user.referralDepth >= 2) return NextResponse.json({ error: 'Max referral depth reached' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const expiresInDays: number = isAdmin ? (body.expiresInDays ?? 7) : 7
    const maxUses: number = isAdmin ? (body.maxUses ?? 1) : 1
    const depth: number = isAdmin ? 0 : (user.referralDepth as number) + 1

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link = await (prisma.inviteLink as any).create({
      data: { createdById: user.id, depth, maxUses, expiresAt },
    })

    const origin = req.headers.get('origin') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    return NextResponse.json({ url: `${origin}/?invite=${link.token}`, token: link.token })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
