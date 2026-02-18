'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 text-sm">Subscription Tracker</span>
        </div>

        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? 'User'}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              <span className="text-sm text-gray-700 hidden sm:block">
                {session.user.name}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
