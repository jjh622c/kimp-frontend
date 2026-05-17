interface StepHeaderProps {
  current: number
  total: number
}

export function StepHeader({ current, total }: StepHeaderProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-white/[0.28] tracking-[0.5px] uppercase">
          Step {current} of {total}
        </span>
        <span className="text-[11px] text-white/[0.28]">{Math.round((current / total) * 100)}%</span>
      </div>
      <div className="w-full h-[2px] bg-white/[0.07] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3d8ef8] rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
