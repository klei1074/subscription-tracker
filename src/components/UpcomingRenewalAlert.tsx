import { Bell } from 'lucide-react'
import { SubscriptionWithMeta } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  subscriptions: SubscriptionWithMeta[]
}

export default function UpcomingRenewalAlert({ subscriptions }: Props) {
  const upcoming = subscriptions
    .filter((s) => s.isRenewingSoon)
    .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)

  if (upcoming.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <Bell className="w-5 h-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800">
          {upcoming.length === 1
            ? 'Upcoming renewal'
            : `${upcoming.length} upcoming renewals`}
        </p>
        <div className="mt-1 space-y-0.5">
          {upcoming.map((sub) => (
            <p key={sub.id} className="text-sm text-amber-700">
              <span className="font-medium">{sub.name}</span>
              {' — '}
              {sub.daysUntilRenewal === 0
                ? 'renews today'
                : sub.daysUntilRenewal === 1
                ? 'renews tomorrow'
                : `renews in ${sub.daysUntilRenewal} days`}
              {' ('}
              {formatDate(sub.nextRenewalDate)}
              {')'}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
