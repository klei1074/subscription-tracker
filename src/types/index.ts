export type Period = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'

export interface Subscription {
  id: string
  name: string
  price: number
  color: string
  renewalDate: string
  period: Period
  userId: string
  createdAt: string
  updatedAt: string
}

export interface SubscriptionWithMeta extends Subscription {
  nextRenewalDate: string
  isRenewingSoon: boolean
  daysUntilRenewal: number
}

export interface PaymentRecord {
  date: string
  amount: number
}
