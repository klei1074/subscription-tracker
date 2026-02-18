'use client'

import { Trash2 } from 'lucide-react'

interface Props {
  subscriptionName: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function DeleteConfirmDialog({
  subscriptionName,
  onConfirm,
  onCancel,
  loading,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
          Delete subscription?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          <span className="font-medium text-gray-700">{subscriptionName}</span> will be
          permanently removed and cannot be recovered.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
