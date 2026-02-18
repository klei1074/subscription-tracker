import { SubscriptionWithMeta } from '@/types'
import SubscriptionCard from './SubscriptionCard'

interface Props {
  subscriptions: SubscriptionWithMeta[]
  onEdit: (subscription: SubscriptionWithMeta) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete, onAdd }: Props) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-gray-900 font-semibold mb-1">No subscriptions yet</h3>
        <p className="text-sm text-gray-500 mb-6">
          Start tracking your subscriptions to see your spending at a glance.
        </p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Track your first subscription
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {subscriptions.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
