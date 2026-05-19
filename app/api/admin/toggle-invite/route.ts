import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (prisma.user as any).findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await (prisma.user as any).update({
      where: { id: userId },
      data: { canInvite: !user.canInvite },
    })
    return NextResponse.json({ canInvite: updated.canInvite })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
