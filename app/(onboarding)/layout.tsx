import Link from 'next/link'
import { ConnectButton } from '@/components/wallet/ConnectButton'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'PROJECT'

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <div className="border-b border-white/[0.07]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between px-8 py-4">
          <Link href="/" className="text-[17px] font-medium text-white tracking-[0.4px] no-underline">
            [<span className="text-[#3d8ef8]">{APP_NAME[0]}</span>{APP_NAME.slice(1)}]
          </Link>
          <ConnectButton />
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {children}
      </div>
    </div>
  )
}
