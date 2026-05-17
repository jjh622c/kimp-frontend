import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/modusign'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-modusign-signature') ?? ''

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as {
    eventType: string
    document?: { id: string; metadata?: { inviteToken?: string } }
  }

  if (event.eventType === 'document.completed') {
    const inviteToken = event.document?.metadata?.inviteToken
    if (inviteToken) {
      // 계약 서명 완료 → DB 반영
      await prisma.inviteLink
        .update({
          where: { token: inviteToken },
          data: { usedAt: new Date() },
        })
        .catch(() => null)
    }
  }

  return NextResponse.json({ ok: true })
}
