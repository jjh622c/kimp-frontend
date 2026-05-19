import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, links] = await Promise.all([
      (prisma.user as any).findMany({
        select: {
          id: true,
          name: true,
          email: true,
          canInvite: true,
          referralDepth: true,
          referredById: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      (prisma.inviteLink as any).findMany({
        select: {
          id: true,
          token: true,
          createdById: true,
          usedById: true,
          depth: true,
          maxUses: true,
          useCount: true,
          expiresAt: true,
          usedAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const serialized = {
      users: users.map((u: Record<string, unknown> & { createdAt: Date }) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      links: links.map((l: Record<string, unknown> & { expiresAt: Date | null; usedAt: Date | null; createdAt: Date }) => ({
        ...l,
        expiresAt: l.expiresAt?.toISOString() ?? null,
        usedAt: l.usedAt?.toISOString() ?? null,
        createdAt: l.createdAt.toISOString(),
      })),
    }

    return NextResponse.json(serialized)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
