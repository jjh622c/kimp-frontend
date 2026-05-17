import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKrw(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount) + ' KRW'
}

export function formatPercent(value: number, digits = 2): string {
  return (value >= 0 ? '+' : '') + value.toFixed(digits) + '%'
}
