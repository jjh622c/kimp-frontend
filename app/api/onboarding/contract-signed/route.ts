// 모두싸인 서명 완료 웹훅
// X-Modusign-Signature 헤더 검증 필요 (Phase 1 구현 시 추가)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // TODO: verify modusign webhook signature
  // const sig = req.headers.get('X-Modusign-Signature')

  const { userId, documentId } = body

  if (!userId || !documentId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await prisma.investment.upsert({
    where: { userId },
    update: { contractSigned: true },
    create: {
      userId,
      amountKrw: 0,
      tokenAmount: 0,
      entryPrice: 1000,
      contractSigned: true,
    },
  })

  return NextResponse.json({ ok: true })
}
