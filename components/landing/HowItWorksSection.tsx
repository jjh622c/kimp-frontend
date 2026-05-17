const steps = [
  {
    num: 'STEP 01',
    title: 'Sign agreement',
    desc: 'Review and sign the investment agreement online. Invite-only access.',
  },
  {
    num: 'STEP 02',
    title: 'Deposit funds',
    desc: 'Transfer KRW to the provided account. Confirmation within 24h.',
  },
  {
    num: 'STEP 03',
    title: 'Receive tokens & earn',
    desc: 'Tokens issued to your wallet. Track returns on your dashboard.',
  },
]

export function HowItWorksSection() {
  return (
    <div className="px-8 max-sm:px-4 py-10 max-sm:py-8">
      <div className="text-[11px] text-white/[0.28] tracking-[1.2px] uppercase mb-3.5">
        How it works
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-[#0e1425] border border-white/[0.07] rounded-[10px] p-[18px]"
          >
            <div className="text-[11px] text-[#3d8ef8] font-medium mb-2.5 tracking-[0.5px]">
              {step.num}
            </div>
            <div className="text-[13px] font-medium text-white mb-[5px]">{step.title}</div>
            <div className="text-[11px] text-white/30 leading-[1.6]">{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
