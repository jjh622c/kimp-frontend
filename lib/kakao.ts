// 카카오 알림톡 (비즈니스 메시지 API)
// 실제 발송은 KAKAO_API_KEY + 카카오 채널 ID 설정 후 활성화
// 참고: https://developers.kakao.com/docs/latest/ko/message/rest-api

const API_KEY = process.env.KAKAO_API_KEY
const CHANNEL_ID = process.env.KAKAO_CHANNEL_ID // 카카오 채널 ID (@채널명)

// 알림톡 템플릿 코드 (카카오 비즈센터에서 심사 후 발급)
export const KAKAO_TEMPLATES = {
  DEPOSIT_CONFIRMED: 'DEPOSIT_CONFIRMED',   // 입금 확인 완료
  TOKEN_ISSUED: 'TOKEN_ISSUED',             // 토큰 발행 완료
  WITHDRAW_APPROVED: 'WITHDRAW_APPROVED',   // 출금 승인
  WITHDRAW_COMPLETED: 'WITHDRAW_COMPLETED', // 출금 완료
  WITHDRAW_REJECTED: 'WITHDRAW_REJECTED',   // 출금 거절
} as const

export type KakaoTemplate = typeof KAKAO_TEMPLATES[keyof typeof KAKAO_TEMPLATES]

interface AlimtalkParams {
  phone: string           // 수신자 전화번호 (010-XXXX-XXXX 또는 01XXXXXXXXX)
  templateCode: KakaoTemplate
  variables: Record<string, string>  // 템플릿 변수 (#{변수명} 치환)
}

// 카카오 알림톡 발송. 실패 시 false 반환 (서비스 중단 없이 graceful)
export async function sendAlimtalk(params: AlimtalkParams): Promise<boolean> {
  if (!API_KEY || !CHANNEL_ID) return false

  const phone = params.phone.replace(/-/g, '')

  try {
    const res = await fetch('https://kapi.kakao.com/v1/api/talk/friends/message/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${API_KEY}`,
      },
      body: new URLSearchParams({
        template_object: JSON.stringify({
          object_type: 'text',
          channel_public_id: CHANNEL_ID,
          template_id: params.templateCode,
          receiver_uuids: JSON.stringify([phone]),
          arguments: params.variables,
        }),
      }),
    })

    return res.ok
  } catch {
    return false
  }
}

// 입금 확인 알림
export function notifyDepositConfirmed(phone: string, params: {
  investorName: string
  amountKrw: string
  tokenAmount: string
}) {
  return sendAlimtalk({
    phone,
    templateCode: KAKAO_TEMPLATES.DEPOSIT_CONFIRMED,
    variables: {
      '#{이름}': params.investorName,
      '#{입금금액}': params.amountKrw,
      '#{토큰수량}': params.tokenAmount,
    },
  })
}

// 출금 승인 알림
export function notifyWithdrawApproved(phone: string, params: {
  investorName: string
  tokenAmount: string
  krwAmount: string
}) {
  return sendAlimtalk({
    phone,
    templateCode: KAKAO_TEMPLATES.WITHDRAW_APPROVED,
    variables: {
      '#{이름}': params.investorName,
      '#{토큰수량}': params.tokenAmount,
      '#{지급금액}': params.krwAmount,
    },
  })
}

// 출금 완료 알림
export function notifyWithdrawCompleted(phone: string, params: {
  investorName: string
  krwAmount: string
  txHash?: string
}) {
  return sendAlimtalk({
    phone,
    templateCode: KAKAO_TEMPLATES.WITHDRAW_COMPLETED,
    variables: {
      '#{이름}': params.investorName,
      '#{지급금액}': params.krwAmount,
      '#{트랜잭션}': params.txHash ?? '-',
    },
  })
}
