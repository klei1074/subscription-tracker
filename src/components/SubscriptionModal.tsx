'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import axios from 'axios'
import { SubscriptionWithMeta, Period } from '@/types'
import { COLOR_PRESETS, getPeriodDisplayLabel } from '@/lib/utils'

const PERIODS: Period[] = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']

interface Props {
  subscription?: SubscriptionWithMeta | null
  onClose: () => void
  onSaved: () => void
}

function toDateInputValue(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]
}

export default function SubscriptionModal({ subscription, onClose, onSaved }: Props) {
  const isEditing = !!subscription

  // Input states
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [renewalDate, setRenewalDate] = useState('')
  const [period, setPeriod] = useState<Period>('MONTHLY')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setPrice(String(subscription.price))
      setColor(subscription.color)
      setRenewalDate(toDateInputValue(subscription.renewalDate))
      setPeriod(subscription.period)
    } else {
      setName('')
      setPrice('')
      setColor('#6366f1')
      setRenewalDate('')
      setPeriod('MONTHLY')
    }
    setError(null)
  }, [subscription])

  // Code executed whenever the form is submitted
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please enter a valid price greater than 0.')
      return
    }

    const payload = {
      name: name.trim(),
      price: parsedPrice,
      color,
      renewalDate,
      period,
    }

    setLoading(true)
    try {
      if (isEditing) {
        await axios.put(`/api/subscriptions/${subscription!.id}`, payload)
      } else {
        await axios.post('/api/subscriptions', payload)
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Subscription' : 'Track Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix, Spotify, GitHub..."
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="9.99"
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Billing period <span className="text-red-500">*</span>
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {getPeriodDisplayLabel(p)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Renewal date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              The date your subscription first started or last renewed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c }}
                  title={c}
                >
                  {color === c && (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : isEditing ? 'Save Subscription' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
