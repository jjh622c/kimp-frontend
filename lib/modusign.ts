const MODUSIGN_API_BASE = 'https://api.modusign.co.kr'
const API_KEY = process.env.MODUSIGN_API_KEY

export type ModusignSession = {
  documentId: string
  signingUrl: string
}

// 서명 세션 생성. MODUSIGN_API_KEY 없으면 null 반환(플레이스홀더 UI 표시).
export async function createSigningSession(params: {
  inviteToken: string
  signerName?: string
  signerEmail?: string
}): Promise<ModusignSession | null> {
  if (!API_KEY) return null

  const res = await fetch(`${MODUSIGN_API_BASE}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      title: '투자 계약서',
      participantMappings: [
        {
          signerName: params.signerName ?? '투자자',
          signerEmail: params.signerEmail,
          role: 'SIGNER',
        },
      ],
      // TODO: 실제 계약서 템플릿 ID로 교체
      templateId: process.env.MODUSIGN_TEMPLATE_ID,
      metadata: { inviteToken: params.inviteToken },
    }),
  })

  if (!res.ok) return null

  const data = await res.json()
  const signingUrl: string = data?.participantMappings?.[0]?.embedded?.embeddedUrl ?? null
  if (!signingUrl) return null

  return { documentId: data.id, signingUrl }
}

// 모두싸인 웹훅 서명 검증 (X-Modusign-Signature 헤더 확인)
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  if (!API_KEY) return false
  const crypto = require('crypto') as typeof import('crypto')
  const expected = crypto.createHmac('sha256', API_KEY).update(payload).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
