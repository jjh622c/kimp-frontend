interface InvestmentTimelineProps {
  contractSigned: boolean
  depositConfirmed: boolean
  tokenMinted: boolean
  status: string
}

const STEPS = [
  { key: 'contract', label: '계약서 서명', desc: '투자 계약서에 서명 완료' },
  { key: 'deposit', label: '입금 확인', desc: '관리자가 입금을 확인' },
  { key: 'minted', label: '토큰 발행', desc: 'ERC-20 토큰 지갑 전송' },
  { key: 'active', label: '운용 중', desc: '봇 수익 바이백 진행' },
]

function getStepState(
  stepKey: string,
  contractSigned: boolean,
  depositConfirmed: boolean,
  tokenMinted: boolean,
  status: string,
): 'done' | 'current' | 'pending' {
  const isDone = {
    contract: contractSigned,
    deposit: depositConfirmed,
    minted: tokenMinted,
    active: status === 'ACTIVE' || status === 'WITHDRAWN',
  }[stepKey] ?? false

  if (isDone) return 'done'

  const isCurrent = {
    contract: !contractSigned,
    deposit: contractSigned && !depositConfirmed,
    minted: depositConfirmed && !tokenMinted,
    active: tokenMinted && status !== 'ACTIVE' && status !== 'WITHDRAWN',
  }[stepKey] ?? false

  return isCurrent ? 'current' : 'pending'
}

export function InvestmentTimeline({
  contractSigned,
  depositConfirmed,
  tokenMinted,
  status,
}: InvestmentTimelineProps) {
  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
      <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-4">
        투자 진행 단계
      </div>

      <div className="relative">
        {/* 연결선 */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/[0.07]" />

        <div className="space-y-5">
          {STEPS.map((step) => {
            const state = getStepState(
              step.key,
              contractSigned,
              depositConfirmed,
              tokenMinted,
              status,
            )

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* 아이콘 */}
                <div
                  className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center shrink-0 z-10 ${
                    state === 'done'
                      ? 'bg-[#22c55e]/15 border-[#22c55e]/40'
                      : state === 'current'
                      ? 'bg-[#3d8ef8]/15 border-[#3d8ef8]/50'
                      : 'bg-[#0a0e1a] border-white/[0.1]'
                  }`}
                >
                  {state === 'done' ? (
                    <svg className="w-3.5 h-3.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : state === 'current' ? (
                    <span className="w-2 h-2 rounded-full bg-[#3d8ef8] animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white/[0.15]" />
                  )}
                </div>

                {/* 텍스트 */}
                <div className="pt-[5px]">
                  <div
                    className={`text-sm font-medium ${
                      state === 'done'
                        ? 'text-[#22c55e]'
                        : state === 'current'
                        ? 'text-white'
                        : 'text-white/30'
                    }`}
                  >
                    {step.label}
                    {state === 'current' && (
                      <span className="ml-2 text-[10px] font-normal bg-[#3d8ef8]/15 text-[#3d8ef8] rounded-full px-2 py-0.5">
                        진행 중
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/[0.28] mt-0.5">{step.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {status === 'WITHDRAWN' && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white/30 shrink-0" />
          <span className="text-xs text-white/40">출금 완료 — 투자가 종료되었습니다</span>
        </div>
      )}
    </div>
  )
}
