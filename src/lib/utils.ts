import { Period, PaymentRecord } from '@/types'

const PERIOD_DAYS: Record<Period, number> = {
  WEEKLY: 7,
  MONTHLY: 365.25 / 12,
  QUARTERLY: 365.25 / 4,
  YEARLY: 365.25,
}

// Get the next renewal date based on an initial renewal date and a period.
export function getNextRenewalDate(renewalDate: Date, period: Period): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const next = new Date(renewalDate)
  next.setHours(0, 0, 0, 0)

  if (next > today) return next

  while (next <= today) {
    switch (period) {
      case 'WEEKLY':
        next.setDate(next.getDate() + 7)
        break
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1)
        break
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3)
        break
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + 1)
        break
    }
  }

  return next
}

// Get the number of days until a renewal date
export function getDaysUntilRenewal(renewalDate: Date, period: Period): number {
  const next = getNextRenewalDate(renewalDate, period)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

// Get if a subscription is renewing within 7 days
export function isRenewingSoon(
  renewalDate: Date,
  period: Period,
  withinDays = 7
): boolean {
  return getDaysUntilRenewal(renewalDate, period) <= withinDays
}

// Get the cost based on a period
export function normalizeCost(
  price: number,
  subPeriod: Period,
  displayPeriod: Period
): number {
  const dailyRate = price / PERIOD_DAYS[subPeriod]
  return dailyRate * PERIOD_DAYS[displayPeriod]
}

// Get the total cost of a list of subscriptions based on a period
export function getTotalCost(
  subscriptions: Array<{ price: number; period: string }>,
  displayPeriod: Period
): number {
  return subscriptions.reduce((sum, sub) => {
    return sum + normalizeCost(sub.price, sub.period as Period, displayPeriod)
  }, 0)
}

// Get the label of a period
export function getPeriodLabel(period: string): string {
  const labels: Record<string, string> = {
    WEEKLY: 'wk',
    MONTHLY: 'mo',
    QUARTERLY: 'qtr',
    YEARLY: 'yr',
  }
  return labels[period] ?? period.toLowerCase()
}

// Get the full display label of a period
export function getPeriodDisplayLabel(period: string): string {
  const labels: Record<string, string> = {
    WEEKLY: 'Weekly',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    YEARLY: 'Yearly',
  }
  return labels[period] ?? period
}

// Format a given date as a string
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Format a currency into USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Get a list of past payments based on a renewal date and period
export function getPastPayments(
  renewalDate: Date | string,
  period: Period,
  price: number
): PaymentRecord[] {
  const payments: PaymentRecord[] = []
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const date = new Date(renewalDate)
  date.setHours(0, 0, 0, 0)

  const cursor = new Date(date)

  while (cursor <= today) {
    payments.push({
      date: new Date(cursor).toISOString(),
      amount: price,
    })

    switch (period) {
      case 'WEEKLY':
        cursor.setDate(cursor.getDate() + 7)
        break
      case 'MONTHLY':
        cursor.setMonth(cursor.getMonth() + 1)
        break
      case 'QUARTERLY':
        cursor.setMonth(cursor.getMonth() + 3)
        break
      case 'YEARLY':
        cursor.setFullYear(cursor.getFullYear() + 1)
        break
    }
  }

  return payments.reverse()
}

// Create subscriptions color presets
export const COLOR_PRESETS = [
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#22c55e', // green
  '#10b981', // emerald
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#a855f7', // purple
  '#f43f5e', // rose
]
