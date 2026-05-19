import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 })

  try {
    await prisma.inviteLink.update({
      where: { token },
      data: { expiresAt: new Date(0) },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Link not found or already revoked' }, { status: 404 })
  }
}
