import { Suspense } from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { MarketsSection } from '@/components/landing/MarketsSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { RiskFooter } from '@/components/landing/RiskFooter'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<MarketsSkeleton />}>
        <MarketsSection />
      </Suspense>
      <div className="h-px bg-white/5 mx-8 max-sm:mx-0" />
      <HowItWorksSection />
      <RiskFooter />
    </main>
  )
}

function MarketsSkeleton() {
  return (
    <div className="px-8 max-sm:px-4 pb-12 max-sm:pb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-white/[0.28] tracking-[1.2px] uppercase">Active Vault</span>
        <span className="text-xs text-white/[0.22]">1 vault</span>
      </div>
      <div className="w-full border border-white/[0.07] rounded-xl h-16 bg-[#0e1425] animate-pulse" />
    </div>
  )
}
