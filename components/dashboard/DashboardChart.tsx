'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

const PERIODS = ['1W', '1M', 'ALL'] as const
type Period = (typeof PERIODS)[number]

// PriceChartCard와 동일한 모의 데이터
const MOCK_DATA: { time: string; value: number }[] = (() => {
  const points = [
    { day: 0,   price: 1000 },
    { day: 31,  price: 1100 },
    { day: 59,  price: 1122 },
    { day: 90,  price: 1140 },
    { day: 120, price: 1155 },
    { day: 138, price: 1162 },
  ]
  const result: { time: string; value: number }[] = []
  const start = new Date('2026-01-01')

  for (let i = 0; i <= 138; i++) {
    const date = new Date(start)
    date.setDate(date.getDate() + i)

    let prev = points[0], next = points[points.length - 1]
    for (let j = 0; j < points.length - 1; j++) {
      if (i >= points[j].day && i <= points[j + 1].day) {
        prev = points[j]; next = points[j + 1]; break
      }
    }
    const t = next.day === prev.day ? 1 : (i - prev.day) / (next.day - prev.day)
    const base = prev.price + t * (next.price - prev.price)
    const noise = Math.sin(i * 0.71) * 7 + Math.sin(i * 1.37) * 3
    const timeStr = date.toISOString().split('T')[0]
    result.push({ time: timeStr, value: Math.round(base + noise) })
  }
  return result
})()

function filterByPeriod(data: { time: string; value: number }[], period: Period) {
  if (period === 'ALL') return data
  const ms = period === '1W' ? 7 * 86400000 : 30 * 86400000
  const cutoff = new Date(Date.now() - ms).toISOString().split('T')[0]
  return data.filter((d) => d.time >= cutoff)
}

interface DashboardChartProps {
  data?: { date: string; price: number }[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  const [period, setPeriod] = useState<Period>('ALL')
  const containerRef = useRef<HTMLDivElement>(null)

  const chartData =
    data && data.length > 0
      ? data.map((d) => ({ time: d.date.split('T')[0], value: d.price }))
      : MOCK_DATA

  const filtered = filterByPeriod(chartData, period)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const chart = createChart(el, {
      autoSize: true,
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
      height: 220,
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
          Token Price
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
      <div ref={containerRef} style={{ height: 220 }} />
    </div>
  )
}
