import Link from 'next/link'
import { ConnectButton } from '@/components/wallet/ConnectButton'

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'PROJECT'

export function Navbar() {
  return (
    <nav className="sticky top-0 bg-[#0a0e1a] border-b border-white/[0.07] z-50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-8 max-sm:px-4 py-4 max-sm:py-[14px]">
        <Link href="/" className="text-[17px] font-medium text-white tracking-[0.4px] no-underline">
          [<span className="text-[#3d8ef8]">{APP_NAME[0]}</span>{APP_NAME.slice(1)}]
        </Link>
        <div className="flex items-center gap-3">
          <ConnectButton />
        </div>
      </div>
    </nav>
  )
}
