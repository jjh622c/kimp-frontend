const STEP_LABELS = ['Token', 'Method', 'Transfer', 'Done']

interface StepHeaderProps {
  current: number
  total: number
}

export function StepHeader({ current, total }: StepHeaderProps) {
  return (
    <div className="w-full">
      {/* Step dots row — labels hidden on mobile to prevent 390px overlap */}
      <div className="flex items-start justify-between mb-3">
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1
          const isDone = step < current
          const isCurrent = step === current
          return (
            <div key={step} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${
                  isDone
                    ? 'bg-[#3d8ef8]/20 text-[#3d8ef8]'
                    : isCurrent
                    ? 'bg-[#3d8ef8] text-white'
                    : 'bg-white/[0.06] text-white/30'
                }`}
              >
                {isDone ? '✓' : step}
              </div>
              <span className="hidden sm:block text-[10px] text-white/40">
                {STEP_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3d8ef8] rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase">
          Step {current} of {total}
        </span>
        <span className="text-[11px] text-white/[0.28]">
          {Math.round((current / total) * 100)}%
        </span>
      </div>
    </div>
  )
}
