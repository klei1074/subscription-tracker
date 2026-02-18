'use client'

import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { SubscriptionWithMeta, Period } from '@/types'
import Navbar from '@/components/Navbar'
import CostSummary from '@/components/CostSummary'
import UpcomingRenewalAlert from '@/components/UpcomingRenewalAlert'
import SubscriptionList from '@/components/SubscriptionList'
import SubscriptionModal from '@/components/SubscriptionModal'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { status } = useSession()

  // Subscription states
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('MONTHLY')

  // Modal popup state
  const [showModal, setShowModal] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<SubscriptionWithMeta | null>(null)

  // Delete popup state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Handles fetching subscriptions from the API
  const fetchSubscriptions = useCallback(async () => {
    try {
      setError(null)
      const { data } = await axios.get<SubscriptionWithMeta[]>('/api/subscriptions')
      setSubscriptions(data)
    } catch {
      setError('Failed to load subscriptions. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handles fetching subscription after the user has been authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSubscriptions()
    }
  }, [status, fetchSubscriptions])

  // Handles opening the create subscription modal
  function handleOpenCreate() {
    setEditingSubscription(null)
    setShowModal(true)
  }

  // Handles opening the edit subscription modal
  function handleOpenEdit(subscription: SubscriptionWithMeta) {
    setEditingSubscription(subscription)
    setShowModal(true)
  }

  // Handles closing the create or editing subscription modal
  function handleCloseModal() {
    setShowModal(false)
    setEditingSubscription(null)
  }

  // Handles opening the delete subscription modal
  async function handleDelete() {
    if (!deletingId) return
    setDeleteLoading(true)
    try {
      await axios.delete(`/api/subscriptions/${deletingId}`)
      setSubscriptions((prev) => prev.filter((s) => s.id !== deletingId))
      setDeletingId(null)
    } catch {
      // error handled by keeping dialog open
    } finally {
      setDeleteLoading(false)
    }
  }

  const deletingSubscription = deletingId
    ? subscriptions.find((s) => s.id === deletingId)
    : null

  // Shows a loading icon if the authentication status is currently loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <UpcomingRenewalAlert subscriptions={subscriptions} />

        <CostSummary
          subscriptions={subscriptions}
          period={period}
          onPeriodChange={setPeriod}
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Subscriptions
            </h2>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Track Subscription
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <SubscriptionList
              subscriptions={subscriptions}
              onEdit={handleOpenEdit}
              onDelete={setDeletingId}
              onAdd={handleOpenCreate}
            />
          )}
        </div>
      </main>

      {showModal && (
        <SubscriptionModal
          subscription={editingSubscription}
          onClose={handleCloseModal}
          onSaved={fetchSubscriptions}
        />
      )}

      {deletingId && deletingSubscription && (
        <DeleteConfirmDialog
          subscriptionName={deletingSubscription.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
