import { z } from 'zod'

export const PERIODS = ['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']
export type PeriodValue = (typeof PERIODS)[number]

// Create Subscription request schema
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  price: z.number().positive('Price must be greater than 0'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'),
  renewalDate: z.string().min(1, 'Renewal date is required'),
  period: z.enum(PERIODS),
})

// Update Subscription request schema
export const updateSubscriptionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  renewalDate: z.string().optional(),
  period: z.enum(PERIODS).optional(),
})

// Exported types inferred from our schemas
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>
