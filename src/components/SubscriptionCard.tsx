import { Pencil, Trash2 } from 'lucide-react'
import { SubscriptionWithMeta } from '@/types'
import { formatDate, formatCurrency, getPeriodLabel } from '@/lib/utils'

interface Props {
  subscription: SubscriptionWithMeta
  onEdit: (subscription: SubscriptionWithMeta) => void
  onDelete: (id: string) => void
}

export default function SubscriptionCard({ subscription, onEdit, onDelete }: Props) {
  const { name, price, color, period, nextRenewalDate, isRenewingSoon, daysUntilRenewal } =
    subscription

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 border-l-4 hover:shadow-md transition-shadow"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-gray-500 mt-0.5">
          <span>
            {formatCurrency(price)}/{getPeriodLabel(period)}
          </span>
          <span className="hidden sm:inline text-gray-300">·</span>
          <span
            className={
              isRenewingSoon ? 'text-amber-600 font-medium' : 'text-gray-500'
            }
          >
            {isRenewingSoon ? (
              <>
                {daysUntilRenewal === 0
                  ? 'Renews today'
                  : daysUntilRenewal === 1
                  ? 'Renews tomorrow'
                  : `Renews in ${daysUntilRenewal}d`}
              </>
            ) : (
              `Next: ${formatDate(nextRenewalDate)}`
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(subscription)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit subscription"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(subscription.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete subscription"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
