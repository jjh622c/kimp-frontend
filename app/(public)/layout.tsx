import { Navbar } from '@/components/layout/Navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Navbar />
      <div className="max-w-[1280px] mx-auto">
        {children}
      </div>
    </div>
  )
}
