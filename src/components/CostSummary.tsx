import { SubscriptionWithMeta, Period } from '@/types'
import { getTotalCost, formatCurrency, getPeriodDisplayLabel } from '@/lib/utils'

interface Props {
  subscriptions: SubscriptionWithMeta[]
  period: Period
  onPeriodChange: (period: Period) => void
}

const PERIODS: Period[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']

export default function CostSummary({ subscriptions, period, onPeriodChange }: Props) {
  const totalCost = getTotalCost(subscriptions, period)
  const monthlyTotalCost = getTotalCost(subscriptions, 'MONTHLY')
  const yearlyTotalCost = getTotalCost(subscriptions, 'YEARLY')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            {getPeriodDisplayLabel(period)} cost
          </p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalCost)}</p>
          {period !== 'MONTHLY' && (
            <p className="text-sm text-gray-400 mt-0.5">
              {formatCurrency(monthlyTotalCost)}/mo &middot; {formatCurrency(yearlyTotalCost)}/yr
            </p>
          )}
          {period === 'MONTHLY' && (
            <p className="text-sm text-gray-400 mt-0.5">
              {formatCurrency(yearlyTotalCost)}/yr
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {getPeriodDisplayLabel(p)}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            {subscriptions.length}{' '}
            {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
          </p>
        </div>
      </div>
    </div>
  )
}
