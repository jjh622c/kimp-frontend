export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-6 h-6 rounded-full border-2 border-[#3d8ef8] border-t-transparent animate-spin" />
        <span className="text-xs text-white/[0.25]">Loading…</span>
      </div>
    </div>
  )
}
