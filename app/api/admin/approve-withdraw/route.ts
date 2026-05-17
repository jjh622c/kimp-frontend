import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyWithdrawApproved } from '@/lib/kakao'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if ((session?.user as { role?: string })?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { requestId } = await req.json()
  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 })

  const updated = await prisma.withdrawRequest.update({
    where: { id: requestId },
    data: { status: 'APPROVED', processedAt: new Date() },
    include: { user: { select: { name: true, email: true } } },
  })

  // 카카오 알림톡 (phone 필드 추가 후 활성화)
  // TODO: User 모델에 phone 필드 추가
  void notifyWithdrawApproved('', {
    investorName: updated.user.name ?? updated.user.email ?? '투자자',
    tokenAmount: updated.tokenAmount.toString() + ' 토큰',
    krwAmount: updated.krwAmount.toLocaleString('ko-KR') + '원',
  })

  return NextResponse.json({ ok: true, status: updated.status })
}
