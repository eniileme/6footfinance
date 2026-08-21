import { getActiveLocale } from './locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(getActiveLocale(), {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat(getActiveLocale(), {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat(getActiveLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function isCurrentMonth(dateStr: string): boolean {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export function monthsRemainingInYear(): number {
  const now = new Date()
  return 12 - now.getMonth()
}
