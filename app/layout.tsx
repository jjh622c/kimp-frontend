import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import DevPanel from '@/components/dev/DevPanel'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'KiMP Vault'
const APP_URL = process.env.NEXTAUTH_URL ?? 'https://kimp.example.com'

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Private Arbitrage Protocol`,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Korea premium arbitrage bot. Auditable on-chain. Private access only.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Private Arbitrage Protocol`,
    description: 'Korea premium arbitrage bot. Auditable on-chain. Private access only.',
  },
  twitter: {
    card: 'summary',
    title: `${APP_NAME} — Private Arbitrage Protocol`,
    description: 'Korea premium arbitrage bot. Auditable on-chain. Private access only.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <DevPanel />
      </body>
    </html>
  )
}
