interface ProgressStep {
  label: string
  done: boolean
  active?: boolean
  note?: string
}

interface InvestmentProgressProps {
  steps: ProgressStep[]
}

export function InvestmentProgress({ steps }: InvestmentProgressProps) {
  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5 mb-5">
      <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px] mb-5">
        Investment Progress
      </div>

      <div>
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={step.label} className="flex gap-3">
              {/* Indicator column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center ${
                    step.done
                      ? 'bg-[#22c55e]/20 border border-[#22c55e]/50'
                      : step.active
                      ? 'bg-[#3d8ef8]/20 border-2 border-[#3d8ef8]'
                      : 'bg-white/[0.04] border border-white/[0.12]'
                  } ${step.active ? 'animate-pulse' : ''}`}
                >
                  {step.done && (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path
                        d="M2 4.5L3.8 6.5L7 2.5"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-px flex-1 my-[3px] ${
                      step.done ? 'bg-[#22c55e]/20' : 'bg-white/[0.07]'
                    }`}
                    style={{ minHeight: '18px' }}
                  />
                )}
              </div>

              {/* Label + status */}
              <div className={`flex-1 flex items-start justify-between gap-2 ${isLast ? 'pb-0' : 'pb-[18px]'}`}>
                <span
                  className={`text-sm leading-[1.4] ${
                    step.done
                      ? 'text-white/55'
                      : step.active
                      ? 'text-white font-medium'
                      : 'text-white/25'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`text-[11px] shrink-0 ${
                    step.done
                      ? 'text-[#22c55e]/70'
                      : step.active
                      ? 'text-[#3d8ef8]/80'
                      : 'text-white/20'
                  }`}
                >
                  {step.done
                    ? '✓'
                    : step.active
                    ? (step.note ?? '⏳ Pending')
                    : '○'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Pre-built step sets for convenience
export const STEPS_COMPLETE: ProgressStep[] = [
  { label: 'Token added to wallet',          done: true  },
  { label: 'Investment agreement signed',    done: true  },
  { label: 'Deposit confirmed',              done: true  },
  { label: 'Token issued',                   done: true  },
  { label: 'Bot profit buyback in progress', done: true  },
]

export const STEPS_DEPOSIT_PENDING: ProgressStep[] = [
  { label: 'Token added to wallet',          done: true,  active: false },
  { label: 'Investment agreement signed',    done: true,  active: false },
  { label: 'Deposit confirmed',              done: false, active: true, note: 'Pending admin confirmation' },
  { label: 'Token issued',                   done: false, active: false },
  { label: 'Bot profit buyback in progress', done: false, active: false },
]
