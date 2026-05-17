import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ valid: false, error: 'Missing token' }, { status: 400 })
  }

  const invite = await prisma.inviteLink.findUnique({ where: { token } })

  if (!invite) return NextResponse.json({ valid: false, error: 'Invalid invite' }, { status: 404 })
  if (invite.usedBy) return NextResponse.json({ valid: false, error: 'Already used' }, { status: 409 })
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: 'Expired' }, { status: 410 })
  }

  return NextResponse.json({ valid: true, inviteId: invite.id })
}
