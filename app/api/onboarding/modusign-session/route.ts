import { NextRequest, NextResponse } from 'next/server'
import { createSigningSession } from '@/lib/modusign'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { token, signerName, signerEmail } = body as {
    token?: string
    signerName?: string
    signerEmail?: string
  }

  if (!token) {
    return NextResponse.json({ error: 'token required' }, { status: 400 })
  }

  // 초대 토큰 유효성 재확인
  const invite = await prisma.inviteLink
    .findUnique({ where: { token } })
    .catch(() => null)

  if (!invite || invite.usedAt) {
    return NextResponse.json({ error: 'invalid token' }, { status: 400 })
  }

  const session = await createSigningSession({ inviteToken: token, signerName, signerEmail })

  if (!session) {
    // API 키 미설정 — 프론트에서 플레이스홀더 UI 유지
    return NextResponse.json({ ready: false })
  }

  return NextResponse.json({ ready: true, signingUrl: session.signingUrl, documentId: session.documentId })
}
