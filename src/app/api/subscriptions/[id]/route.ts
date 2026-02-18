import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateSubscriptionSchema } from '@/lib/validations'
import {
  getNextRenewalDate,
  getDaysUntilRenewal,
  isRenewingSoon,
} from '@/lib/utils'
import { Period } from '@/types'

type Params = { params: { id: string } }

function withMeta(sub: {
  id: string
  name: string
  price: number
  color: string
  renewalDate: Date
  period: string
  userId: string
  createdAt: Date
  updatedAt: Date
}) {
  const period = sub.period as Period
  const renewalDate = new Date(sub.renewalDate)
  return {
    ...sub,
    renewalDate: sub.renewalDate.toISOString(),
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
    nextRenewalDate: getNextRenewalDate(renewalDate, period).toISOString(),
    isRenewingSoon: isRenewingSoon(renewalDate, period),
    daysUntilRenewal: getDaysUntilRenewal(renewalDate, period),
  }
}

// Handles getting a specific user subscription
export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
    })

    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(withMeta(subscription))
  } catch (error) {
    console.error('GET /api/subscriptions/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handles updating a specific subscription
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.subscription.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = updateSubscriptionSchema.parse(body)

    const updated = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.renewalDate !== undefined && {
          renewalDate: new Date(data.renewalDate),
        }),
        ...(data.period !== undefined && { period: data.period }),
      },
    })

    return NextResponse.json(withMeta(updated))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('PUT /api/subscriptions/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handles deleting a specific subscription
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.subscription.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.subscription.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/subscriptions/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
