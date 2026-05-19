'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import { PRICE_CHART_DATA } from '@/lib/data/monthly-returns'

const PERIODS = ['1Y', 'ALL'] as const
type Period = (typeof PERIODS)[number]

function filterByPeriod(data: { time: string; value: number }[], period: Period) {
  if (period === 'ALL') return data
  const cutoff = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0]
  return data.filter((d) => d.time >= cutoff)
}

interface PriceChartCardProps {
  data?: { date: string; price: number }[]
}

export function PriceChartCard({ data }: PriceChartCardProps) {
  const [period, setPeriod] = useState<Period>('ALL')
  const containerRef = useRef<HTMLDivElement>(null)

  const chartData =
    data && data.length > 0
      ? data.map((d) => ({ time: d.date.split('T')[0], value: d.price }))
      : PRICE_CHART_DATA

  const filtered = filterByPeriod(chartData, period)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'rgba(255,255,255,0.35)',
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(61,142,248,0.4)', width: 1 },
        horzLine: { color: 'rgba(61,142,248,0.4)', width: 1 },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: false,
      },
      autoSize: true,
      height: 176,
      handleScroll: false,
      handleScale: false,
    })

    const series = chart.addLineSeries({
      color: '#3d8ef8',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: '#3d8ef8',
      crosshairMarkerBackgroundColor: '#0e1425',
    })

    series.setData(filtered)
    chart.timeScale().fitContent()

    return () => {
      chart.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, data])

  return (
    <div className="bg-[#0e1425] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] text-white/[0.28] uppercase tracking-[0.5px]">
          Token Price History
        </div>
        <div className="flex items-center gap-0.5 bg-white/[0.04] rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                period === p ? 'bg-[#3d8ef8] text-white' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="h-44" />
      <div className="flex justify-between text-[10px] text-white/[0.28] pt-1">
        <span>Oct 2022</span>
        <span>May 2026</span>
      </div>
    </div>
  )
}
