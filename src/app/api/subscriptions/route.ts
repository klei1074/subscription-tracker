import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createSubscriptionSchema } from '@/lib/validations'
import {
  getNextRenewalDate,
  getDaysUntilRenewal,
  isRenewingSoon,
} from '@/lib/utils'
import { Period } from '@/types'

// Handles getting a users subscriptions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    const subscriptionsWithMeta = subscriptions.map((sub) => {
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
    })

    return NextResponse.json(subscriptionsWithMeta)
  } catch (error) {
    console.error('GET /api/subscriptions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handles creating a new user subscription
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = createSubscriptionSchema.parse(body)

    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        price: data.price,
        color: data.color,
        renewalDate: new Date(data.renewalDate),
        period: data.period,
        userId: session.user.id,
      },
    })

    const period = subscription.period as Period
    const renewalDate = new Date(subscription.renewalDate)

    return NextResponse.json(
      {
        ...subscription,
        renewalDate: subscription.renewalDate.toISOString(),
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString(),
        nextRenewalDate: getNextRenewalDate(renewalDate, period).toISOString(),
        isRenewingSoon: isRenewingSoon(renewalDate, period),
        daysUntilRenewal: getDaysUntilRenewal(renewalDate, period),
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    console.error('POST /api/subscriptions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
